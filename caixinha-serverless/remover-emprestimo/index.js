const middleware = require('../utils/middleware')
const { resolveCircularStructureBSON } = require('../utils/')
const { Box, Member } = require('caixinha-core/dist/src')
const { 
    connect, 
    getByIdOrThrow, 
    replaceDocumentById, 
    deleteByProjection,
    insertDocument,
    withTransaction = async work => work()
} = require('../v2/mongo-operations')
const dispatchEvent = require('../amqp/events')
const { appendLedgerEntry } = require('../v2/ledger-operations')
const { ENTRY_TYPES } = require('../v2/balance-ledger')
const { toCents, valueOf } = require('../utils/money')

async function handle(context, req) {
    const { name, email, caixinhaId, emprestimoUid } = req.body
    await connect()

    await withTransaction(async session => {
        const boxEntity = await getByIdOrThrow(caixinhaId, 'caixinhas', { session })
        const rawLoan = boxEntity.loans.find(item => item.uid === emprestimoUid)
        const domain = Box.fromJson(boxEntity)
        const emprestimo = domain.getLoanByUUID(emprestimoUid)
        const member = Member.build({ name, email })
        domain.memberTryRemoveLoan(member, emprestimoUid)
        const document = resolveCircularStructureBSON(domain)
        if (!rawLoan.approved) {
            await appendLedgerEntry(boxEntity, document, {
                operationId: `loan:${emprestimoUid}:reservation-release:removed`,
                type: ENTRY_TYPES.LOAN_RESERVATION_RELEASE,
                cashDeltaCents: 0,
                reservedDeltaCents: -toCents(valueOf(rawLoan.valueRequested)),
                occurredAt: new Date()
            }, session)
        }
        await replaceDocumentById(caixinhaId, 'caixinhas', document, { expectedVersion: boxEntity._version, session })
        await deleteByProjection({ uid: emprestimoUid }, 'emprestimos', { session })
        await insertDocument('emprestimos_removidos', emprestimo, { session })
    })

    const message = `${name} removeu o emprestimo`

    dispatchEvent([
        {
            type: 'NOTIFICACAO',
            data: { message }
        },
        {
            type: 'EMAIL',
            data: {
                message,
                remetentes: [email]
            }
        }
    ], caixinhaId)
}

module.exports = async (context, req) => await middleware(context, req, handle)
