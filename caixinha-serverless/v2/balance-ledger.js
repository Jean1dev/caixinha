const { toCents, valueOf } = require('../utils/money')

const ENTRY_TYPES = Object.freeze({
    DEPOSIT: 'DEPOSIT',
    LOAN_RESERVATION: 'LOAN_RESERVATION',
    LOAN_RESERVATION_RELEASE: 'LOAN_RESERVATION_RELEASE',
    LOAN_DISBURSEMENT: 'LOAN_DISBURSEMENT',
    LOAN_PAYMENT: 'LOAN_PAYMENT',
    PERFORMANCE: 'PERFORMANCE',
    RENEGOTIATION: 'RENEGOTIATION',
    BALANCE_ADJUSTMENT: 'BALANCE_ADJUSTMENT'
})

function loanUid(loan) {
    return loan?.uid || loan?.UUID
}

function calculateBalances(entries) {
    const balances = entries.reduce((total, entry) => ({
        cashBalanceCents: total.cashBalanceCents + entry.cashDeltaCents,
        reservedBalanceCents: total.reservedBalanceCents + entry.reservedDeltaCents
    }), { cashBalanceCents: 0, reservedBalanceCents: 0 })

    return {
        ...balances,
        availableBalanceCents: balances.cashBalanceCents - balances.reservedBalanceCents
    }
}

function buildHistoricalLedger({ box, deposits = [], finishedRenegotiations = [] }) {
    const entries = []
    for (const deposit of deposits) {
        entries.push({
            operationId: `deposit:${deposit._id}`,
            type: ENTRY_TYPES.DEPOSIT,
            cashDeltaCents: toCents(valueOf(deposit.value)),
            reservedDeltaCents: 0,
            occurredAt: deposit.date
        })
    }
    for (const [index, performance] of (box.performance || []).entries()) {
        entries.push({
            operationId: `performance:legacy:${index}`,
            type: ENTRY_TYPES.PERFORMANCE,
            cashDeltaCents: toCents(valueOf(performance.value)),
            reservedDeltaCents: 0,
            occurredAt: performance.date
        })
    }

    const versions = new Map()
    for (const loan of box.loans || []) versions.set(loanUid(loan), loan)
    for (const renegotiation of finishedRenegotiations) {
        if (renegotiation.oldLoan) versions.set(loanUid(renegotiation.oldLoan), renegotiation.oldLoan)
    }
    const renegotiatedUids = new Set(
        finishedRenegotiations.map(item => loanUid(item.newLoan)).filter(Boolean)
    )

    for (const loan of versions.values()) {
        if (!loan.approved) continue
        const uid = loanUid(loan)
        if (!renegotiatedUids.has(uid)) {
            entries.push({
                operationId: `loan:${uid}:disbursement`,
                type: ENTRY_TYPES.LOAN_DISBURSEMENT,
                cashDeltaCents: -toCents(valueOf(loan.valueRequested)),
                reservedDeltaCents: 0,
                occurredAt: loan.date
            })
        }
        for (const [index, payment] of (loan.payments || []).entries()) {
            entries.push({
                operationId: `loan:${uid}:payment:${index}`,
                type: ENTRY_TYPES.LOAN_PAYMENT,
                cashDeltaCents: toCents(valueOf(payment.value)),
                reservedDeltaCents: 0,
                occurredAt: payment.date
            })
        }
    }

    for (const renegotiation of finishedRenegotiations) {
        entries.push({
            operationId: `renegotiation:${renegotiation._id}`,
            type: ENTRY_TYPES.RENEGOTIATION,
            cashDeltaCents: 0,
            reservedDeltaCents: 0,
            occurredAt: renegotiation.finishedAt
        })
    }

    return { entries, balances: calculateBalances(entries) }
}

module.exports = { ENTRY_TYPES, buildHistoricalLedger, calculateBalances }
