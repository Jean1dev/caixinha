const { Box } = require("caixinha-core/dist/src/boxes/Box");
const { connect, insertDocument, find, deleteAll } = require("../v2/mongo-operations");
const { CalculateAssetDevlopment } = require('caixinha-core/dist/src/useCase');
const { asyncAPM } = require("../utils/apm");

module.exports = async function (_context, _myTimer) {
    _context.log('Calculando balanço patrimonial')

    await connect()

    const droped = await deleteAll('evolucaoPatrimonial')
    if (!droped) {
        return
    }

    const arr = await find('caixinhas')
    const boxes = arr
        .map(b => {
            const box = Box.fromJson(b)
            box['id'] = b._id
            return box
        })

    for (const iterator of boxes) {
        try {
            const result = CalculateAssetDevlopment(iterator, new Date().getMonth() + 1)
            await insertDocument('evolucaoPatrimonial', { idCaixinha: iterator.id, ...result })   
        } catch (error) {
            asyncAPM(error)
        }
    }

};