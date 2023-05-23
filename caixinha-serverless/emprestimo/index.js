const { Member, Box, Loan } = require('caixinha-core/dist/src')
const { connect, replaceDocumentById, insertDocument, getByIdOrThrow } = require('../v2/mongo-operations')

module.exports = async function (context, req) {
    try {
        const { valor, juros, parcela, motivo, name, email, caixinhaID } = req.body

        await connect()
        const member = Member.build({ name, email })
        const boxEntity = await getByIdOrThrow(caixinhaID || process.env.CAIXINHA_ID, 'caixinhas')

        const box = Box.from(boxEntity)
        const emprestimo = new Loan({
            box,
            member,
            valueRequested: Number(valor),
            interest: Number(juros),
            fees: 0,
            description: motivo
        })
        
        emprestimo.addApprove(member)
        emprestimo['box'] = null
        box['loans'].push(emprestimo)
        await replaceDocumentById(boxEntity._id, 'caixinhas', box)
        await insertDocument('emprestimos', emprestimo)

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