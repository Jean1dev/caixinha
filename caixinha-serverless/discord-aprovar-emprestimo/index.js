const { resolveCircularStructureBSON } = require('../utils')
const { Box, Member } = require('caixinha-core/dist/src')
const { connect, getByIdOrThrow, replaceDocumentById } = require('../v2/mongo-operations')
const middleware = require('../utils/middleware')

async function handle(context, req) {
    await connect()
    const { caixinhaId, emprestimoUid } = req.body

    const caixinha = Box.fromJson(await getByIdOrThrow(caixinhaId))
    const emprestimo = caixinha.getLoanByUUID(emprestimoUid)

    caixinha['members']
        .map(member => Member.build({ name: member.name, email: member.email }))
        .forEach(member => {
            try {
                emprestimo.addApprove(member)
            } catch (error) {

            }
        });

    await replaceDocumentById(caixinhaId, 'caixinhas', resolveCircularStructureBSON(caixinha))

}
module.exports = async (context, req) => await middleware(context, req, handle)