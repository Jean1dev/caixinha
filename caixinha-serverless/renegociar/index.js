const { Box, Renegotiation, Member } = require('caixinha-core/dist/src')
const { AcceptRenegotiation } = require('caixinha-core/dist/src/useCase')
const middleware = require('../utils/middleware')
const { connect, getByIdOrThrow, insertDocument, deleteByProjection, replaceDocumentById } = require('../v2/mongo-operations')
const dispatch = require('../amqp/events')
const { resolveCircularStructureBSON } = require('../utils')

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

async function atualizarRenegociacao(renegociacao, boxID, renegociacaoId) {
    renegociacao['boxId'] = boxID
    await replaceDocumentById(renegociacaoId, COLLECTION_RENEGOCIACOES, resolveBSONStructureRenegociacao(renegociacao))
}

async function salvarNovoEmprestimo(newLoan) {
    delete newLoan['box']
    await insertDocument(COLLECTION_EMPRESTIMOS, newLoan)
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

    const renegociacao = await getByIdOrThrow(renegociacaoId, COLLECTION_RENEGOCIACOES)
    const caixinha = Box.fromJson(await getByIdOrThrow(renegociacao.boxId))
    renegociacao['oldLoan']['box'] = caixinha
    setMemberInstance(renegociacao)

    const reneg = Renegotiation.fromJson(renegociacao)

    const { reneg: novaRenegociacao, newLoan } = AcceptRenegotiation(
        caixinha,
        reneg,
        reneg.owner,
        {
            installmentOptions: parcelas,
            newTotalValue: valorProposta
        }
    )

    const { deletedCount } = await deleteByProjection({ uid: novaRenegociacao.originLoan.UUID }, COLLECTION_EMPRESTIMOS)
    context.log('deleted count', deletedCount)

    await salvarNovoEmprestimo(newLoan)
    await replaceDocumentById(renegociacao.boxId, 'caixinhas', resolveCircularStructureBSON(caixinha))
    await atualizarRenegociacao(novaRenegociacao, renegociacao.boxId, renegociacaoId)
    notificar(reneg.owner, renegociacaoId, renegociacao.boxId)
}

module.exports = async (context, req) => await middleware(context, req, handle)
