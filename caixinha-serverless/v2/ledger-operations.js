const { insertDocument } = require('./mongo-operations')
const { calculateBalances } = require('./balance-ledger')
const { fromCents, toCents, valueOf } = require('../utils/money')

function currentBalances(boxEntity) {
    if (boxEntity.balances?.ledgerActive) return boxEntity.balances
    const cashBalanceCents = toCents(valueOf(boxEntity.currentBalance))
    return {
        ledgerActive: false,
        balanceVersion: 0,
        cashBalanceCents,
        reservedBalanceCents: 0,
        availableBalanceCents: cashBalanceCents
    }
}

async function appendLedgerEntry(boxEntity, serializedBox, entry, session) {
    if (!boxEntity.balances?.ledgerActive) return false
    const before = currentBalances(boxEntity)
    const delta = calculateBalances([entry])
    const balances = {
        ledgerActive: true,
        balanceVersion: before.balanceVersion + 1,
        cashBalanceCents: before.cashBalanceCents + delta.cashBalanceCents,
        reservedBalanceCents: before.reservedBalanceCents + delta.reservedBalanceCents
    }
    balances.availableBalanceCents = balances.cashBalanceCents - balances.reservedBalanceCents
    if (balances.cashBalanceCents < 0 || balances.reservedBalanceCents < 0 || balances.availableBalanceCents < 0) {
        const error = new Error('Operacao deixaria o saldo disponivel negativo')
        error.code = 'NEGATIVE_AVAILABLE_BALANCE'
        error.status = 409
        throw error
    }

    await insertDocument('caixinha_ledger', {
        ...entry,
        boxId: boxEntity._id,
        createdAt: new Date()
    }, { session })
    serializedBox.balances = balances
    serializedBox.currentBalance = { value: fromCents(balances.availableBalanceCents) }
    return true
}

module.exports = { appendLedgerEntry, currentBalances }
