const { connect, find } = require("../v2/mongo-operations");
const moment = require('moment')
const dispatchEvent = require('../amqp/events')

function enviarEvento({ name, email, dia }) {
    dispatchEvent([
        {
            type: 'NOTIFICACAO',
            data: { message: `${name} seu emprestimo esta vencendo pague até dia ${dia}` }
        },
        {
            type: 'EMAIL',
            data: {
                message: `${name} seu emprestimo esta vencendo pague até dia ${dia}`,
                remetentes: [email]
            }
        }
    ], 'default-all')
}

async function verificarSeHouvePagamentoNoMes(emprestimoEntity) {
    const collectionName = 'caixinhas'
    const caixinhas = await find(collectionName, { 'loans.uid': emprestimoEntity['uid'] })
    if (!caixinhas || caixinhas.length == 0) {
        return true
    }

    const currentLoan = caixinhas[0]['loans'].find(loan => loan['uid'] == emprestimoEntity['uid'])
    const lastPayment = currentLoan['payments'][currentLoan['payments'].length - 1]
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    const lastPaymentMonth = new Date(lastPayment['date']).getMonth()
    const lastPaymentYear = new Date(lastPayment['date']).getFullYear()
    if (currentMonth == lastPaymentMonth && lastPaymentYear == currentYear) {
        return false
    }

    return true
}

module.exports = async function (context, _myTimer) {
    const timeStamp = new Date().toISOString();
    context.log('Notificacao vencimento emprestimo trigger function ran!', timeStamp);

    await connect()
    const results = await find('emprestimos', { approved: true })
    context.log(`${results.length} encontrados`)
    const hoje = moment()

    results.forEach(emprestimo => {
        if (emprestimo.isPaidOff) {
            context.log('emprestimo ja foi pago ', emprestimo._id)
            return
        }

        if (emprestimo['installments'] == 0) {
            const vencimentoEmprestimo = moment(emprestimo['billingDates'][0])
            if (hoje.isSameOrAfter(vencimentoEmprestimo))
                return

            const diferenciaDias = hoje.diff(vencimentoEmprestimo, 'days')
            if (diferenciaDias >= -3) {
                enviarEvento({
                    name: emprestimo['memberName'],
                    email: emprestimo['member']['email'],
                    dia: vencimentoEmprestimo.format('DD/MM/YYYY')
                })
                return
            }

            return
        }

        emprestimo['billingDates'].forEach(dataVencimento => {
            const vencimento = moment(dataVencimento)
            if (hoje.isSameOrAfter(vencimento))
                return

            const diferenciaDias = hoje.diff(vencimento, 'days')
            if (diferenciaDias >= -3) {
                verificarSeHouvePagamentoNoMes(emprestimo)
                    .then(enviarNotificacao => {
                        if (enviarNotificacao)
                            enviarEvento({
                                name: emprestimo['memberName'],
                                email: emprestimo['member']['email'],
                                dia: vencimento.format('DD/MM/YYYY')
                            })
                    })

            }
        })
    })

};