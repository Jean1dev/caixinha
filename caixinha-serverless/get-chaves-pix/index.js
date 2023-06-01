const { connect, getByIdOrThrow } = require('../v2/mongo-operations')

module.exports = async function (context, req) {
    const caixinhaId = req.query.caixinhaId
    await connect()
    const entity = await getByIdOrThrow(caixinhaId)
    context.res = {
        body: entity.bankAccount
    }
}