const middleware = require('../utils/middleware')
const { connect, getDocumentById } = require('../v2/mongo-operations')

async function consultar(context, _req) {
    await connect()

    const caixinha = await getDocumentById('646f538de5cd54cc6344ec69')
    const result = []
    caixinha.members.forEach(element => {
        const memberName = element.name
        const total = caixinha.deposits
            .filter(deposit => deposit.memberName === memberName)
            .map(deposit => deposit.value.value)
            .reduce((sum, value) => sum + value, 0)

        result.push(`${memberName} - tem R$${total.toFixed(2)} \n`)
    });

    context.res = {
        body: result
    }
}

module.exports = async (context, req) => await middleware(context, req, consultar)