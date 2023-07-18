const middleware = require('../utils/middleware')
const { connect, findWithLimit } = require('../v2/mongo-operations')
const moment = require('moment')

function mapItem(item) {
    return {
        requiredNumberOfApprovals: item.requiredNumberOfApprovals,
        description: item.description,
        approvals: item.approvals,
        interest: item.interest.value,
        fees: item.fees.value,
        valueRequested: item.valueRequested.value,
        date: moment(item.date).format('DD/MM/YYYY'),
        totalValue: item.totalValue?.value,
        approved: item.approved,
        uid: item.uid,
        memberName: item.memberName,
        totalValue: item?.totalValue?.value,
        remainingAmount: item?.remainingAmount?.value,
        isPaidOff: item.isPaidOff,
        parcelas: item.installments,
        billingDates: item.billingDates.map(payday => {
            const valor = Number((item.totalValue.value / item.installments).toFixed(2))
            return {
                valor,
                data: moment(payday).format('DD/MM/YYYY')
            }
        })
    }
}

async function handle(context, req) {
    const { uid } = req.query

    await connect()
    const result = await findWithLimit('emprestimos', { uid }, 1)
    context.res = {
        body: result.map(mapItem)[0]
    }
}

module.exports = async (context, req) => await middleware(context, req, handle)