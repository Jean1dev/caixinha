const middleware = require('../utils/middleware')
const { Box } = require('caixinha-core/dist/src')
const { connect, insertDocument } = require('../v2/mongo-operations')

async function createCaixinha(context, req) {
    const { name } = req.body
    await connect()
    const box = new Box()
    box['name'] = name
    const result = await insertDocument('caixinhas', box)
    context.res = {
        body: result
    }
}

module.exports = async (context, req) => await middleware(context, req, createCaixinha)