const { connect, getByIdOrThrow, replaceDocumentById } = require('../v2/mongo-operations')
const { Box } = require('caixinha-core/dist/src')

module.exports = async function (_context, req) {
    const { key, url, caixinhaId } = req.body
    await connect()
    const box = Box.fromJson(await getByIdOrThrow(caixinhaId))
    box.addBankAccount(key, url)
    await replaceDocumentById(caixinhaId, 'caixinhas', box)
}