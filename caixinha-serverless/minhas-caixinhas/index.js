const middleware = require('../utils/middleware')
const { connect, find } = require('../v2/mongo-operations')

async function minhasCaixinhas(context, req) {
    const { name, email } = req.query
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
}

module.exports = async (context, req) => await middleware(context, req, minhasCaixinhas)