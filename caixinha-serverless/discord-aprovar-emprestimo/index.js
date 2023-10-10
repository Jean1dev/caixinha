const { resolveCircularStructureBSON } = require('../utils')
const { Box, Member } = require('caixinha-core/dist/src')
const { connect, getByIdOrThrow, replaceDocumentById, upsert } = require('../v2/mongo-operations')
const middleware = require('../utils/middleware')
const dispatch = require('../amqp/events')

async function handle(context, req) {
    context.log(`function run ${new Date().toString()}`)
    const { caixinhaId, emprestimoUid } = req.body

    await connect()

    context.log(`conectado no mongo`)
    const caixinha = Box.fromJson(await getByIdOrThrow(caixinhaId))
    context.log(`caixinha com ${caixinha.totalMembers} membros encontrada`)

    const emprestimo = caixinha.getLoanByUUID(emprestimoUid)

    if (emprestimo.isApproved) {
        context.res = {
            status: 400,
            body: {
                message: `emprestimo ja foi aprovado`
            }
        }

        return
    }

    context.log(`emprestimo encontrado ${emprestimo.UUID}`)
    caixinha['members']
        .map(member => Member.build({ name: member.name, email: member.email }))
        .forEach(member => {
            try {
                emprestimo.addApprove(member)
            } catch (error) {
                context.log(`error ir try catch ${error.message}`)
            }
        });

    caixinha['loans'] = caixinha._loans.filter(loan => {
        if (loan.UUID === emprestimoUid && !loan.isApproved)
            return false

        return true
    })

    await replaceDocumentById(caixinhaId, 'caixinhas', resolveCircularStructureBSON(caixinha))
    await upsert('emprestimos', { approved: true }, { uid: emprestimo.UUID })
    dispatch({
        type: 'EMPRESTIMO_APROVADO',
        data: {
            memberName: emprestimo._member.memberName,
            emprestimoId: emprestimoUid,
            caixinhaid: caixinhaId
        }
    })

    context.res = {
        body: {
            emprestimo
        }
    }
}

module.exports = async (context, req) => await middleware(context, req, handle)