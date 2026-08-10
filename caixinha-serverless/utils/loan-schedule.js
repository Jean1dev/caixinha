const DEFAULT_TIME_ZONE = 'America/Sao_Paulo'
const DAY_IN_MS = 24 * 60 * 60 * 1000

function moneyValue(value) {
    if (value == null) return 0
    if (typeof value === 'number') return value
    if (typeof value.value === 'number') return value.value
    return Number(value) || 0
}

function toCents(value) {
    return Math.round((moneyValue(value) + Number.EPSILON) * 100)
}

function dateParts(value, timeZone = DEFAULT_TIME_ZONE) {
    if (typeof value === 'string') {
        const brDate = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
        if (brDate) {
            return { year: Number(brDate[3]), month: Number(brDate[2]), day: Number(brDate[1]) }
        }
    }

    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return null

    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(date)

    return {
        year: Number(parts.find(part => part.type === 'year').value),
        month: Number(parts.find(part => part.type === 'month').value),
        day: Number(parts.find(part => part.type === 'day').value)
    }
}

function dayNumber(value, timeZone) {
    const parts = dateParts(value, timeZone)
    return parts ? Math.floor(Date.UTC(parts.year, parts.month - 1, parts.day) / DAY_IN_MS) : null
}

function formatDate(value, timeZone = DEFAULT_TIME_ZONE) {
    const parts = dateParts(value, timeZone)
    if (!parts) return null
    return [parts.day, parts.month, parts.year]
        .map((part, index) => index < 2 ? String(part).padStart(2, '0') : String(part))
        .join('/')
}

function paymentTotalCents(loan) {
    return (loan.payments || []).reduce((total, payment) => total + toCents(payment.value), 0)
}

function calculateLoanSchedule(loan, options = {}) {
    const now = options.now || new Date()
    const timeZone = options.timeZone || DEFAULT_TIME_ZONE
    const totalValue = moneyValue(loan.totalValue || loan.valueRequested)
    const totalValueCents = toCents(totalValue)
    const dates = loan.billingDates || []
    const installmentCount = dates.length || Number(loan.installments || loan.parcelas) || 1
    const regularInstallmentCents = toCents(totalValue / installmentCount)
    const actualPaymentsCents = paymentTotalCents(loan)
    const allocatedPaymentsCents = loan.isPaidOff
        ? Math.max(actualPaymentsCents, totalValueCents)
        : actualPaymentsCents
    const today = dayNumber(now, timeZone)
    let availableCents = allocatedPaymentsCents

    const installments = Array.from({ length: installmentCount }, (_, index) => {
        const isLast = index === installmentCount - 1
        const valueCents = isLast
            ? Math.max(totalValueCents - regularInstallmentCents * (installmentCount - 1), 0)
            : regularInstallmentCents
        const paidAmountCents = Math.min(Math.max(availableCents, 0), valueCents)
        availableCents -= paidAmountCents

        const billingDate = dates[index]?.data || dates[index] || null
        const dueDay = billingDate == null ? null : dayNumber(billingDate, timeZone)
        const fullyPaid = paidAmountCents >= valueCents
        const overdue = !fullyPaid && dueDay != null && today != null && dueDay < today
        const status = fullyPaid
            ? 'paid'
            : overdue
                ? 'overdue'
                : paidAmountCents > 0
                    ? 'partial'
                    : 'pending'

        return {
            billingDate,
            value: valueCents / 100,
            paidAmount: paidAmountCents / 100,
            status,
            daysUntilDue: dueDay == null || today == null ? null : dueDay - today
        }
    })

    const nextInstallment = installments.find(installment => installment.status !== 'paid') || null
    const paidInstallments = installments.filter(installment => installment.status === 'paid').length

    return {
        totalPaid: Math.min(allocatedPaymentsCents, totalValueCents) / 100,
        remainingAmount: Math.max(totalValueCents - allocatedPaymentsCents, 0) / 100,
        paidInstallments,
        nextBillingDate: nextInstallment?.billingDate || null,
        isOverdue: Boolean(nextInstallment && nextInstallment.daysUntilDue < 0),
        installments
    }
}

module.exports = {
    DEFAULT_TIME_ZONE,
    calculateLoanSchedule,
    formatDate,
    moneyValue
}
