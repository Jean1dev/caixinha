const { MongoClient, ObjectId } = require('mongodb')
const { buildHistoricalLedger, ENTRY_TYPES, calculateBalances } = require('../v2/balance-ledger')

function readArgument(name) {
    const prefix = `--${name}=`
    return process.argv.find(argument => argument.startsWith(prefix))?.slice(prefix.length)
}

async function main() {
    const uri = process.env.MONGO_CONNECTION
    const boxId = readArgument('box-id')
    const bankBalanceArgument = readArgument('bank-balance-cents')
    const statementReference = readArgument('statement-reference')
    const approvedBy = readArgument('approved-by')
    const apply = process.argv.includes('--apply')
    if (!uri || !boxId) throw new Error('MONGO_CONNECTION and --box-id are required')
    if (apply && !bankBalanceArgument) throw new Error('--bank-balance-cents is required with --apply')
    if (apply && (!statementReference || !approvedBy)) {
        throw new Error('--statement-reference and --approved-by are required with --apply')
    }
    if (apply && process.env.CONFIRM_BALANCE_RECONCILIATION !== `${boxId}:${bankBalanceArgument}`) {
        throw new Error('CONFIRM_BALANCE_RECONCILIATION must match boxId:bankBalanceCents')
    }

    const client = new MongoClient(uri)
    await client.connect()
    try {
        const db = client.db('caixinha')
        const id = new ObjectId(boxId)
        const box = await db.collection('caixinhas').findOne({ _id: id })
        if (!box) throw new Error('Caixinha not found')
        if (apply && box.balances?.ledgerActive) {
            console.log(JSON.stringify({ mode: 'apply', boxId, status: 'already-active' }, null, 2))
            return
        }
        const deposits = await db.collection('depositos').find({ idCaixinha: id }).toArray()
        const renegotiations = await db.collection('renegociacoes').find({
            boxId: boxId,
            status: 'FINISHED'
        }).toArray()
        const historical = buildHistoricalLedger({ box, deposits, finishedRenegotiations: renegotiations })
        const report = {
            mode: apply ? 'apply' : 'dry-run',
            boxId,
            storedBalanceCents: Math.round(Number(box.currentBalance?.value || 0) * 100),
            reconstructedBalanceCents: historical.balances.cashBalanceCents,
            entryCount: historical.entries.length
        }
        console.log(JSON.stringify(report, null, 2))
        if (!apply) return

        const bankBalanceCents = Number(bankBalanceArgument)
        if (!Number.isSafeInteger(bankBalanceCents)) throw new Error('Bank balance must be integer cents')
        const adjustment = bankBalanceCents - historical.balances.cashBalanceCents
        const entries = [...historical.entries]
        if (adjustment !== 0) {
            entries.push({
                operationId: `balance-adjustment:${boxId}:${new Date().toISOString()}`,
                type: ENTRY_TYPES.BALANCE_ADJUSTMENT,
                cashDeltaCents: adjustment,
                reservedDeltaCents: 0,
                occurredAt: new Date(),
                metadata: {
                    reason: 'BANK_STATEMENT_RECONCILIATION',
                    statementReference,
                    approvedBy
                }
            })
        }
        const balances = { ...calculateBalances(entries), ledgerActive: true, balanceVersion: 1 }
        await db.collection('caixinha_ledger').createIndex(
            { boxId: 1, operationId: 1 }, { unique: true }
        )
        const session = client.startSession()
        try {
            await session.withTransaction(async () => {
                await db.collection('caixinha_balance_backups').insertOne({
                    boxId: id,
                    createdAt: new Date(),
                    box,
                    renegotiations
                }, { session })
                if (entries.length) {
                    await db.collection('caixinha_ledger').insertMany(entries.map(entry => ({
                        ...entry,
                        boxId: id,
                        createdAt: new Date()
                    })), { ordered: true, session })
                }
                await db.collection('caixinhas').updateOne({ _id: id }, {
                    $set: {
                        balances,
                        'currentBalance.value': bankBalanceCents / 100
                    }
                }, { session })
            })
        } finally {
            await session.endSession()
        }
    } finally {
        await client.close()
    }
}

main().catch(error => {
    console.error(error.message)
    process.exitCode = 1
})
