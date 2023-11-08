const { Box } = require('caixinha-core/dist/src/boxes/Box')
const middleware = require('../utils/middleware')
const { connect, find } = require('../v2/mongo-operations')
const { ReportPendingLoan } = require('caixinha-core/dist/src/useCase')

async function reportDividas(context, _) {
    await connect()
    const caixinhas = await find('caixinhas')
    const result = caixinhas.map(caixinha => {
        const box = Box.fromJson(caixinha)
        const report = ReportPendingLoan(box)
        return {
            caixinhaId: caixinha._id,
            report
        }
    })

    context.res = {
        body: result
    }
}

module.exports = async (context, req) => await middleware(context, req, reportDividas)