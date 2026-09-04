const middleware = require('../utils/middleware')
const { Box, Deposit, Member } = require('caixinha-core/dist/src')
const { connect, getByIdOrThrow, replaceDocumentById, insertDocument, withTransaction = async work => work() } = require('../v2/mongo-operations')
const { resolveCircularStructureBSON } = require('../utils')
const dispatchEvent = require('../amqp/events')
const { appendLedgerEntry } = require('../v2/ledger-operations')
const { ENTRY_TYPES } = require('../v2/balance-ledger')
const { toCents } = require('../utils/money')
const { randomUUID } = require('crypto')

async function deposito(_context, req) {
    const { caixinhaId, valor, name, email, comprovante } = req.body
    const collection = 'caixinhas'
    const valorNumber = Number(valor)

    await connect()
    const operationId = `deposit:${randomUUID()}`
    const deposit = await withTransaction(async session => {
        const boxEntity = await getByIdOrThrow(caixinhaId, collection, { session })
        const box = Box.fromJson(boxEntity)
        const deposit = new Deposit({ value: valorNumber, member: Member.build({ name, email }) })
        if (comprovante) deposit.addProofReceipt(comprovante)
        box.deposit(deposit)
        const document = resolveCircularStructureBSON(box)
        await appendLedgerEntry(boxEntity, document, {
            operationId, type: ENTRY_TYPES.DEPOSIT,
            cashDeltaCents: toCents(valorNumber), reservedDeltaCents: 0, occurredAt: new Date()
        }, session)
        await replaceDocumentById(caixinhaId, collection, document, {
            expectedVersion: boxEntity._version, session
        })
        await insertDocument('depositos', { idCaixinha: boxEntity._id, ...deposit }, { session })
        return deposit
    })

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
