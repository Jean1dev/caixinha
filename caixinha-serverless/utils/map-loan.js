const moment = require('moment')
const { calculateLoanSchedule, formatDate, moneyValue } = require('./loan-schedule')

function mapLoan(item, caixinha, options) {
    const schedule = calculateLoanSchedule(item, options)

    return {
        requiredNumberOfApprovals: item.requiredNumberOfApprovals,
        description: item.description,
        approvals: item.approvals,
        interest: moneyValue(item.interest),
        fees: moneyValue(item.fees),
        valueRequested: moneyValue(item.valueRequested),
        date: moment(item.date).format('DD/MM/YYYY'),
        totalValue: moneyValue(item.totalValue || item.valueRequested),
        approved: item.approved,
        uid: item.uid,
        memberName: item.memberName,
        remainingAmount: schedule.remainingAmount,
        totalPaid: schedule.totalPaid,
        paidInstallments: schedule.paidInstallments,
        nextBillingDate: schedule.nextBillingDate ? formatDate(schedule.nextBillingDate) : null,
        isOverdue: schedule.isOverdue,
        isPaidOff: item.isPaidOff,
        caixinha: caixinha?.name,
        caixinhaId: caixinha?._id?.toString?.() || caixinha?.id?.toString?.(),
        parcelas: item.installments,
        billingDates: schedule.installments.map(installment => ({
            valor: installment.value,
            data: installment.billingDate ? formatDate(installment.billingDate) : null,
            paidAmount: installment.paidAmount,
            status: installment.status
        }))
    }
}

module.exports = mapLoan
