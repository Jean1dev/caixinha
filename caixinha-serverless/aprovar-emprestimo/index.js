const middleware = require('../utils/middleware')
const { Box, Member } = require('caixinha-core/dist/src')
const { connect, getByIdOrThrow, replaceDocumentById, upsert } = require('../v2/mongo-operations')
const { resolveCircularStructureBSON } = require('../utils')
const dispatch = require('../amqp/events')

async function aprovarEmprestimo(context, req) {
    const { memberName, emprestimoId, caixinhaid } = req.body
    const collectionName = 'caixinhas'

    await connect()
    const caixinhaEntity = await getByIdOrThrow(caixinhaid, collectionName)

    const domain = Box.fromJson(caixinhaEntity)

    const emprestimo = domain.getLoanByUUID(emprestimoId)

    emprestimo.addApprove(new Member(memberName))
    if (emprestimo.isApproved) {
        dispatch([
            {
                type: 'EMPRESTIMO_APROVADO',
                data: { memberName, emprestimoId, caixinhaid }
            },
            {
                type: 'SMS',
                data: { message: `Emprestimo aprovado ${emprestimo._member.memberName}` }
            }
        ], caixinhaid)

        const uuidAdicionados = []
        domain['loans'] = domain['loans'].filter(iterator => {
            if (uuidAdicionados.includes(iterator.uid)) {
                return false
            }

            uuidAdicionados.push(iterator.uid)
            return true
        })
        await upsert('emprestimos', { approved: true }, { uid: emprestimo.UUID })
    }

    await replaceDocumentById(caixinhaEntity._id, collectionName, resolveCircularStructureBSON(domain))

    context.res = {
        body: {
            aprovado: emprestimo.isApproved,
            uid: emprestimo.UUID,
            id: caixinhaid
        }
    }
}

module.exports = async (context, req) => await middleware(context, req, aprovarEmprestimo)