const middleware = require('../utils/middleware')
const { resolveCircularStructureBSON } = require('../utils/')
const { Box, Member, Payment } = require('caixinha-core/dist/src')
const { connect, getByIdOrThrow, replaceDocumentById } = require('../v2/mongo-operations')

async function pagamentoEmprestimo(context, req) {
    const collectionName = 'caixinhas'

    const { caixinhaId, emprestimoUid, valor, name, email, comprovante } = req.body
    await connect()

    const boxEntity = await getByIdOrThrow(caixinhaId, collectionName)
    const domain = Box.fromJson(boxEntity)

    const emprestimo = domain.getLoanByUUID(emprestimoUid)

    const member = Member.build({ name, email })
    const payment = new Payment({ member, value: valor, description: 'Pago via caixinha web' })
    emprestimo.addPayment(payment)

    await replaceDocumentById(caixinhaId, collectionName, resolveCircularStructureBSON(domain))
}

module.exports = async (context, req) => await middleware(context, req, pagamentoEmprestimo)