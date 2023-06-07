const middleware = require('../utils/middleware')
const { connect, getByIdOrThrow } = require('../v2/mongo-operations')

async function getChavesPix(context, req) {
    const caixinhaId = req.query.caixinhaId
    await connect()
    const entity = await getByIdOrThrow(caixinhaId)
    context.res = {
        body: entity.bankAccount
    }
}

module.exports = async (context, req) => await middleware(context, req, getChavesPix)