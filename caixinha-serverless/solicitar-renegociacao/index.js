const { Box, Renegotiation } = require('caixinha-core/dist/src')
const { SuggestRenegotiationSimpleInterest } = require('caixinha-core/dist/src/useCase')
const middleware = require('../utils/middleware')
const { connect, getByIdOrThrow, insertDocument } = require('../v2/mongo-operations')
const dispatch = require('../amqp/events')

function resolveBSONStructureRenegociacao(reneg) {
    reneg['oldLoan']['box'] = null
    return reneg
}

async function handle(context, req) {
    const { caixinhaId, emprestimoUid } = req.body

    await connect()

    const caixinha = Box.fromJson(await getByIdOrThrow(caixinhaId))
    const emprestimo = caixinha.getLoanByUUID(emprestimoUid)

    const reneg = Renegotiation.create(emprestimo)
    const sugestao = SuggestRenegotiationSimpleInterest(reneg)

    reneg['boxId'] = caixinhaId
    const { insertedId } = await insertDocument('renegociacoes', resolveBSONStructureRenegociacao(reneg))

    dispatch([
        {
            type: 'EMAIL',
            data: {
                message: `Sugestao de renegociacao aberta para o emprestimo -> ${emprestimo.UUID}`,
                remetentes: ['jeanlucafp@gmail.com', emprestimo._member._email]
            }
        },
        {
            type: 'NOTIFICACAO',
            data: { message: `${emprestimo._member.memberName} Solicitou a renegociacao de seu emprestimo atrasado` }
        }
    ], caixinhaId)

    context.res = {
        body: {
            renegId: insertedId,
            sugestao
        }
    }
}

module.exports = async (context, req) => await middleware(context, req, handle)
