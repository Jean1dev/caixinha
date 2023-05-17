const { connect, find } = require('../v2/mongo-operations')

module.exports = async function (context, req) {
    const { name, email } = req.query
    const collectionName = 'caixinhas'

    await connect()

    const caixinhas = await find(collectionName, {
        "members.name": name, "members.email": email
    })

    const returnData = {
        caixinhas: caixinhas.map(c => ({
            currentBalance: c.currentBalance.value,
            myLoans: c.loans.filter(l => l.name === name).map(item => ({
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
                memberName: item.memberName
            })),
            loansForApprove: c.loans.filter(l => l.name != name).map(item => ({
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
                memberName: item.memberName
            })),
        }))
    }

    context.res = {
        body: returnData
    }
}