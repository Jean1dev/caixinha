const AddIntencaoExecucao = require('../add-intencao-core/apply') 

module.exports = async function (context, req) {
    const { insta, email, whats } = req.body
    
    const result = await AddIntencaoExecucao({ insta, email, whats })

    context.res = {
        body: result
    };
}