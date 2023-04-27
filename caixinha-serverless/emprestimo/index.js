const CaixinhaCore = require('caixinha-core/dist/lib')
const { connect, createNewEmprestimo, getDiscordNoZapBox } = require('../nosql/mongo-operations')

module.exports = async function (context, req) {
    try {
        const { valor, juros, parcela, motivo, memberName } = req.body

        await connect()

        const member = new CaixinhaCore.default.Member(memberName)
        const boxEntity = await getDiscordNoZapBox()

        const box = CaixinhaCore.default.Box.from(boxEntity)
        const emprestimo = new CaixinhaCore.default.Loan({
            box,
            member,
            valueRequested: valor,
            interest: juros,
            fees: parcela,
            description: motivo
        })

        
        await createNewEmprestimo({ valor, juros, parcela, motivo, memberName })
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