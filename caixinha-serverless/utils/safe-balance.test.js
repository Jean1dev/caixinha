jest.mock('../v2/mongo-operations', () => ({ find: jest.fn() }))

const { assertAvailableBalance, legacyRenegotiationDriftCents } = require('./safe-balance')

describe('safe balance', () => {
    test('reproduces only the mutations from legacy finished renegotiations', () => {
        const drift = legacyRenegotiationDriftCents([
            {
                status: 'FINISHED',
                oldLoan: { valueRequested: { value: 2524 } },
                newLoan: { valueRequested: { value: 2100 } }
            },
            {
                status: 'FINISHED',
                balanceMutationApplied: false,
                oldLoan: { valueRequested: { value: 720 } },
                newLoan: { valueRequested: { value: 200 } }
            },
            { status: 'PENDING', oldLoan: { valueRequested: { value: 1000 } } }
        ])

        expect(drift).toBe(42400)
    })

    test('rejects a request above the safe available balance with HTTP 409 metadata', () => {
        expect(() => assertAvailableBalance(751.38, 800)).toThrow(
            expect.objectContaining({ code: 'INSUFFICIENT_AVAILABLE_BALANCE', status: 409 })
        )
        expect(() => assertAvailableBalance(1487.53, 800)).not.toThrow()
    })
})
