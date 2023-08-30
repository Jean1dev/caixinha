const { Member, Box } = require('caixinha-core/dist/src')
const middleware = require('../utils/middleware')
const { resolveCircularStructureBSON } = require('../utils/')
const { connect, getByIdOrThrow, replaceDocumentById } = require('../v2/mongo-operations')

async function handle(_context, req) {
    const { name, email, caixinhaID } = req.body
    await connect()
    const member = Member.build({
        name,
        email
    })

    const caixinha = Box.fromJson(await getByIdOrThrow(caixinhaID))
    caixinha.removeMember(member)
    await replaceDocumentById(caixinhaID, 'caixinhas', resolveCircularStructureBSON(caixinha))
}

module.exports = async (context, req) => await middleware(context, req, handle)