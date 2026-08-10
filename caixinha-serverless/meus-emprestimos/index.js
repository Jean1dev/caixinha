const middleware = require('../utils/middleware')
const { connect, find } = require('../v2/mongo-operations')
const mapLoan = require('../utils/map-loan')

function somenteOsQueNaoEstaoAprovados(emprestimo) {
    if (!emprestimo.approved) {
        return true
    }

    return false
}

function somenteOsQueAindaFaltamPagar(emprestimo) {
    if (emprestimo.isPaidOff) {
        return false
    }

    return true
}

async function meusEmprestimos(context, req) {
    const { name, email } = req.query
    const collectionName = 'caixinhas'
    await connect()

    const caixinhas = await find(collectionName, {
        "members.name": name, "members.email": email
    })

    const returnData = {
        caixinhas: caixinhas.map(c => ({
            currentBalance: c.currentBalance.value,
            meusEmprestimosQuitados: c.loans
                .filter(l => l.memberName === name)
                .filter(l => l.isPaidOff)
                .map(item => mapLoan(item, c)),
            meusEmprestimos: c.loans
                .filter(l => l.memberName === name)
                .filter(somenteOsQueAindaFaltamPagar)
                .map(item => mapLoan(item, c)),
            emprestimosParaAprovar: c.loans
                .filter(l => l.memberName != name)
                .filter(somenteOsQueNaoEstaoAprovados)
                .map(item => mapLoan(item, c)),
        }))
    }

    const totalPendente = returnData.caixinhas
        .flatMap(item => item.meusEmprestimos.map(jit => jit.totalValue))
        .reduce((acumulator, value) => acumulator + value, 0)

    const totalPago = returnData.caixinhas
        .flatMap(item => item.meusEmprestimosQuitados.map(jit => jit.totalValue))
        .reduce((acumulator, value) => acumulator + value, 0)

    const totalGeral = returnData.caixinhas
        .flatMap(item => ({
            total1: item.meusEmprestimos.map(it => it.totalValue).reduce((acumulator, value) => acumulator + value, 0),
            total2: item.emprestimosParaAprovar.map(it => it.totalValue).reduce((acumulator, value) => acumulator + value, 0),
            total3: item.meusEmprestimosQuitados.map(it => it.totalValue).reduce((acumulator, value) => acumulator + value, 0)
        }))
        .map(it => it.total1 + it.total2 + it.total3)
        .reduce((acumulator, value) => acumulator + value, 0)

    returnData['totalPendente'] = totalPendente
    returnData['totalPago'] = totalPago
    returnData['totalGeral'] = totalGeral

    context.res = {
        body: returnData
    }
}

module.exports = async (context, req) => await middleware(context, req, meusEmprestimos)
