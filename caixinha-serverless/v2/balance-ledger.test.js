const { buildHistoricalLedger, calculateBalances } = require('./balance-ledger')

describe('balance ledger', () => {
    test('uses integer cents for cash and reservations', () => {
        expect(calculateBalances([
            { cashDeltaCents: 100000, reservedDeltaCents: 0 },
            { cashDeltaCents: 0, reservedDeltaCents: 80000 },
            { cashDeltaCents: -80000, reservedDeltaCents: -80000 }
        ])).toEqual({
            cashBalanceCents: 20000,
            reservedBalanceCents: 0,
            availableBalanceCents: 20000
        })
    })

    test('reconstructs the anonymized production totals without treating renegotiation as cash', () => {
        const box = {
            performance: [{ value: { value: 781.82 } }],
            loans: [{
                uid: 'original', approved: true, valueRequested: { value: 22433.94 },
                payments: [{ value: { value: 19789.036363636365 } }]
            }]
        }
        const deposits = [{ _id: 'all', value: { value: 3350.61 } }]
        const result = buildHistoricalLedger({ box, deposits, finishedRenegotiations: [] })

        expect(result.balances.cashBalanceCents).toBe(148753)
        expect(result.balances.availableBalanceCents).toBe(148753)
    })

    test('a replacement loan is not counted as a second disbursement', () => {
        const oldLoan = {
            uid: 'old', approved: true, valueRequested: { value: 1000 }, payments: [{ value: { value: 400 } }]
        }
        const newLoan = { uid: 'new', approved: true, valueRequested: { value: 650 }, payments: [] }
        const result = buildHistoricalLedger({
            box: { loans: [newLoan] },
            deposits: [{ _id: 'd', value: { value: 1000 } }],
            finishedRenegotiations: [{ _id: 'r', oldLoan, newLoan }]
        })

        expect(result.balances.cashBalanceCents).toBe(40000)
    })
})
