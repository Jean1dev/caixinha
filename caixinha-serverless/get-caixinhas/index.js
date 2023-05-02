const { Box } = require('caixinha-core/dist/src')
const { connect, getAllCaixinhas } = require('../nosql/mongo-operations')

module.exports = async function (context, _req) {
    try {
        await connect()
        const results = await getAllCaixinhas()
        const body = results
            .map(boxEntity => {
                const item = Box.from(boxEntity)
                item['id'] = boxEntity._id
                return item
            })

        context.res = {
            body
        }
    } catch (error) {
        context.res = {
            status: 400,
            body: {
                message: error.message
            }
        }
    }
}