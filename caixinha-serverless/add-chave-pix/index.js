const { resolveCircularStructureBSON, preserveLedgerBalances } = require('../utils')
const middleware = require('../utils/middleware')
const { connect, getByIdOrThrow, replaceDocumentById } = require('../v2/mongo-operations')
const { Box } = require('caixinha-core/dist/src')

async function addChavePix(_context, req) {
    const { 
        key, 
        url, 
        caixinhaId,
        replace
    } = req.body

    await connect()
    const boxEntity = await getByIdOrThrow(caixinhaId)
    const box = Box.fromJson(boxEntity)

    if (replace) {
        box['bankAccount'] = null
    }
    
    box.addBankAccount(key, url)

    const document = resolveCircularStructureBSON(box)
    preserveLedgerBalances(document, boxEntity)
    await replaceDocumentById(caixinhaId, 'caixinhas', document, {
        expectedVersion: boxEntity._version
    })
}

module.exports = async (context, req) => await middleware(context, req, addChavePix)
