const middleware = require('../utils/middleware')
const { resolveCircularStructureBSON } = require('../utils/')
const { Box, Member } = require('caixinha-core/dist/src')
const { 
    connect, 
    getByIdOrThrow, 
    replaceDocumentById, 
    deleteByProjection,
    insertDocument
} = require('../v2/mongo-operations')
const dispatchEvent = require('../amqp/events')

async function handle(context, req) {
    const { name, email, caixinhaId, emprestimoUid } = req.body
    await connect()

    const boxEntity = await getByIdOrThrow(caixinhaId, 'caixinhas')
    const domain = Box.fromJson(boxEntity)
    const emprestimo = domain.getLoanByUUID(emprestimoUid)
    const member = Member.build({ name, email })

    domain.memberTryRemoveLoan(member, emprestimoUid)

    await replaceDocumentById(caixinhaId, 'caixinhas', resolveCircularStructureBSON(domain))
    await deleteByProjection({ uid: emprestimoUid }, 'emprestimos')
    await insertDocument('emprestimos_removidos', emprestimo)

    const message = `${name} removeu o emprestimo`

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