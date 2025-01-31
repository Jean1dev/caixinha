const middleware = require('../utils/middleware')
const { connect, find } = require('../v2/mongo-operations')
const moment = require('moment')

function mapItem(caixinhaName, pagamento) {
    return {
        caixinha: caixinhaName,
        description: pagamento.description,
        value: pagamento.value.value,
        date: moment(pagamento.date).format('DD/MM/YYYY'),
    }
}

function validateParams(params) {
    const all = params?.all
    if (all) {
        const { email, user } = params
        if (!email || !user) {
            throw new Error('Para buscar todos os pagamentos envie o usuario e senha')
        }

        return {
            all: true,
            email,
            user
        }
    }

    const { uid } = params
    return {
        uid
    }
}

async function findEmprestimosPorUid(uid) {
    const collectionName = 'caixinhas'
    const caixinha = await find(collectionName, { 'loans.uid': uid })
    if (!caixinha)
        throw new Error('Emprestimo nao existe')

    const currentLoan = caixinha[0]['loans'].find(loan => loan['uid'] == uid)
    return currentLoan.payments.map(item => {
        return mapItem(caixinha[0].name, item)
    })
}

async function findEmprestimoByNameAndEmail(name, email) {
    const collectionName = 'caixinhas'
    const caixinha = await find(collectionName, {})
    return caixinha.flatMap(caixa => {
        const caixaName = caixa.name
        return caixa.loans.flatMap(loan => {
            return loan.payments.filter(payment => {
                const payMember = payment.member
                return payMember.email === email && payMember.name === name
            })
        }).map(flatted => (
            mapItem(caixaName, flatted)
        ))
    })
}

async function handle(context, req) {
    const params = req.query
    const paramsValidated = validateParams(params)

    await connect()

    let result
    if (paramsValidated.uid) {
        result = await findEmprestimosPorUid(paramsValidated.uid)
        context.res = {
            body: result
        }
        return
    }


    result = await findEmprestimoByNameAndEmail(paramsValidated.user, paramsValidated.email)
    context.res = {
        body: result
    }
}

module.exports = async (context, req) => await middleware(context, req, handle)