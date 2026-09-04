const middleware = require('../utils/middleware')
const { Box, Member } = require('caixinha-core/dist/src')
const { connect, getByIdOrThrow, replaceDocumentById, upsert, withTransaction = async work => work() } = require('../v2/mongo-operations')
const { resolveCircularStructureBSON } = require('../utils')
const dispatch = require('../amqp/events')
const { assertAvailableBalance, getSafeAvailableBalance } = require('../utils/safe-balance')
const { appendLedgerEntry } = require('../v2/ledger-operations')
const { ENTRY_TYPES } = require('../v2/balance-ledger')
const { toCents } = require('../utils/money')

async function aprovarEmprestimo(context, req) {
    const { memberName, emprestimoId, caixinhaid } = req.body
    const collectionName = 'caixinhas'

    await connect()
    const result = await withTransaction(async session => {
        const caixinhaEntity = await getByIdOrThrow(caixinhaid, collectionName, { session })
        const willApprove = loan => !loan.approved && loan.approvals + 1 >= loan.requiredNumberOfApprovals
        const rawLoan = caixinhaEntity.loans.find(item => item.uid === emprestimoId)
        if (!rawLoan) throw new Error('Loan not found')
        const finalApproval = willApprove(rawLoan)
        if (finalApproval && !caixinhaEntity.balances?.ledgerActive) {
            assertAvailableBalance(await getSafeAvailableBalance(caixinhaEntity, { session }), rawLoan.valueRequested.value)
        }
        const domainEntity = finalApproval && caixinhaEntity.balances?.ledgerActive
            ? { ...caixinhaEntity, currentBalance: { value: caixinhaEntity.balances.cashBalanceCents / 100 } }
            : caixinhaEntity
        const domain = Box.fromJson(domainEntity)
        const emprestimo = domain.getLoanByUUID(emprestimoId)
        emprestimo.addApprove(new Member(memberName))

        const uuidAdicionados = []
        domain['loans'] = domain['loans'].filter(iterator => {
            if (uuidAdicionados.includes(iterator.uid)) return false
            uuidAdicionados.push(iterator.uid)
            return true
        })
        const document = resolveCircularStructureBSON(domain)
        if (finalApproval) {
            await appendLedgerEntry(caixinhaEntity, document, {
                operationId: `loan:${emprestimo.UUID}:disbursement`,
                type: ENTRY_TYPES.LOAN_DISBURSEMENT,
                cashDeltaCents: -toCents(emprestimo.value),
                reservedDeltaCents: -toCents(emprestimo.value),
                occurredAt: new Date()
            }, session)
            await upsert('emprestimos', { approved: true }, { uid: emprestimo.UUID }, { session })
        }
        await replaceDocumentById(caixinhaEntity._id, collectionName, document, {
            expectedVersion: caixinhaEntity._version, session
        })
        return { approved: emprestimo.isApproved, uid: emprestimo.UUID, member: emprestimo._member.memberName }
    })

    if (result.approved) {
        dispatch([
            {
                type: 'EMPRESTIMO_APROVADO',
                data: { memberName, emprestimoId, caixinhaid }
            },
            {
                type: 'SMS',
                data: { message: `Emprestimo aprovado ${result.member}` }
            }
        ], caixinhaid)

    }

    context.res = {
        body: {
            aprovado: result.approved,
            uid: result.uid,
            id: caixinhaid
        }
    }
}

module.exports = async (context, req) => await middleware(context, req, aprovarEmprestimo)
