const { Box } = require('caixinha-core/dist/src')
const { connect, getDocumentById, replaceDocumentById } = require('../v2/mongo-operations')

module.exports = async function (context, req) {
    const { email, emprestimoId } = req.body
    const collectionName = 'caixinhas'

    try {
        await connect()
        const caixinhaEntity = await getDocumentById(process.env.CAIXINHA_ID, collectionName)
        if (!caixinhaEntity) {
            throw new Error('caixinha not found')
        }

        const domain = Box.fromJson(caixinhaEntity)

        const emprestimo = domain.loans.find(loan => loan.uid === emprestimoId)
        if (!emprestimo) {
            throw new Error('emprestimo not found')
        }

        emprestimo.addApprove()
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

        delete emprestimo['box']
        await replaceDocumentById(caixinhaEntity._id, collectionName, domain)

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