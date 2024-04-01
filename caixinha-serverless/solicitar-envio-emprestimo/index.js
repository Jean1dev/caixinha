const { Box, FullDataMember } = require('caixinha-core/dist/src')
const middleware = require('../utils/middleware')
const { connect, find, getByIdOrThrow, findWithLimit, insertDocument } = require('../v2/mongo-operations')
const dispatch = require('../amqp/events')

async function handle(_context, req) {
    const { caixinhaId, emprestimoUid } = req.body

    await connect()
    const collectionName = 'registro_solicitacao_pagamento'
    const comprovanteSolicitacaoPagamento = await find(collectionName, {
        caixinhaId,
        emprestimoUid
    })

    if (comprovanteSolicitacaoPagamento[0] && comprovanteSolicitacaoPagamento[0]['enviado']) {
        throw new Error('pagamento já solicitado')
    }

    const caixinha = Box.fromJson(await getByIdOrThrow(caixinhaId))
    const emprestimo = caixinha.getLoanByUUID(emprestimoUid)

    if (!emprestimo.isApproved || emprestimo._isPaidOff) {
        throw new Error('emprestimo nao esta aprovado ou já foi concluido')
    }

    const membroData = await findWithLimit('membros', { name: emprestimo._member.memberName, email: emprestimo._member._email }, 1)
    if (membroData.length == 0) {
        throw new Error('Usuario não tem um perfil criado')
    }

    const membroDomain = FullDataMember.fromJson(membroData[0])
    const pix = membroDomain?.bankAccount?.keysPix[0]

    if (!pix) {
        throw new Error('Usuario não tem chave pix cadastrada')
    }

    dispatch({
        type: 'FINANCE',
        subtype: 'sendPix',
        data: {
            valor: Number(emprestimo.value.toFixed(2)),
            favorecido: emprestimo._member.memberName,
            pix: pix
        }
    }, caixinhaId)

    await insertDocument(collectionName, {
        caixinhaId,
        emprestimoUid,
        enviado: true
    })
}

module.exports = async (context, req) => await middleware(context, req, handle)
