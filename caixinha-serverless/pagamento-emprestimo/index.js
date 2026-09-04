const middleware = require('../utils/middleware')
const { resolveCircularStructureBSON } = require('../utils/')
const { Box, Member, Payment } = require('caixinha-core/dist/src')
const { connect, getByIdOrThrow, replaceDocumentById, upsert, withTransaction = async work => work() } = require('../v2/mongo-operations')
const dispatchEvent = require('../amqp/events')
const { appendLedgerEntry } = require('../v2/ledger-operations')
const { ENTRY_TYPES } = require('../v2/balance-ledger')
const { toCents } = require('../utils/money')
const { randomUUID } = require('crypto')

async function pagamentoEmprestimo(_context, req) {
    const collectionName = 'caixinhas'

    const { caixinhaId, emprestimoUid, valor, name, email, comprovante } = req.body
    await connect()

    const operationId = `loan:${emprestimoUid}:payment:${randomUUID()}`
    const emprestimo = await withTransaction(async session => {
        const boxEntity = await getByIdOrThrow(caixinhaId, collectionName, { session })
        const domain = Box.fromJson(boxEntity)
        const emprestimo = domain.getLoanByUUID(emprestimoUid)
        const member = Member.build({ name, email })
        emprestimo.addPayment(new Payment({ member, value: valor, description: 'Pago via caixinha web' }))
        const document = resolveCircularStructureBSON(domain)
        await appendLedgerEntry(boxEntity, document, {
            operationId, type: ENTRY_TYPES.LOAN_PAYMENT,
            cashDeltaCents: toCents(valor), reservedDeltaCents: 0, occurredAt: new Date()
        }, session)
        await replaceDocumentById(caixinhaId, collectionName, document, {
            expectedVersion: boxEntity._version, session
        })
        if (emprestimo._isPaidOff) {
            await upsert('emprestimos', { isPaidOff: true, comprovante }, { uid: emprestimo.UUID }, { session })
        }
        return emprestimo
    })

    const mensagemEmprestimo = emprestimo._isPaidOff
        ? `${name} quitou seu emprestimo com o pagamento de R$${valor}`
        : `${name} pagou uma parte de seu emprestimo, valor pago R$${valor}, valor restante ${emprestimo._remainingAmount}`

    dispatchEvent([
        {
            type: 'NOTIFICACAO',
            data: { message: mensagemEmprestimo }
        },
        {
            type: 'EMAIL',
            data: {
                message: `${name} valor R$${valor} recebido referente seu emprestimo`,
                remetentes: [email]
            }
        }
    ], caixinhaId)
}

module.exports = async (context, req) => await middleware(context, req, pagamentoEmprestimo)
