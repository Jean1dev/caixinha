const { connect, find } = require('../v2/mongo-operations')
const dispatchEvent = require('../amqp/events')
const { calculateLoanSchedule, DEFAULT_TIME_ZONE, formatDate } = require('../utils/loan-schedule')

function reminderMessage(name, dueDate, daysUntilDue) {
    const formattedDate = formatDate(dueDate, DEFAULT_TIME_ZONE)
    if (daysUntilDue < 0) {
        return `${name}, seu emprestimo esta atrasado desde ${formattedDate}`
    }
    if (daysUntilDue === 0) {
        return `${name}, seu emprestimo vence hoje, ${formattedDate}`
    }
    return `${name}, seu emprestimo vence em ${daysUntilDue} dia(s), em ${formattedDate}`
}

async function enviarEvento(loan, nextInstallment) {
    const name = loan.memberName || loan.member?.name || loan.member?._name
    const email = loan.member?.email || loan.member?._email
    if (!name || !email) return false

    const message = reminderMessage(name, nextInstallment.billingDate, nextInstallment.daysUntilDue)
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
