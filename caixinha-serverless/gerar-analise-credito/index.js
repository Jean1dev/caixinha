const middleware = require('../utils/middleware')
const { connect, getByIdOrThrow, findWithLimit } = require('../v2/mongo-operations')
const { Box } = require('caixinha-core/dist/src')
const { GenerateCreditRisk } = require('caixinha-core/dist/src/useCase')
const dispatchEvent = require('../amqp/events')

async function notificarMembers(result) {
    const messagesToDispatch = []

    for (let i = 0; i < result.length; i++) {
        const details = result[i]
        const fullMember = await findWithLimit('membros', { name: details.member.name }, 1)
        if (fullMember[0]) {
            console.log('Enviando notificacao para ', fullMember[0].email)
            const message = `Olá ${fullMember[0].name}, esse sao seus emprestimos atrasados da caixinha \n ${details.message}`
            messagesToDispatch.push({
                type: 'EMAIL',
                data: {
                    message,
                    remetentes: ['jeanlucafp@gmail.com', fullMember[0].email]
                }
            })
        }
    }

    if (messagesToDispatch.length === 0) {
        return
    }
    
    dispatchEvent(messagesToDispatch)   
}

async function handle(context, req) {
    await connect()
    const { notify, id } = req.query
    const box = Box.fromJson(await getByIdOrThrow(id))
    const result = GenerateCreditRisk(box._loans, box['members'])

    if (notify) {
        notificarMembers(result)
    }

    context.res = {
        body: result
    }
}

module.exports = async (context, req) => await middleware(context, req, handle)