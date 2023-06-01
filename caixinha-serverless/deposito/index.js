const { Box, Deposit, Member } = require('caixinha-core/dist/src')
const { connect, getByIdOrThrow, replaceDocumentById, insertDocument } = require('../v2/mongo-operations')
const { resolveCircularStructureBSON } = require('../utils')

module.exports = async function (context, req) {
    const { caixinhaId, valor, name, email, comprovante } = req.body
    const collection = 'caixinhas'

    try {
        await connect()
        const boxEntity = await getByIdOrThrow(caixinhaId, collection)
        const box = Box.fromJson(boxEntity)
        const deposit = new Deposit({
            value: Number(valor),
            member: Member.build({ name, email })
        })

        if (comprovante) {
            deposit.addProofReceipt(comprovante)
        }

        box.deposit(deposit)
        await replaceDocumentById(caixinhaId, collection, resolveCircularStructureBSON(box))
        await insertDocument('depositos', { idCaixinha: boxEntity._id, ...deposit })

    } catch (error) {
        context.log(error.message)
        context.res = {
            status: 400,
            body: {
                message: error.message
            }
        }
    }

}