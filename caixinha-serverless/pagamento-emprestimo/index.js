const middleware = require('../utils/middleware')
const { resolveCircularStructureBSON } = require('../utils/')
const { Box, Member, Payment } = require('caixinha-core/dist/src')
const { connect, getByIdOrThrow, replaceDocumentById } = require('../v2/mongo-operations')
const dispatchEvent = require('../amqp/events')

async function pagamentoEmprestimo(_context, req) {
    const collectionName = 'caixinhas'

    const { caixinhaId, emprestimoUid, valor, name, email, comprovante } = req.body
    await connect()

    const boxEntity = await getByIdOrThrow(caixinhaId, collectionName)
    const domain = Box.fromJson(boxEntity)

    const emprestimo = domain.getLoanByUUID(emprestimoUid)

    const member = Member.build({ name, email })
    const payment = new Payment({ member, value: valor, description: 'Pago via caixinha web' })
    emprestimo.addPayment(payment)

    await replaceDocumentById(caixinhaId, collectionName, resolveCircularStructureBSON(domain))

    const mensagemEmprestimo = emprestimo._isPaidOff
        ? `${name} quitou seu emprestimo com o pagamento de R$${valor}`
        : `${name} pagou uma parte de seu emprestimo, valor pago R$${valor}, valor restante ${emprestimo._remainingAmount}`

    dispatchEvent([
        {
            type: 'NOTIFICACAO',
            data: { message: mensagemEmprestimo }
        },
        {
            type: 'EMAIL',
            data: {
                message: `${name} valor R$${valor} recebido referente seu emprestimo`,
                remetentes: [email]
            }
        }
    ])
}

module.exports = async (context, req) => await middleware(context, req, pagamentoEmprestimo)