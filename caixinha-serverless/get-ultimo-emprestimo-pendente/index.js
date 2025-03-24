const moment = require('moment');
const middleware = require('../utils/middleware')
const { connect, find } = require('../v2/mongo-operations')

function elementoMaisRecente(lista) {
    let elementoMaisRecente = lista[0];

    for (let i = 1; i < lista.length; i++) {
        if (lista[i].date > elementoMaisRecente.date) {
            elementoMaisRecente = lista[i];
        }
    }

    return elementoMaisRecente;
}

async function handle(context, req) {
    const { name, email } = req.query
    await connect()
    const results = await find('emprestimos', {
        'member.name': name,
        'member.email': email,
        'isPaidOff': { $exists: false }
    })

    if (results.length === 0) {
        context.res = {
            body: {
                exists: false,
                data: null
            }
        }

        return
    }

    const atual = elementoMaisRecente(results)
    atual.date = moment(atual.date).format('DD/MM/YYYY')

    context.res = {
        body: {
            exists: true,
            data: atual
        }
    }
}

module.exports = async (context, req) => await middleware(context, req, handle)