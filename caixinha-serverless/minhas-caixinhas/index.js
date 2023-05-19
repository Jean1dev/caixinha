const { connect, find } = require('../v2/mongo-operations')

module.exports = async function (context, req) {
    const { name, email } = req.query
    try {
        await connect()
        const results = await find('caixinhas')
        const remap = results.filter(it => {
            const finded = it.members.find(mem => mem.name === name && mem.email === email)
            if (finded)
                return true
            else
                return false
        }).map(it => ({
            id: it._id,
            name: it.name
        }))

        context.res = {
            body: remap
        }

    } catch (error) {
        context.log(error.message)
        context.res = {
            status: 400,
            body: {
                message: error.message
            }
        }
    }
}