const { resolveCircularStructureBSON } = require('../utils')
const middleware = require('../utils/middleware')
const { Member, Box } = require('caixinha-core/dist/src')
const { connect, replaceDocumentById, getByIdOrThrow } = require('../v2/mongo-operations')

async function joinCaixinha(_context, req) {
    const { nick: name, email, boxId } = req.body
    const member = Member.build({ name: name, email })

    await connect()

    const caixinhaCollection = 'caixinhas'
    const boxEntity = await getByIdOrThrow(boxId, caixinhaCollection)

    const box = Box.fromJson(boxEntity)
    box.joinMember(member)

    await replaceDocumentById(boxEntity._id, caixinhaCollection, resolveCircularStructureBSON(box))
}

module.exports = async (context, req) => await middleware(context, req, joinCaixinha)