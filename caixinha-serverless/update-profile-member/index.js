const { ObjectId } = require("mongodb");
const middleware = require("../utils/middleware");
const { connect, findWithLimit, upsert } = require('../v2/mongo-operations')
const { FullDataMember, Member } = require('caixinha-core/dist/src')

async function updateProfile(context, req) {
    const collectionName = 'membros'
    await connect()
    const { memberName, email, user } = req.body
    const data = await findWithLimit(collectionName, { name: memberName, email }, 1)
    let member

    if (!data[0]) {
        member = FullDataMember.fromMember(Member.build({ name: memberName, email }))
    } else {
        member = FullDataMember.fromJson(data[0])
    }

    if (user.phone) {
        member._phoneNumber = user.phone
    }

    if (user.accounts) {
        member['bankAccount'] = null
        member.addBankAccount(user.accounts.keyPix, user.accounts.Qrcode)
    }

    member['photoUrl'] = user.photoUrl
    const filter = { _id: new ObjectId(data[0]?._id) }
    const result = await upsert(collectionName, member, filter)
    context.log(result)
}

module.exports = async (context, req) => await middleware(context, req, updateProfile)