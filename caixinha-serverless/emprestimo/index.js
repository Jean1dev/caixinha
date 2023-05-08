const { Member, Box, Loan } = require('caixinha-core/dist/src')
const { connect, getDocumentById, insertDocument } = require('../v2/mongo-operations')

module.exports = async function (context, req) {
    try {
        const { valor, juros, parcela, motivo, memberName, email } = req.body

        await connect()
        const member = Member.build({ name: memberName, email })
        const boxEntity = await getDocumentById(process.env.CAIXINHA_ID, 'caixinhas')

        const box = Box.from(boxEntity)
        box['_id'] = boxEntity._id
        const emprestimo = new Loan({
            box,
            member,
            valueRequested: valor,
            interest: juros,
            fees: parcela,
            description: motivo
        })

        await insertDocument('solicitacao_emprestimo', emprestimo)

        context.res = {
            body: emprestimo
        }
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