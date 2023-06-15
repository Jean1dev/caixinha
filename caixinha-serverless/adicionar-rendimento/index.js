const { Box } = require('caixinha-core/dist/src')
const { resolveCircularStructureBSON } = require('../utils')
const middleware = require('../utils/middleware')
const { connect, getByIdOrThrow, replaceDocumentById } = require('../v2/mongo-operations')

async function addRendimento(context, req) {
    await connect()
    const { data } = req.body

    for (const iterator of data) {
        const caixinha = Box.fromJson(await getByIdOrThrow(iterator.id))
        caixinha.addPerformance(iterator.valor)
        await replaceDocumentById(iterator.id, 'caixinhas', resolveCircularStructureBSON(caixinha))
    }

}

module.exports = async (context, req) => await middleware(context, req, addRendimento)