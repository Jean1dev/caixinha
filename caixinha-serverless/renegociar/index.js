const { Box, Renegotiation, Member } = require('caixinha-core/dist/src')
const { AcceptRenegotiation } = require('caixinha-core/dist/src/useCase')
const middleware = require('../utils/middleware')
const { connect, getByIdOrThrow, insertDocument, deleteByProjection, replaceDocumentById, withTransaction = async work => work() } = require('../v2/mongo-operations')
const dispatch = require('../amqp/events')
const { resolveCircularStructureBSON, preserveLedgerBalances } = require('../utils')
const { appendLedgerEntry } = require('../v2/ledger-operations')
const { ENTRY_TYPES } = require('../v2/balance-ledger')
const coreVersion = require('caixinha-core/package.json').version

const COLLECTION_RENEGOCIACOES = 'renegociacoes'
const COLLECTION_EMPRESTIMOS = 'emprestimos'

function resolveBSONStructureRenegociacao(reneg) {
    delete reneg['oldLoan']['box']
    delete reneg['newLoan']['box']
    return reneg
}

function setMemberInstance(renegociacaoJson) {
    const name = renegociacaoJson['oldLoan']['member']['name']
    const email = renegociacaoJson['oldLoan']['member']['email']
    renegociacaoJson['oldLoan']['member'] = Member.build({ name, email })
}

async function atualizarRenegociacao(renegociacao, boxID, renegociacaoId, session) {
    renegociacao['boxId'] = boxID
    renegociacao['coreVersion'] = coreVersion
    renegociacao['balanceMutationApplied'] = false
    await replaceDocumentById(renegociacaoId, COLLECTION_RENEGOCIACOES, resolveBSONStructureRenegociacao(renegociacao), { session })
}

async function salvarNovoEmprestimo(newLoan, session) {
    delete newLoan['box']
    await insertDocument(COLLECTION_EMPRESTIMOS, newLoan, { session })
}

function notificar(member, renegociacaoId, caixinhaId) {
    dispatch(
        [
            {
                type: 'EMAIL',
                data: {
                    message: `Seu renegociamento foi concluido -> ${renegociacaoId}`,
                    remetentes: ['jeanlucafp@gmail.com', member._email]
                }
            },
            {
                type: 'NOTIFICACAO',
                data: { message: `${member.memberName} Concluiu o renegociamento de sua divida, membros podem conferir a solicitacao no link` }
            }
        ], caixinhaId
    )
}

async function handle(context, req) {
    const {
        renegociacaoId,
        valorProposta,
        parcelas
    } = req.body

    await connect()

    const { reneg, novaRenegociacao, boxId } = await withTransaction(async session => {
        const renegociacao = await getByIdOrThrow(renegociacaoId, COLLECTION_RENEGOCIACOES, { session })
        const boxEntity = await getByIdOrThrow(renegociacao.boxId, 'caixinhas', { session })
        const caixinha = Box.fromJson(boxEntity)
        renegociacao['oldLoan']['box'] = caixinha
        setMemberInstance(renegociacao)

        const reneg = Renegotiation.fromJson(renegociacao)
        const balanceBefore = caixinha.balance

        const { reneg: novaRenegociacao, newLoan } = AcceptRenegotiation(
            caixinha,
            reneg,
            reneg.owner,
            {
                installmentOptions: parcelas,
                newTotalValue: valorProposta
            }
        )

        if (Math.abs(caixinha.balance - balanceBefore) > 0.005) {
            const error = new Error('Renegociacao alterou o saldo da caixinha')
            error.code = 'RENEGOTIATION_BALANCE_INVARIANT_VIOLATION'
            throw error
        }

        const { deletedCount } = await deleteByProjection({ uid: novaRenegociacao.originLoan.UUID }, COLLECTION_EMPRESTIMOS, { session })
        context.log('deleted count', deletedCount)

        await salvarNovoEmprestimo(newLoan, session)
        const document = resolveCircularStructureBSON(caixinha)
        await appendLedgerEntry(boxEntity, document, {
            operationId: `renegotiation:${renegociacaoId}`,
            type: ENTRY_TYPES.RENEGOTIATION,
            cashDeltaCents: 0,
            reservedDeltaCents: 0,
            occurredAt: new Date()
        }, session)
        preserveLedgerBalances(document, boxEntity)
        await replaceDocumentById(renegociacao.boxId, 'caixinhas', document, {
            expectedVersion: boxEntity._version,
            session
        })
        await atualizarRenegociacao(novaRenegociacao, renegociacao.boxId, renegociacaoId, session)
        return { reneg, novaRenegociacao, boxId: renegociacao.boxId }
    })

    notificar(reneg.owner, renegociacaoId, boxId)
}

module.exports = async (context, req) => await middleware(context, req, handle)
