const middleware = require('../utils/middleware')
const { Box, Deposit, Member } = require('caixinha-core/dist/src')
const { connect, getByIdOrThrow, replaceDocumentById, insertDocument } = require('../v2/mongo-operations')
const { resolveCircularStructureBSON } = require('../utils')
const sendSMS = require('../utils/sendSMS')
const dispatchEvent = require('../amqp/events')

async function deposito(context, req) {
    const { caixinhaId, valor, name, email, comprovante } = req.body
    const collection = 'caixinhas'

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
    sendSMS(`Novo deposito do ${name}`)
    dispatchEvent({
        type: 'DEPOSITO',
        data: deposit
    })
}

module.exports = async (context, req) => await middleware(context, req, deposito)