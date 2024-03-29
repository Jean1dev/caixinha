const middleware = require('../utils/middleware')
const moment = require('moment')
const { ObjectId } = require('mongodb')
const { connect, find, getDocumentById } = require("../v2/mongo-operations")

function compareByDate(a, b) {
    const dateA = new Date(a.date.split('/').reverse().join('/'));
    const dateB = new Date(b.date.split('/').reverse().join('/'));
    return dateB - dateA;
}

function parseQuery(query) {
    let meuExtrato, emprestimos, depositos
    if (typeof query.meuExtrato === 'string') {
        meuExtrato = query.meuExtrato === 'true' ? true : false
    }

    if (typeof query.depositos === 'string') {
        depositos = query.depositos === 'true' ? true : false
    }

    if (typeof query.emprestimos === 'string') {
        emprestimos = query.emprestimos === 'true' ? true : false
    }

    return { meuExtrato, emprestimos, depositos }
}

async function extrato(context, req) {

    await connect()
    let result = []

    async function findDepositosAndPutOnResult(query) {
        const depositos = await find('depositos', query)
        depositos.forEach(it => {
            result.push({
                id: it._id,
                tipo: 'DEPOSITO',
                valor: it.value.value,
                nick: it.member.name,
                status: 'completed',
                date: moment(it.date).format('DD/MM/YYYY')
            })
        })
    }

    async function findEmprestimosAndPutOnResult(query) {
        const emprestimos = await find('emprestimos', query)
        emprestimos.forEach(it => {
            result.push({
                id: it._id,
                tipo: 'EMPRESTIMO',
                valor: it.valueRequested.value,
                nick: it.member.name,
                status: it.approved ? 'completed' : 'requested',
                date: moment(it.date).format('DD/MM/YYYY')
            })
        })
    }

    async function findEmprestimosNaCaixinha(idCaixinha) {
        const caixinha = await getDocumentById(idCaixinha)
        if (!caixinha) {
            return
        }

        caixinha['loans'].forEach(it => {
            result.push({
                id: it._id,
                tipo: 'EMPRESTIMO',
                valor: it.valueRequested.value,
                nick: it.member.name,
                status: it.approved ? 'completed' : 'requested',
                date: moment(it.date).format('DD/MM/YYYY')
            })
        })
    }

    const { meuExtrato, emprestimos, depositos } = parseQuery(req.query)

    if (meuExtrato) {
        if (depositos) {
            await findDepositosAndPutOnResult({ memberName: req.query.memberName })
        }

        if (emprestimos) {
            await findEmprestimosAndPutOnResult({ memberName: req.query.memberName })
        }

    } else {
        const { caixinhaId } = req.query
        if (depositos) {
            await findDepositosAndPutOnResult({ idCaixinha: new ObjectId(caixinhaId) })
        }

        if (emprestimos) {
            await findEmprestimosNaCaixinha(caixinhaId)
        }

    }

    context.res = {
        body: result.sort(compareByDate)
    }

}

module.exports = async (context, req) => await middleware(context, req, extrato)