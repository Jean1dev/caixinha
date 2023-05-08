const { Box } = require('caixinha-core/dist/src')
const { connect, find } = require('../v2/mongo-operations')

module.exports = async function (context, _req) {
    try {
        await connect()
        const results = await find('caixinhas', {})

        const body = results
            .map(boxEntity => {
                const item = Box.from(boxEntity)
                item['id'] = boxEntity._id
                item['loans'] = []
                item['deposits'] = []
                item['members'] = boxEntity.members.map(m => ({
                    memberName: m.memberName,
                    email: m.email
                }))
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