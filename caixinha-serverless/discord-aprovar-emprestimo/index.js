const middleware = require('../utils/middleware')
const { connect, getByIdOrThrow } = require('../v2/mongo-operations')
const aprovarEmprestimo = require('../aprovar-emprestimo')

async function handle(context, req) {
    const { caixinhaId, emprestimoUid } = req.body
    await connect()
    const box = await getByIdOrThrow(caixinhaId)
    const loan = box.loans.find(item => item.uid === emprestimoUid)
    if (!loan) throw new Error('Loan not found')
    if (loan.approved) {
        context.res = { status: 400, body: { message: 'emprestimo ja foi aprovado' } }
        return
    }
    if (loan.refusedReason) {
        context.res = { status: 400, body: { message: 'esse emprestimo foi rejeitado' } }
        return
    }

    const approvedNames = new Set(
        (loan.listOfMembersWhoHaveAlreadyApproved || []).map(member => member.name)
    )
    for (const member of box.members.filter(item => !approvedNames.has(item.name))) {
        const approvalContext = { log: context.log }
        await aprovarEmprestimo(approvalContext, {
            body: { memberName: member.name, emprestimoId: emprestimoUid, caixinhaid: caixinhaId }
        })
        if (approvalContext.res?.status >= 400) {
            context.res = approvalContext.res
            return
        }
    }
    const updatedBox = await getByIdOrThrow(caixinhaId)
    const updatedLoan = updatedBox.loans.find(item => item.uid === emprestimoUid)
    context.res = {
        body: {
            emprestimo: {
                uid: updatedLoan.uid,
                approved: updatedLoan.approved,
                approvals: updatedLoan.approvals,
                listOfMembersWhoHaveAlreadyApproved: updatedLoan.listOfMembersWhoHaveAlreadyApproved
            }
        }
    }
}

module.exports = async (context, req) => await middleware(context, req, handle)
