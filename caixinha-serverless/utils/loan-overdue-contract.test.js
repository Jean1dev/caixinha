const { Box, Loan, Member, Payment } = require('caixinha-core/dist/src')
const { calculateLoanSchedule } = require('./loan-schedule')

const DAY_IN_MS = 24 * 60 * 60 * 1000
const atNoonUtc = date => new Date(`${date}T12:00:00.000Z`)

function buildLoan({ billingDates, paid = 0 }) {
    const member = new Member('contract-member')
    const box = new Box()
    box.joinMember(member)
    const payments = paid > 0 ? [new Payment({ member, value: paid })] : []
    const raw = {
        approved: true,
        member,
        date: billingDates[0].toISOString(),
        totalValue: { value: 300 },
        valueRequested: { value: 300 },
        remainingAmount: { value: 300 - paid },
        fees: { value: 0 },
        interest: { value: 0 },
        box,
        description: 'contract-loan',
        approvals: 1,
        memberName: member.memberName,
        requiredNumberOfApprovals: 0,
        billingDates: billingDates.map(date => date.toISOString()),
        uid: 'contract-loan',
        listOfMembersWhoHaveAlreadyApproved: [member],
        payments,
        installments: billingDates.length
    }

    return {
        domainLoan: Loan.fromBox(raw),
        scheduleLoan: {
            ...raw,
            payments: paid > 0 ? [{ value: { value: paid } }] : []
        }
    }
}

describe('loan overdue definition contract', () => {
    const now = atNoonUtc('2026-08-28')
    const overdueDate = new Date(now.getTime() - 2 * DAY_IN_MS)
    const futureDate = new Date(now.getTime() + 28 * DAY_IN_MS)

    it.each([
        { name: 'unpaid overdue installment', paid: 0, expected: true },
        { name: 'partially paid overdue installment', paid: 100, expected: true },
        { name: 'overdue installment fully covered', paid: 150, expected: false }
    ])('keeps core and presentation schedule aligned for $name', ({ paid, expected }) => {
        const { domainLoan, scheduleLoan } = buildLoan({
            billingDates: [overdueDate, futureDate],
            paid
        })

        const coreIsOverdue = domainLoan.calculateOverdueDays(now) > 0
        const scheduleIsOverdue = calculateLoanSchedule(scheduleLoan, { now }).isOverdue

        expect(coreIsOverdue).toBe(expected)
        expect(scheduleIsOverdue).toBe(coreIsOverdue)
    })

    it('keeps a due-today installment current in both implementations', () => {
        const { domainLoan, scheduleLoan } = buildLoan({
            billingDates: [now, futureDate]
        })

        expect(domainLoan.calculateOverdueDays(now)).toBe(0)
        expect(calculateLoanSchedule(scheduleLoan, { now }).isOverdue).toBe(false)
    })
})
