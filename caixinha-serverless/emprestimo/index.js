const { resolveCircularStructureBSON } = require('../utils')
const middleware = require('../utils/middleware')
const { Member, Box, Loan } = require('caixinha-core/dist/src')
const { connect, replaceDocumentById, insertDocument, getByIdOrThrow } = require('../v2/mongo-operations')
const sendSMS = require('../utils/sendSMS')

async function emprestimo(context, req) {

    const { valor, juros, parcela, motivo, name, email, caixinhaID } = req.body

    await connect()
    const member = Member.build({ name, email })
    const boxEntity = await getByIdOrThrow(caixinhaID || process.env.CAIXINHA_ID, 'caixinhas')

    const box = Box.fromJson(boxEntity)
    const emprestimo = new Loan({
        box,
        member,
        valueRequested: Number(valor),
        interest: Number(juros),
        fees: 0,
        description: motivo,
        installments: parcela
    })

    emprestimo.addApprove(member)
    emprestimo['box'] = null
    box['loans'].push(emprestimo)
    await replaceDocumentById(boxEntity._id, 'caixinhas', resolveCircularStructureBSON(box))
    await insertDocument('emprestimos', emprestimo)

    context.res = {
        body: emprestimo
    }

    sendSMS(`Novo emprestimo do ${member.memberName} - valor ${valor}`)
}

module.exports = async (context, req) => await middleware(context, req, emprestimo)