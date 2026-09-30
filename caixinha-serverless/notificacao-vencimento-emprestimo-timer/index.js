const { connect, find } = require('../v2/mongo-operations')
const dispatchEvent = require('../amqp/events')
const { calculateLoanSchedule, DEFAULT_TIME_ZONE, formatDate } = require('../utils/loan-schedule')
const { toCents, fromCents } = require('../utils/money')

function formatBRL(value) {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function reminderMessage(name, dueDate, daysUntilDue, pendingValue) {
    const formattedDate = formatDate(dueDate, DEFAULT_TIME_ZONE)
    const pending = pendingValue == null ? '' : `, valor pendente ${formatBRL(pendingValue)}`
    if (daysUntilDue < 0) {
        return `${name}, seu emprestimo esta atrasado desde ${formattedDate}${pending}`
    }
    if (daysUntilDue === 0) {
        return `${name}, seu emprestimo vence hoje, ${formattedDate}${pending}`
    }
    return `${name}, seu emprestimo vence em ${daysUntilDue} dia(s), em ${formattedDate}${pending}`
}

async function enviarEvento(loan, nextInstallment) {
    const name = loan.memberName || loan.member?.name || loan.member?._name
    const email = loan.member?.email || loan.member?._email
    if (!name || !email) return false

    const pendingValue = fromCents(toCents(nextInstallment.value) - toCents(nextInstallment.paidAmount))
    const message = reminderMessage(name, nextInstallment.billingDate, nextInstallment.daysUntilDue, pendingValue)
    await dispatchEvent([
        {
            type: 'NOTIFICACAO',
            data: { message: `${message}. Digite o comando $up para ver informacoes do ultimo emprestimo` }
        },
        {
            type: 'EMAIL',
            data: { message, remetentes: [email] }
        }
    ], 'default-all')
    return true
}

module.exports = async function (context, _myTimer) {
    const now = new Date()
    context.log('Notificacao vencimento emprestimo trigger function ran!', now.toISOString())

    await connect()
    const caixinhas = await find('caixinhas', { 'loans.approved': true })
    const loans = caixinhas.flatMap(caixinha => caixinha.loans || [])
    context.log(`${loans.length} encontrados`)

    for (const loan of loans) {
        if (!loan.approved || loan.isPaidOff) continue

        const schedule = calculateLoanSchedule(loan, { now, timeZone: DEFAULT_TIME_ZONE })
        const nextInstallment = schedule.installments.find(installment => installment.status !== 'paid')
        if (!nextInstallment || nextInstallment.daysUntilDue == null) continue
        if (nextInstallment.daysUntilDue > 3) continue

        await enviarEvento(loan, nextInstallment)
    }
}

module.exports.reminderMessage = reminderMessage
