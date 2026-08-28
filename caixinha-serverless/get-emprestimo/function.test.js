const mockFindWithLimit = jest.fn()

jest.mock('../v2/mongo-operations', () => ({
    connect: jest.fn(() => Promise.resolve()),
    findWithLimit: (...args) => mockFindWithLimit(...args)
}))

const functionUnderTest = require('./index')

describe('get-emprestimo contract', () => {
    beforeAll(() => {
        jest.useFakeTimers()
        jest.setSystemTime(new Date('2026-08-10T12:00:00.000Z'))
    })
    afterAll(() => jest.useRealTimers())

    it('reads the canonical loan from the box and returns the same schedule fields', async () => {
        mockFindWithLimit.mockResolvedValue([{
            _id: { toString: () => 'box-1' },
            name: 'Caixinha',
            loans: [{
                uid: 'loan-1',
                approved: true,
                memberName: 'Jean',
                interest: { value: 3 },
                fees: { value: 0 },
                valueRequested: { value: 200 },
                totalValue: { value: 200 },
                date: '2026-06-01T12:00:00.000Z',
                installments: 2,
                billingDates: ['2026-07-01T12:00:00.000Z', '2026-08-01T12:00:00.000Z'],
                payments: [{ value: { value: 100 } }]
            }]
        }])
        const context = { log: jest.fn() }

        await functionUnderTest(context, { query: { uid: 'loan-1' } })

        expect(mockFindWithLimit).toHaveBeenCalledWith('caixinhas', { 'loans.uid': 'loan-1' }, 1)
        expect(context.res.body).toMatchObject({
            uid: 'loan-1',
            caixinhaId: 'box-1',
            totalPaid: 100,
            paidInstallments: 1,
            nextBillingDate: '01/08/2026',
            isOverdue: true
        })
    })
})
