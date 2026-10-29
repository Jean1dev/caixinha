const { MongoClient, ObjectId } = require('mongodb')
const { calculateBalances, ENTRY_TYPES } = require('../v2/balance-ledger')
const { toCents, fromCents, valueOf } = require('../utils/money')

function readArgument(name) {
    const prefix = `--${name}=`
    return process.argv.find(argument => argument.startsWith(prefix))?.slice(prefix.length)
}

function sameInstant(a, b, toleranceMs = 1000) {
    if (!a || !b) return false
    return Math.abs(new Date(a).getTime() - new Date(b).getTime()) <= toleranceMs
}

function findMatchingEntry(entries, predicate) {
    return entries.find(predicate)
}

async function main() {
    const uri = process.env.MONGO_CONNECTION
    const boxId = readArgument('box-id')
    const apply = process.argv.includes('--apply')
    if (!uri || !boxId) throw new Error('MONGO_CONNECTION and --box-id are required')
    if (apply && process.env.CONFIRM_LEDGER_RESTORE !== boxId) {
        throw new Error('CONFIRM_LEDGER_RESTORE must equal box-id when using --apply')
    }

    const client = new MongoClient(uri)
    await client.connect()
    try {
        const db = client.db('caixinha')
        const id = new ObjectId(boxId)
        const box = await db.collection('caixinhas').findOne({ _id: id })
        if (!box) throw new Error('Caixinha not found')

        const ledger = await db.collection('caixinha_ledger').find({ boxId: id }).toArray()
        const deposits = await db.collection('depositos').find({ idCaixinha: id }).toArray()
        const renegotiations = await db.collection('renegociacoes').find({
            boxId,
            status: 'FINISHED'
        }).toArray()

        const missing = []

        for (const deposit of deposits) {
            const cents = toCents(valueOf(deposit.value))
            const matched = findMatchingEntry(ledger, entry =>
                entry.type === ENTRY_TYPES.DEPOSIT &&
                entry.cashDeltaCents === cents &&
                sameInstant(entry.occurredAt, deposit.date)
            )
            if (!matched) {
                missing.push({
                    operationId: `deposit:backfill:${deposit._id}`,
                    type: ENTRY_TYPES.DEPOSIT,
                    cashDeltaCents: cents,
                    reservedDeltaCents: 0,
                    occurredAt: deposit.date
                })
            }
        }

        for (const loan of box.loans || []) {
            const uid = loan.uid || loan.UUID
            for (const [index, payment] of (loan.payments || []).entries()) {
                const cents = toCents(valueOf(payment.value))
                const matched = findMatchingEntry(ledger, entry =>
                    entry.type === ENTRY_TYPES.LOAN_PAYMENT &&
                    String(entry.operationId || '').startsWith(`loan:${uid}:payment:`) &&
                    entry.cashDeltaCents === cents &&
                    sameInstant(entry.occurredAt, payment.date)
                )
                if (!matched) {
                    missing.push({
                        operationId: `loan:${uid}:payment:backfill:${index}`,
                        type: ENTRY_TYPES.LOAN_PAYMENT,
                        cashDeltaCents: cents,
                        reservedDeltaCents: 0,
                        occurredAt: payment.date
                    })
                }
            }
        }

        for (const renegotiation of renegotiations) {
            const operationId = `renegotiation:${renegotiation._id}`
            const matched = findMatchingEntry(ledger, entry =>
                entry.type === ENTRY_TYPES.RENEGOTIATION &&
                entry.operationId === operationId
            )
            if (!matched) {
                missing.push({
                    operationId,
                    type: ENTRY_TYPES.RENEGOTIATION,
                    cashDeltaCents: 0,
                    reservedDeltaCents: 0,
                    occurredAt: renegotiation.finishedAt || renegotiation.createdAt || new Date()
                })
            }
        }

        const allEntries = [...ledger, ...missing]
        const totals = calculateBalances(allEntries)
        const report = {
            mode: apply ? 'apply' : 'dry-run',
            boxId,
            name: box.name,
            existingLedgerEntries: ledger.length,
            missingEntries: missing.length,
            missing,
            currentBalance: valueOf(box.currentBalance),
            hadBalances: !!box.balances,
            restoredBalances: {
                ledgerActive: true,
                balanceVersion: (box.balances?.balanceVersion || ledger.length) + missing.length,
                cashBalanceCents: totals.cashBalanceCents,
                reservedBalanceCents: totals.reservedBalanceCents,
                availableBalanceCents: totals.availableBalanceCents
            },
            availableReais: fromCents(totals.availableBalanceCents)
        }
        console.log(JSON.stringify(report, null, 2))

        if (!apply) return

        const session = client.startSession()
        try {
            await session.withTransaction(async () => {
                await db.collection('caixinha_balance_backups').insertOne({
                    boxId: id,
                    createdAt: new Date(),
                    reason: 'RESTORE_WIPED_LEDGER',
                    box,
                    missing
                }, { session })

                if (missing.length) {
                    await db.collection('caixinha_ledger').insertMany(
                        missing.map(entry => ({
                            ...entry,
                            boxId: id,
                            createdAt: new Date()
                        })),
                        { ordered: true, session }
                    )
                }

                await db.collection('caixinhas').updateOne({ _id: id }, {
                    $set: {
                        balances: report.restoredBalances,
                        'currentBalance.value': fromCents(totals.availableBalanceCents)
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
