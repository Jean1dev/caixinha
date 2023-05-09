const { Member, Box, Loan } = require('caixinha-core/dist/src')
const { connect, getDocumentById, replaceDocumentById } = require('../v2/mongo-operations')

module.exports = async function (context, req) {
    try {
        const { valor, juros, parcela, motivo, memberName, email } = req.body

        await connect()
        const member = Member.build({ name: memberName, email })
        const boxEntity = await getDocumentById(process.env.CAIXINHA_ID, 'caixinhas')

        const box = Box.from(boxEntity)
        const emprestimo = new Loan({
            box,
            member,
            valueRequested: valor,
            interest: juros,
            fees: parcela,
            description: motivo
        })
        
        emprestimo['box'] = null
        box['loans'].push(emprestimo)
        await replaceDocumentById(boxEntity._id, 'caixinhas', box)

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