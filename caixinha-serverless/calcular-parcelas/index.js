const { CalculateInstallmentsValue } = require('caixinha-core/dist/src/useCase')

module.exports = async function (context, req) {
    const { parcelas, total } = req.body
    context.res = {
        body: CalculateInstallmentsValue(total, parcelas)
    };
}