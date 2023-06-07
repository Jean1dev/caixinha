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
                    date: item.date,
                    totalValue: item.totalValue?.value,
                    approved: item.approved,
                    uid: item.uid,
                    memberName: item.memberName,
                    totalValue: item?.totalValue?.value,
                    remainingAmount: item?.remainingAmount?.value,
                    isPaidOff: item.isPaidOff
                })),
            loansForApprove: c.loans.filter(l => l.memberName != name).map(item => ({
                requiredNumberOfApprovals: item.requiredNumberOfApprovals,
                description: item.description,
                approvals: item.approvals,
                interest: item.interest.value,
                fees: item.fees.value,
                valueRequested: item.valueRequested.value,
                date: item.date,
                totalValue: item.totalValue?.value,
                approved: item.approved,
                uid: item.uid,
                memberName: item.memberName,
                totalValue: item?.totalValue?.value,
                remainingAmount: item?.remainingAmount?.value,
                isPaidOff: item.isPaidOff
            })),
        }))
    }

    context.res = {
        body: returnData
    }
}

module.exports = async (context, req) => await middleware(context, req, meusEmprestimos)