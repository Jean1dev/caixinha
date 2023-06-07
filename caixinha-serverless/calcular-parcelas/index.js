const middleware = require('../utils/middleware')
const { CalculateInstallmentsValue } = require('caixinha-core/dist/src/useCase')

async function calcularParcelas(context, req) {
    const { parcelas, total } = req.body
    context.res = {
        body: CalculateInstallmentsValue(total, parcelas)
    };
}

module.exports = async (context, req) => await middleware(context, req, calcularParcelas)