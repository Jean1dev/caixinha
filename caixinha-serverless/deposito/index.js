const middleware = require('../utils/middleware')
const { Box, Deposit, Member } = require('caixinha-core/dist/src')
const { connect, getByIdOrThrow, replaceDocumentById, insertDocument } = require('../v2/mongo-operations')
const { resolveCircularStructureBSON } = require('../utils')
const dispatchEvent = require('../amqp/events')

async function deposito(_context, req) {
    const { caixinhaId, valor, name, email, comprovante } = req.body
    const collection = 'caixinhas'
    const valorNumber = Number(valor)

    await connect()
    const boxEntity = await getByIdOrThrow(caixinhaId, collection)
    const box = Box.fromJson(boxEntity)
    const deposit = new Deposit({
        value: valorNumber,
        member: Member.build({ name, email })
    })

    if (comprovante) {
        deposit.addProofReceipt(comprovante)
    }

    box.deposit(deposit)
    await replaceDocumentById(caixinhaId, collection, resolveCircularStructureBSON(box))
    await insertDocument('depositos', { idCaixinha: boxEntity._id, ...deposit })

    const events = [
        {
            type: 'EMAIL',
            data: {
                message: `Seu Deposito de R$${valorNumber} foi processado na caixinha ${name}`,
                remetentes: [email],
                templateCode: 1,
                customBodyProps: {
                    username: name,
                    operation: 'DEPOSITO',
                    amount: valorNumber,
                    totalAmount: valorNumber
                }
            }
        },
        {
            type: 'DEPOSITO',
            data: { image: comprovante, ...deposit }
        },
        {
            type: 'SMS',
            data: { message: `Novo deposito do ${name} - valor ${valorNumber}` }
        }
    ]
    dispatchEvent(events, caixinhaId)
}

module.exports = async (context, req) => await middleware(context, req, deposito)