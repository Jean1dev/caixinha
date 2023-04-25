const CaixinhaCore = require('caixinha-core/dist/lib')
const SaveData = require('./apply')

module.exports = async function (context, req) {
    try {
        const { valor, juros, parcela, motivo, memberName } = req.body

        const member = new CaixinhaCore.default.Member(memberName)
        const box = new CaixinhaCore.default.Box()
        box['currentBalance'] = 85
        const emprestimo = new CaixinhaCore.default.Loan({
            box,
            member,
            valueRequested: valor,
            interest: juros,
            fees: parcela
            //motivo
        })

        await SaveData({ valor, juros, parcela, motivo, memberName })
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