const { resolveCircularStructureBSON } = require('../utils')
const middleware = require('../utils/middleware')
const { Member, Box, Loan } = require('caixinha-core/dist/src')
const { connect, replaceDocumentById, insertDocument, getByIdOrThrow, withTransaction = async work => work() } = require('../v2/mongo-operations')
const dispatchEvent = require('../amqp/events')
const { assertAvailableBalance, getSafeAvailableBalance } = require('../utils/safe-balance')
const { appendLedgerEntry } = require('../v2/ledger-operations')
const { ENTRY_TYPES } = require('../v2/balance-ledger')
const { toCents } = require('../utils/money')

function getTodosRemetentesDaCaixinha(caixinha) {
    return caixinha._members.map(member => member._email)
}

async function emprestimo(context, req) {

    const { valor, juros, parcela, motivo, name, email, caixinhaID, fees } = req.body
    const valueRequested = Number(valor)
    const interest = Number(juros)

    await connect()
    const { member, box, emprestimo } = await withTransaction(async session => {
        const member = Member.build({ name, email })
        const boxEntity = await getByIdOrThrow(caixinhaID, 'caixinhas', { session })
        assertAvailableBalance(await getSafeAvailableBalance(boxEntity, { session }), valueRequested)
        const box = Box.fromJson(boxEntity)
        const emprestimo = new Loan({
            box, member, valueRequested, interest, fees: fees || 0,
            description: motivo, installments: parcela
        })
        emprestimo.addApprove(member)
        if (!emprestimo.isApproved) box['loans'].push(emprestimo)

        const document = resolveCircularStructureBSON(box)
        await appendLedgerEntry(boxEntity, document, {
            operationId: `loan:${emprestimo.UUID}:${emprestimo.isApproved ? 'disbursement' : 'reservation'}`,
            type: emprestimo.isApproved ? ENTRY_TYPES.LOAN_DISBURSEMENT : ENTRY_TYPES.LOAN_RESERVATION,
            cashDeltaCents: emprestimo.isApproved ? -toCents(valueRequested) : 0,
            reservedDeltaCents: emprestimo.isApproved ? 0 : toCents(valueRequested),
            occurredAt: new Date()
        }, session)
        await replaceDocumentById(boxEntity._id, 'caixinhas', document, {
            expectedVersion: boxEntity._version, session
        })
        emprestimo['box'] = undefined
        emprestimo['boxId'] = caixinhaID
        await insertDocument('emprestimos', emprestimo, { session })
        return { member, box, emprestimo }
    })

    context.res = {
        body: emprestimo.UUID
    }

    const remetentes = getTodosRemetentesDaCaixinha(box).filter(remetente => remetente !== email)

    dispatchEvent([
        {
            type: 'EMPRESTIMO',
            data: emprestimo
        }, {
            type: 'EMAIL',
            data: {
                message: `VocÊ abriu um novo emprestimo, protocolo ${emprestimo.UUID}`,
                remetentes: [member._email]
            }
        },
        {
            type: 'EMAIL',
            data: {
                message: `Novo emprestimo do ${member.memberName} - valor ${valueRequested}, verifique e aprove no discord`,
                remetentes,
                templateCode: 1,
                customBodyProps: {
                    username: member.memberName,
                    operation: 'EMPRESTIMO',
                    amount: valueRequested,
                    totalAmount: valueRequested
                }
            }
        },
        {
            type: 'SMS',
            data: { message: `Novo emprestimo do ${member.memberName} - valor ${valueRequested}` }
        }
    ], caixinhaID)
}

module.exports = async (context, req) => await middleware(context, req, emprestimo)
