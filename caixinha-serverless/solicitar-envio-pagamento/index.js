const { Box, FullDataMember } = require('caixinha-core/dist/src')
const middleware = require('../utils/middleware')
const { connect, find, getByIdOrThrow, findWithLimit, insertDocument } = require('../v2/mongo-operations')
const http = require('http')

const url = 'caixinha-financeira.azurewebsites.net'

function enviarRequisicao(payload) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(payload)

        const options = {
            port: 80,
            hostname: url,
            path: '/pix',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'X-API-KEY': process.env.CAIXINHA_FINANCEIRA_API_KEY
            },
        }

        const req = http.request(options, (res) => {
            let responseBody = '';

            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                resolve(responseBody);
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);

        req.setTimeout(15000, () => {
            req.abort(); // Aborta a requisição em caso de timeout
            reject(new Error('Timeout de requisição excedido.'));
        });

        req.end();
    })
}

async function handle(context, req) {
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

    const responseApi = await enviarRequisicao({
        chaveFavorecido: pix,
        chavePagador: 'cb1c2dad-c099-4f47-b03e-f8b1ae683260',
        valor: emprestimo.value.toFixed(2)
    })

    if (responseApi.key) {
        await insertDocument(collectionName, {
            identificacaoPix: responseApi.key,
            caixinhaId,
            emprestimoUid,
            enviado: true
        })
    }

    context.res = {
        body: responseApi
    }
}

module.exports = async (context, req) => await middleware(context, req, handle)