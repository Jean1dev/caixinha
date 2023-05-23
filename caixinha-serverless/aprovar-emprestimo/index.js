const { Box, Member } = require('caixinha-core/dist/src')
const { connect, getByIdOrThrow, replaceDocumentById } = require('../v2/mongo-operations')
const { resolveCircularStructureBSON } = require('../utils')

module.exports = async function (context, req) {
    const { memberName, emprestimoId, caixinhaid } = req.body
    const collectionName = 'caixinhas'

    try {
        await connect()
        const caixinhaEntity = await getByIdOrThrow(caixinhaid, collectionName)

        const domain = Box.fromJson(caixinhaEntity)

        const emprestimo = domain.loans.find(loan => loan.uid === emprestimoId)
        if (!emprestimo) {
            throw new Error('emprestimo not found')
        }

        emprestimo.addApprove(new Member(memberName))
        if (emprestimo.isApproved) {
            const uuidAdicionados = []
            domain['loans'] = domain['loans'].filter(iterator => {
                if (uuidAdicionados.includes(iterator.uid)) {
                    return false
                }

                uuidAdicionados.push(iterator.uid)
                return true
            })
        }

        await replaceDocumentById(caixinhaEntity._id, collectionName, resolveCircularStructureBSON(domain))

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