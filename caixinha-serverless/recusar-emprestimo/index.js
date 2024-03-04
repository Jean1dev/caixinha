const middleware = require('../utils/middleware')
const { resolveCircularStructureBSON } = require('../utils/')
const { Box, Member } = require('caixinha-core/dist/src')
const { connect, getByIdOrThrow, replaceDocumentById, upsert } = require('../v2/mongo-operations')
const dispatchEvent = require('../amqp/events')

async function handle(context, req) {
    const { reason, name, email, caixinhaId, emprestimoUid } = req.body
    await connect()

    const boxEntity = await getByIdOrThrow(caixinhaId, 'caixinhas')
    const domain = Box.fromJson(boxEntity)
    const emprestimo = domain.getLoanByUUID(emprestimoUid)
    const member = Member.build({ name, email })

    const result = emprestimo.refuse(reason, member)
    if (!result) {
        context.res = {
            status: 400,
            body: { message: 'Nao eh possivel rejeitar esse emprestimo' }
        }
    }

    await replaceDocumentById(caixinhaId, 'caixinhas', resolveCircularStructureBSON(domain))
    await upsert('emprestimos', emprestimo, { uid: emprestimo.UUID })

    const message = `${name} recusou o emprestimo -> ${reason}`

    dispatchEvent([
        {
            type: 'NOTIFICACAO',
            data: { message }
        },
        {
            type: 'EMAIL',
            data: {
                message,
                remetentes: [email]
            }
        }
    ], caixinhaId)
}

module.exports = async (context, req) => await middleware(context, req, handle)