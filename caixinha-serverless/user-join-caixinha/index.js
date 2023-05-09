const { Member, Box } = require('caixinha-core/dist/src')
const { connect, getDocumentById, replaceDocumentById } = require('../v2/mongo-operations')

module.exports = async function (context, req) {
    try {
        const { nick: name, email, boxId } = req.body
        const member = Member.build({ name: name, email })

        await connect()

        const caixinhaCollection = 'caixinhas'
        const boxEntity = await getDocumentById(boxId, caixinhaCollection)

        if (!boxEntity)
            throw new Error('Box not found')

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