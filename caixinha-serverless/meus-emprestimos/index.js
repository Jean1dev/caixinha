const moment = require('moment')
const middleware = require('../utils/middleware')
const { connect, find } = require('../v2/mongo-operations')

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
            myLoans: c.loans
                .filter(l => l.memberName === name)
                .filter(somenteOsQueAindaFaltamPagar)
                .map(item => ({
                    requiredNumberOfApprovals: item.requiredNumberOfApprovals,
                    description: item.description,
                    approvals: item.approvals,
                    interest: item.interest.value,
                    fees: item.fees.value,
                    valueRequested: item.valueRequested.value,
                    date: moment(item.date).format('DD/MM/YYY'),
                    totalValue: item.totalValue?.value,
                    approved: item.approved,
                    uid: item.uid,
                    memberName: item.memberName,
                    totalValue: item?.totalValue?.value,
                    remainingAmount: item?.remainingAmount?.value,
                    isPaidOff: item.isPaidOff,
                    caixinha: c.name
                })),
            loansForApprove: c.loans.filter(l => l.memberName != name).map(item => ({
                requiredNumberOfApprovals: item.requiredNumberOfApprovals,
                description: item.description,
                approvals: item.approvals,
                interest: item.interest.value,
                fees: item.fees.value,
                valueRequested: item.valueRequested.value,
                date: moment(item.date).format('DD/MM/YYY'),
                totalValue: item.totalValue?.value,
                approved: item.approved,
                uid: item.uid,
                memberName: item.memberName,
                totalValue: item?.totalValue?.value,
                remainingAmount: item?.remainingAmount?.value,
                isPaidOff: item.isPaidOff.approvals,
                caixinha: c.name
            })),
        }))
    }

    const totalPendente = returnData.caixinhas
        .flatMap(item => item.myLoans.filter(it => !it.approved).map(jit => jit.totalValue))
        .reduce((acumulator, value) => acumulator + value, 0)

    const totalPago = returnData.caixinhas
        .flatMap(item => item.myLoans.filter(it => it.approved).map(jit => jit.totalValue))
        .reduce((acumulator, value) => acumulator + value, 0)

    const totalGeral = returnData.caixinhas
        .flatMap(item => ({
            total1: item.myLoans.map(it => it.totalValue).reduce((acumulator, value) => acumulator + value, 0),
            total2: item.loansForApprove.map(it => it.totalValue).reduce((acumulator, value) => acumulator + value, 0)
        }))
        .map(it => it.total1 + it.total2)
        .reduce((acumulator, value) => acumulator + value, 0)

    returnData['totalPendente'] = totalPendente
    returnData['totalPago'] = totalPago
    returnData['totalGeral'] = totalGeral

    context.res = {
        body: returnData
    }
}

module.exports = async (context, req) => await middleware(context, req, meusEmprestimos)