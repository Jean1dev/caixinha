const middleware = require('../utils/middleware')
const { connect, findWithLimit } = require('../v2/mongo-operations')
const mapLoan = require('../utils/map-loan')

async function handle(context, req) {
    const { uid } = req.query

    await connect()
    const result = await findWithLimit('caixinhas', { 'loans.uid': uid }, 1)
    const caixinha = result[0]
    const loan = caixinha?.loans?.find(item => item.uid === uid)
    context.res = {
        body: loan ? mapLoan(loan, caixinha) : undefined
    }
}

module.exports = async (context, req) => await middleware(context, req, handle)
