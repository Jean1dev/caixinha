const middleware = require('../utils/middleware')
const { Box } = require('caixinha-core/dist/src')
const { connect, find } = require('../v2/mongo-operations')

async function getCaixinhas(context, _req) {

    await connect()
    const results = await find('caixinhas', {})

    const body = results
        .map(boxEntity => {
            const item = Box.fromJson(boxEntity)
            item['id'] = boxEntity._id
            delete item['loans']
            delete item['deposits']
            delete item['performance']
            delete item['bankAccount']
            item['members'] = boxEntity.members.map(m => ({
                memberName: m.name,
                email: m.email
            }))
            return item
        })

    context.res = {
        body
    }

}

module.exports = async (context, req) => await middleware(context, req, getCaixinhas)