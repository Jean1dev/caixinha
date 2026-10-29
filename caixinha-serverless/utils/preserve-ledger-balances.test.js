const { preserveLedgerBalances } = require('./index')

describe('preserveLedgerBalances', () => {
    test('keeps balances already set by appendLedgerEntry', () => {
        const serialized = {
            currentBalance: { value: 50 },
            balances: {
                ledgerActive: true,
                availableBalanceCents: 5000,
                cashBalanceCents: 5000,
                reservedBalanceCents: 0,
                balanceVersion: 3
            }
        }
        const boxEntity = {
            _id: 'abc',
            balances: {
                ledgerActive: true,
                availableBalanceCents: 1000,
                cashBalanceCents: 1000,
                reservedBalanceCents: 0,
                balanceVersion: 2
            }
        }

        preserveLedgerBalances(serialized, boxEntity)

        expect(serialized.balances.balanceVersion).toBe(3)
        expect(serialized.balances.availableBalanceCents).toBe(5000)
        expect(serialized._id).toBe('abc')
    })

    test('copies ledger balances when replace would wipe them', () => {
        const serialized = { currentBalance: { value: 999 } }
        const boxEntity = {
            _id: 'box-1',
            _version: 7,
            balances: {
                ledgerActive: true,
                availableBalanceCents: 165453,
                cashBalanceCents: 165453,
                reservedBalanceCents: 0,
                balanceVersion: 5
            }
        }

        preserveLedgerBalances(serialized, boxEntity)

        expect(serialized.balances).toEqual(boxEntity.balances)
        expect(serialized.currentBalance.value).toBe(1654.53)
        expect(serialized._id).toBe('box-1')
        expect(serialized._version).toBe(7)
    })
})
