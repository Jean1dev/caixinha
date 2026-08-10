let mockBoxes = []

jest.mock('../v2/mongo-operations', () => ({
    connect: jest.fn(() => Promise.resolve()),
    find: jest.fn(() => Promise.resolve(mockBoxes))
}))

const functionUnderTest = require('./index')

function reportedLoan() {
    return {
        approved: true,
        isPaidOff: false,
        requiredNumberOfApprovals: 5,
        approvals: 5,
        description: 'Impostos',
        interest: { value: 3 },
        fees: { value: 3 },
        valueRequested: { value: 3087 },
        totalValue: { value: 3182.61 },
        date: '2026-04-17T12:00:00.000Z',
        uid: 'loan-4x',
        memberName: 'Jean',
        member: { name: 'Jean', email: 'jean@example.com' },
        installments: 4,
        billingDates: [
            '2026-05-17T12:00:00.000Z',
            '2026-06-16T12:00:00.000Z',
            '2026-07-16T12:00:00.000Z',
            '2026-08-15T12:00:00.000Z'
        ],
        payments: [
            { value: { value: 795.65 } },
            { value: { value: 795.65 } }
        ]
    }
}

describe('meus-emprestimos contract', () => {
    beforeAll(() => {
        jest.useFakeTimers()
        jest.setSystemTime(new Date('2026-08-10T12:00:00.000Z'))
    })
    afterAll(() => jest.useRealTimers())

    it('returns payment progress and overdue state from real payments', async () => {
        mockBoxes = [{
            name: 'Caixinha principal',
            currentBalance: { value: 1000 },
            loans: [reportedLoan()]
        }]
        const context = { log: jest.fn() }

        await functionUnderTest(context, { query: { name: 'Jean', email: 'jean@example.com' } })

        const result = context.res.body.caixinhas[0].meusEmprestimos[0]
        expect(result).toMatchObject({
            totalPaid: 1591.3,
            paidInstallments: 2,
            nextBillingDate: '16/07/2026',
            isOverdue: true,
            remainingAmount: 1591.31
        })
        expect(result.billingDates.map(item => item.status)).toEqual(['paid', 'paid', 'overdue', 'pending'])
        expect(result.billingDates.map(item => item.valor)).toEqual([795.65, 795.65, 795.65, 795.66])
    })
})
