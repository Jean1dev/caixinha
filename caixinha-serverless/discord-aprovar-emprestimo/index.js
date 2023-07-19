const { resolveCircularStructureBSON } = require('../utils')
const { Box, Member } = require('caixinha-core/dist/src')
const { connect, getByIdOrThrow, replaceDocumentById } = require('../v2/mongo-operations')
const middleware = require('../utils/middleware')

async function handle(context, req) {
    await connect()
    const { caixinhaId, emprestimoUid } = req.body

    const caixinha = Box.fromJson(await getByIdOrThrow(caixinhaId))
    const emprestimo = caixinha.getLoanByUUID(emprestimoUid)

    if (emprestimo.isApproved)
        return

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

}
module.exports = async (context, req) => await middleware(context, req, handle)