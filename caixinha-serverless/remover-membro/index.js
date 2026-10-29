const { Member, Box } = require('caixinha-core/dist/src')
const middleware = require('../utils/middleware')
const { resolveCircularStructureBSON, preserveLedgerBalances } = require('../utils/')
const { connect, getByIdOrThrow, replaceDocumentById } = require('../v2/mongo-operations')

async function handle(_context, req) {
    const { name, email, caixinhaID } = req.body
    await connect()
    const member = Member.build({
        name,
        email
    })

    const boxEntity = await getByIdOrThrow(caixinhaID)
    const caixinha = Box.fromJson(boxEntity)
    caixinha.removeMember(member)
    const document = resolveCircularStructureBSON(caixinha)
    preserveLedgerBalances(document, boxEntity)
    await replaceDocumentById(caixinhaID, 'caixinhas', document, {
        expectedVersion: boxEntity._version
    })
}

module.exports = async (context, req) => await middleware(context, req, handle)
