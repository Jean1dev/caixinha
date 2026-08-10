let mockCaixinhas = []
const mockDispatch = jest.fn(() => Promise.resolve(true))

jest.mock('../amqp/events', () => (...args) => mockDispatch(...args))
jest.mock('../v2/mongo-operations.js', () => ({
    connect: jest.fn(() => Promise.resolve()),
    find: jest.fn(() => Promise.resolve(mockCaixinhas))
}))

const timerFunction = require('./index')

const payment = value => ({ value: { value } })

function makeLoan(overrides = {}) {
    return {
        approved: true,
        isPaidOff: false,
        memberName: 'Jean',
        member: { email: 'jean@example.com' },
        uid: 'loan-1',
        totalValue: { value: 300 },
        installments: 3,
        billingDates: [
            new Date('2026-08-13T12:00:00.000Z'),
            new Date('2026-09-12T12:00:00.000Z'),
            new Date('2026-10-12T12:00:00.000Z')
        ],
        payments: [],
        ...overrides
    }
}

async function runAt(date, loans = [makeLoan()]) {
    jest.setSystemTime(new Date(`${date}T12:00:00.000Z`))
    mockCaixinhas = [{ loans }]
    await timerFunction({ log: jest.fn() }, null)
}

describe('notificacao-vencimento-emprestimo-timer', () => {
    beforeAll(() => jest.useFakeTimers())
    afterAll(() => jest.useRealTimers())
    beforeEach(() => {
        mockCaixinhas = []
        mockDispatch.mockReset()
        mockDispatch.mockResolvedValue(true)
    })

    it('does not notify at D-4', async () => {
        await runAt('2026-08-09')
        expect(mockDispatch).not.toHaveBeenCalled()
    })

    it.each([
        ['2026-08-10', 'vence em 3 dia(s)'],
        ['2026-08-13', 'vence hoje'],
        ['2026-08-14', 'esta atrasado desde']
    ])('notifies at the expected boundary on %s', async (date, text) => {
        await runAt(date)

        expect(mockDispatch).toHaveBeenCalledTimes(1)
        const events = mockDispatch.mock.calls[0][0]
        expect(events).toHaveLength(2)
        expect(events[0].data.message).toContain(text)
        expect(events[1].data.remetentes).toEqual(['jean@example.com'])
    })

    it('advances to the first installment not fully covered', async () => {
        await runAt('2026-09-09', [makeLoan({ payments: [payment(100)] })])

        expect(mockDispatch).toHaveBeenCalledTimes(1)
        expect(mockDispatch.mock.calls[0][0][0].data.message).toContain('12/09/2026')
    })

    it('does not suppress an overdue reminder after a partial payment', async () => {
        await runAt('2026-08-14', [makeLoan({ payments: [payment(50)] })])

        expect(mockDispatch).toHaveBeenCalledTimes(1)
        expect(mockDispatch.mock.calls[0][0][0].data.message).toContain('13/08/2026')
    })

    it('does not notify paid-off or unapproved loans', async () => {
        await runAt('2026-08-14', [
            makeLoan({ uid: 'paid', isPaidOff: true }),
            makeLoan({ uid: 'unapproved', approved: false })
        ])

        expect(mockDispatch).not.toHaveBeenCalled()
    })

    it('sends only one reminder when several installments are overdue', async () => {
        await runAt('2026-10-01')

        expect(mockDispatch).toHaveBeenCalledTimes(1)
        expect(mockDispatch.mock.calls[0][0][0].data.message).toContain('13/08/2026')
    })

    it('waits for the dispatch to finish', async () => {
        let releaseDispatch
        mockDispatch.mockImplementation(() => new Promise(resolve => { releaseDispatch = resolve }))
        jest.setSystemTime(new Date('2026-08-10T12:00:00.000Z'))
        mockCaixinhas = [{ loans: [makeLoan()] }]

        let finished = false
        const execution = timerFunction({ log: jest.fn() }, null).then(() => { finished = true })
        await Promise.resolve()
        await Promise.resolve()
        expect(finished).toBe(false)

        releaseDispatch(true)
        await execution
        expect(finished).toBe(true)
    })
})
