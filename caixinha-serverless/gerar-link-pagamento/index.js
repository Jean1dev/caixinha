const middleware = require('../utils/middleware')
const dispatchEvent = require('../amqp/events')

async function handle(_context, req) {
    const { name, email, valor, pix } = req.body

    if (!name || !email || !valor || !pix) {
        throw new Error('Parametros obrigatorios nao fornecidos corretamente { name, email, valor, pix }')
    }

    dispatchEvent([
        {
            type: 'NOTIFICACAO',
            data: { message: `Gerando link de pagamento para ${name}` }
        },
        {
            type: 'EMAIL',
            data: {
                message: `Gerando link de pagamento para ${name}`,
                remetentes: [email, 'jeanlucafp@gmail.com']
            }
        },
        {
            type: 'FINANCE',
            subtype: 'cobrancaImediata',
            data: {
                valor,
                nome: name,
                pix,
                cpf: '05833251907'
            }
        }
    ], 'default-all')
}

module.exports = async (context, req) => await middleware(context, req, handle)