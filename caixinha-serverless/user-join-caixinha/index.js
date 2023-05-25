const { Member, Box } = require('caixinha-core/dist/src')
const { connect, replaceDocumentById, getByIdOrThrow } = require('../v2/mongo-operations')

module.exports = async function (context, req) {
    try {
        const { nick: name, email, boxId } = req.body
        const member = Member.build({ name: name, email })

        await connect()

        const caixinhaCollection = 'caixinhas'
        const boxEntity = await getByIdOrThrow(boxId, caixinhaCollection)

        const box = Box.from(boxEntity)
        box.joinMember(member)

        await replaceDocumentById(boxEntity._id, caixinhaCollection, box)

    } catch (error) {
        context.res = {
            status: 400,
            body: {
                message: error.message
            }
        }
    }
}