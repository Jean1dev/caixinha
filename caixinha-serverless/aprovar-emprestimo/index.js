const { Loan, Box } = require('caixinha-core/dist/src')
const { connect, getDocumentById, replaceDocumentById } = require('../v2/mongo-operations')

module.exports = async function (context, req) {
    const { email, emprestimoId } = req.body
    const collectionEmprestimo = 'solicitacao_emprestimo'

    try {
        await connect()
        const emprestimoEntity = await getDocumentById(emprestimoId, collectionEmprestimo)
        if (!emprestimoEntity) {
            throw new Error('Emprestimo not found')
        }

        const domain = Loan.from(emprestimoEntity)
        domain.addApprove()

        if (domain.approved) {
            const collectionCaixinha = 'caixinhas'
            const caixinhaEntity = await getDocumentById(emprestimoEntity['box']['_id'], collectionCaixinha)
            const box = Box.from(caixinhaEntity)
            box['currentBalance'] = domain['box']['currentBalance']
    

            domain['box']['loans'] = []
            box['loans'].push(domain)
            await replaceDocumentById(caixinhaEntity._id, collectionCaixinha, box)
        }
    
        
        await replaceDocumentById(emprestimoEntity._id, collectionEmprestimo, domain)
        
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