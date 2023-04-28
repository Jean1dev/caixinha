const { Member, Box } = require('caixinha-core/dist/src')
const { connect, createNewMember, getBoxById } = require('../nosql/mongo-operations')

module.exports = async function (context, req) {
    try {
        const { nick: memberName, email, boxId } = req.body
        const member = new Member(memberName)

        await connect()

        const boxEntity = await getBoxById(boxId)

        if (!boxEntity) 
            throw new Error('Box not found')

        const box = Box.from(boxEntity)
        box.joinMember(member)

        const memberEntity = await createNewMember({ memberName, email })
        boxEntity.members.push(memberEntity)
        await boxEntity.save()

    } catch (error) {
        context.res = {
            status: 400,
            body: {
                message: error.message
            }
        }
    }
}