const { resolveCircularStructureBSON } = require('../utils')
const middleware = require('../utils/middleware')
const { Member, Box, Loan } = require('caixinha-core/dist/src')
const { connect, replaceDocumentById, insertDocument, getByIdOrThrow } = require('../v2/mongo-operations')
const sendSMS = require('../utils/sendSMS')
const dispatchEvent = require('../amqp/events')

async function emprestimo(context, req) {

    const { valor, juros, parcela, motivo, name, email, caixinhaID, fees } = req.body

    await connect()
    const member = Member.build({ name, email })
    const boxEntity = await getByIdOrThrow(caixinhaID, 'caixinhas')

    const box = Box.fromJson(boxEntity)
    const emprestimo = new Loan({
        box,
        member,
        valueRequested: Number(valor),
        interest: Number(juros),
        fees: fees || 0,
        description: motivo,
        installments: parcela
    })

    emprestimo.addApprove(member)
    /**
     * TODO: Provavel q vai ter um bug aqui
     * analisar se correto seria fazer essa logica dentro do core
     * cenario ao abrir um emprestimo com 1 membro ele acaba duplicando o emprestimo
     */
    if (!emprestimo.isApproved) {
        emprestimo['box'] = null
        box['loans'].push(emprestimo)
    }

    await replaceDocumentById(boxEntity._id, 'caixinhas', resolveCircularStructureBSON(box))
    emprestimo['boxId'] = caixinhaID
    await insertDocument('emprestimos', emprestimo)

    context.res = {
        body: emprestimo.UUID
    }

    sendSMS(`Novo emprestimo do ${member.memberName} - valor ${valor}`)
    dispatchEvent([
        {
            type: 'EMPRESTIMO',
            data: emprestimo
        }, {
            type: 'EMAIL',
            data: {
                message: `VocÊ abriu um novo emprestimo, protocolo ${emprestimo.UUID}`,
                remetentes: ['jeanlucafp@gmail.com', member._email]
            }
        }
    ], caixinhaID)
}

module.exports = async (context, req) => await middleware(context, req, emprestimo)