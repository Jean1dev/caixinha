const { find } = require('../v2/mongo-operations')
const { fromCents, toCents, valueOf } = require('./money')

const INSUFFICIENT_AVAILABLE_BALANCE = 'INSUFFICIENT_AVAILABLE_BALANCE'

function legacyRenegotiationDriftCents(renegotiations) {
    return renegotiations
        .filter(item => item.status === 'FINISHED' && item.balanceMutationApplied !== false)
        .reduce((total, item) => {
            const oldValue = valueOf(item.oldLoan?.valueRequested)
            const newValue = valueOf(item.newLoan?.valueRequested)
            return total + toCents(oldValue - newValue)
        }, 0)
}

async function getSafeAvailableBalance(boxEntity, options = {}) {
    if (boxEntity.balances?.ledgerActive) {
        return fromCents(boxEntity.balances.availableBalanceCents)
    }

    if (!boxEntity._id) return valueOf(boxEntity.currentBalance)

    const renegotiations = await find('renegociacoes', {
        boxId: boxEntity._id.toString(),
        status: 'FINISHED'
    }, options)
    const storedCents = toCents(valueOf(boxEntity.currentBalance))
    return fromCents(storedCents - legacyRenegotiationDriftCents(renegotiations || []))
}

async function getPublicBalances(boxEntity) {
    const availableBalance = await getSafeAvailableBalance(boxEntity)
    if (boxEntity.balances?.ledgerActive) {
        return {
            cashBalance: fromCents(boxEntity.balances.cashBalanceCents),
            reservedBalance: fromCents(boxEntity.balances.reservedBalanceCents),
            availableBalance
        }
    }
    return { cashBalance: availableBalance, reservedBalance: 0, availableBalance }
}

function assertAvailableBalance(availableBalance, requestedValue) {
    if (toCents(requestedValue) > toCents(availableBalance)) {
        const error = new Error('Saldo disponivel insuficiente para este emprestimo')
        error.code = INSUFFICIENT_AVAILABLE_BALANCE
        error.status = 409
        throw error
    }
}

module.exports = {
    INSUFFICIENT_AVAILABLE_BALANCE,
    assertAvailableBalance,
    getSafeAvailableBalance,
    getPublicBalances,
    legacyRenegotiationDriftCents
}
