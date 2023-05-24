const { resolveCircularStructureBSON } = require('../utils/')
const { Box, Member, Payment } = require('caixinha-core/dist/src')
const { connect, getByIdOrThrow, replaceDocumentById } = require('../v2/mongo-operations')

module.exports = async function (context, req) {
    const collectionName = 'caixinhas'
    try {
        const { caixinhaId, emprestimoUid, valor, name, email } = req.body
        await connect()

        const boxEntity = await getByIdOrThrow(caixinhaId, collectionName)
        const domain = Box.fromJson(boxEntity)

        const emprestimo = domain.getLoanByUUID(emprestimoUid)

        const member = Member.build({ name, email })
        const payment = new Payment(member, valor, 'Pago via Caixinha web')
        emprestimo.addPayment(payment)

        await replaceDocumentById(caixinhaId, collectionName, resolveCircularStructureBSON(domain))

    } catch (error) {
        context.log(error.message)
        context.res = {
            status: 400,
            body: {
                message: error.message
            }
        }
    }

}