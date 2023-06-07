const middleware = require('../utils/middleware')
const { connect, getByIdOrThrow, replaceDocumentById } = require('../v2/mongo-operations')
const { Box } = require('caixinha-core/dist/src')

async function addChavePix(_context, req) {
    const { key, url, caixinhaId } = req.body
    await connect()
    const box = Box.fromJson(await getByIdOrThrow(caixinhaId))
    box.addBankAccount(key, url)
    await replaceDocumentById(caixinhaId, 'caixinhas', box)
}

module.exports = async (context, req) => await middleware(context, req, addChavePix)