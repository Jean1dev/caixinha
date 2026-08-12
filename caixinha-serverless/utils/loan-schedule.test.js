const { calculateLoanSchedule, formatDate } = require('./loan-schedule')

const atNoonUtc = date => new Date(`${date}T12:00:00.000Z`)
const payment = value => ({ value: { value } })

function loan(overrides = {}) {
    return {
        totalValue: { value: 400 },
        installments: 4,
        billingDates: [
            atNoonUtc('2026-05-01'),
            atNoonUtc('2026-06-01'),
            atNoonUtc('2026-07-01'),
            atNoonUtc('2026-08-01')
        ],
        payments: [],
        ...overrides
    }
}

describe('calculateLoanSchedule', () => {
    it('formats due dates consistently in the Sao Paulo business timezone', () => {
        expect(formatDate('2026-08-14T01:00:00.000Z')).toBe('13/08/2026')
    })

    it('does not mistake scheduled values for payments', () => {
        const result = calculateLoanSchedule(loan(), { now: atNoonUtc('2026-04-01') })

        expect(result.paidInstallments).toBe(0)
        expect(result.totalPaid).toBe(0)
        expect(result.installments.every(item => item.status === 'pending')).toBe(true)
    })

    it('allocates full and partial payments to the oldest installments', () => {
        const result = calculateLoanSchedule(loan({ payments: [payment(150)] }), { now: atNoonUtc('2026-04-01') })

        expect(result.paidInstallments).toBe(1)
        expect(result.installments[0]).toMatchObject({ paidAmount: 100, status: 'paid' })
        expect(result.installments[1]).toMatchObject({ paidAmount: 50, status: 'partial' })
        expect(result.nextBillingDate).toEqual(atNoonUtc('2026-06-01'))
    })

    it('absorbs rounding differences in the last installment', () => {
        const result = calculateLoanSchedule(loan({ totalValue: { value: 3182.61 } }))

        expect(result.installments.map(item => item.value)).toEqual([795.65, 795.65, 795.65, 795.66])
        expect(result.installments.reduce((sum, item) => sum + item.value, 0)).toBeCloseTo(3182.61, 2)
    })

    it('treats a non-installment loan as one installment', () => {
        const result = calculateLoanSchedule(loan({
            installments: 0,
            billingDates: [atNoonUtc('2026-08-10')],
            payments: [payment(400)]
        }), { now: atNoonUtc('2026-08-10') })

        expect(result.installments).toHaveLength(1)
        expect(result.paidInstallments).toBe(1)
        expect(result.remainingAmount).toBe(0)
    })

    it('keeps a due-today installment current and marks it overdue the next day', () => {
        const dueToday = calculateLoanSchedule(loan({ billingDates: [atNoonUtc('2026-08-10')] }), {
            now: atNoonUtc('2026-08-10')
        })
        const overdue = calculateLoanSchedule(loan({ billingDates: [atNoonUtc('2026-08-10')] }), {
            now: atNoonUtc('2026-08-11')
        })

        expect(dueToday.isOverdue).toBe(false)
        expect(dueToday.installments[0].status).toBe('pending')
        expect(overdue.isOverdue).toBe(true)
        expect(overdue.installments[0].status).toBe('overdue')
    })

    it('reproduces the four-installment loan from the report', () => {
        const result = calculateLoanSchedule(loan({
            totalValue: { value: 3182.61 },
            billingDates: ['17/05/2026', '16/06/2026', '16/07/2026', '15/08/2026'],
            payments: [payment(795.65), payment(795.65)]
        }), { now: atNoonUtc('2026-08-10') })

        expect(result.paidInstallments).toBe(2)
        expect(result.nextBillingDate).toBe('16/07/2026')
        expect(result.isOverdue).toBe(true)
    })

    it('reproduces the ten-installment loan before and after its third due date', () => {
        const reportedLoan = loan({
            totalValue: { value: 1977.4482 },
            installments: 10,
            billingDates: [
                '15/06/2026', '15/07/2026', '14/08/2026', '13/09/2026', '13/10/2026',
                '12/11/2026', '12/12/2026', '11/01/2027', '10/02/2027', '12/03/2027'
            ],
            payments: [payment(197.74), payment(197.74)]
        })

        const before = calculateLoanSchedule(reportedLoan, { now: atNoonUtc('2026-08-10') })
        const after = calculateLoanSchedule(reportedLoan, { now: atNoonUtc('2026-08-15') })

        expect(before.paidInstallments).toBe(2)
        expect(before.nextBillingDate).toBe('14/08/2026')
        expect(before.isOverdue).toBe(false)
        expect(after.isOverdue).toBe(true)
    })

    it('uses paid-off as a safe fallback when historical payments are absent', () => {
        const result = calculateLoanSchedule(loan({ isPaidOff: true, payments: [] }))

        expect(result.paidInstallments).toBe(4)
        expect(result.totalPaid).toBe(400)
        expect(result.remainingAmount).toBe(0)
    })
})
