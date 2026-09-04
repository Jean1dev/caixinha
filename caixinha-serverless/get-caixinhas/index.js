const middleware = require('../utils/middleware')
const { Box } = require('caixinha-core/dist/src')
const { connect, find } = require('../v2/mongo-operations')
const { getPublicBalances } = require('../utils/safe-balance')

async function getCaixinhas(context, _req) {

    await connect()
    const results = await find('caixinhas', {})

    const body = await Promise.all(results
        .map(async boxEntity => {
            const item = Box.fromJson(boxEntity)
            const balances = await getPublicBalances(boxEntity)
            item['id'] = boxEntity._id
            item['currentBalance'] = { value: balances.availableBalance }
            item['balances'] = balances
            item['maxLoanAmount'] = balances.availableBalance
            delete item['loans']
            delete item['deposits']
            delete item['performance']
            delete item['bankAccount']
            item['members'] = boxEntity.members.map(m => ({
                memberName: m.name,
                email: m.email
            }))
            return item
        }))

    context.res = {
        body
    }

}

module.exports = async (context, req) => await middleware(context, req, getCaixinhas)
