const { Box } = require('caixinha-core/dist/src')
const { resolveCircularStructureBSON } = require('../utils')
const middleware = require('../utils/middleware')
const { connect, getByIdOrThrow, replaceDocumentById, withTransaction = async work => work() } = require('../v2/mongo-operations')
const dispatchEvent = require('../amqp/events')
const { appendLedgerEntry } = require('../v2/ledger-operations')
const { ENTRY_TYPES } = require('../v2/balance-ledger')
const { toCents } = require('../utils/money')

async function addRendimento(context, req) {
    await connect()
    const { data } = req.body

    for (const iterator of data) {
        const caixinha = await withTransaction(async session => {
            const boxEntity = await getByIdOrThrow(iterator.id, 'caixinhas', { session })
            const caixinha = Box.fromJson(boxEntity)
            caixinha.addPerformance(iterator.valor)
            const document = resolveCircularStructureBSON(caixinha)
            await appendLedgerEntry(boxEntity, document, {
                operationId: `performance:${Date.now()}:${iterator.id}`,
                type: ENTRY_TYPES.PERFORMANCE,
                cashDeltaCents: toCents(iterator.valor),
                reservedDeltaCents: 0,
                occurredAt: new Date()
            }, session)
            await replaceDocumentById(iterator.id, 'caixinhas', document, { expectedVersion: boxEntity._version, session })
            return caixinha
        })
        dispatchEvent({
            type: 'RENDIMENTO',
            data: `Adicionado juros sob capital proprio no valor de R$${iterator.valor} na caixinha: ${caixinha['name']}`
        }, iterator.id)
    }

}

module.exports = async (context, req) => await middleware(context, req, addRendimento)
