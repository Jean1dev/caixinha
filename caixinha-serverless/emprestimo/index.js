const { resolveCircularStructureBSON } = require('../utils')
const middleware = require('../utils/middleware')
const { Member, Box, Loan } = require('caixinha-core/dist/src')
const { connect, replaceDocumentById, insertDocument, getByIdOrThrow } = require('../v2/mongo-operations')
const dispatchEvent = require('../amqp/events')

function getTodosRemetentesDaCaixinha(caixinha) {
    return caixinha._members.map(member => member._email)
}

async function emprestimo(context, req) {

    const { valor, juros, parcela, motivo, name, email, caixinhaID, fees } = req.body
    const valueRequested = Number(valor)
    const interest = Number(juros)

    await connect()
    const member = Member.build({ name, email })
    const boxEntity = await getByIdOrThrow(caixinhaID, 'caixinhas')

    const box = Box.fromJson(boxEntity)
    const emprestimo = new Loan({
        box,
        member,
        valueRequested,
        interest,
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

    const remetentes = getTodosRemetentesDaCaixinha(box).filter(remetente => remetente !== email)

    dispatchEvent([
        {
            type: 'EMPRESTIMO',
            data: emprestimo
        }, {
            type: 'EMAIL',
            data: {
                message: `VocÊ abriu um novo emprestimo, protocolo ${emprestimo.UUID}`,
                remetentes: [member._email]
            }
        },
        {
            type: 'EMAIL',
            data: {
                message: `Novo emprestimo do ${member.memberName} - valor ${valueRequested}, verifique e aprove no discord`,
                remetentes,
                templateCode: 1,
                customBodyProps: {
                    username: member.memberName,
                    operation: 'EMPRESTIMO',
                    amount: valueRequested,
                    totalAmount: valueRequested
                }
            }
        },
        {
            type: 'SMS',
            data: { message: `Novo emprestimo do ${member.memberName} - valor ${valueRequested}` }
        }
    ], caixinhaID)
}

module.exports = async (context, req) => await middleware(context, req, emprestimo)