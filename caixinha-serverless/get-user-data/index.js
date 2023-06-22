const middleware = require('../utils/middleware')
const { connect, findWithLimit } = require('../v2/mongo-operations')

async function getUserData(context, req) {
    const collectionName = 'membros'
    await connect()
    const { memberName, email } = req.query
    const data = await findWithLimit(collectionName, { name: memberName, email }, 1)
    context.res = {
        body: data.length
            ? data[0]
            : {}
    }
}

module.exports = async (context, req) => await middleware(context, req, getUserData)