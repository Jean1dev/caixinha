const { MongoMemoryServer } = require("mongodb-memory-server")
const { getByIdOrThrow, makeNewClient } = require("../v2/mongo-operations")
const Func = require('./index')
const { saveAndReturnCaixinhaIds } = require("../factory/factory-tests")
const { Member, Box, Loan } = require("caixinha-core/dist/src")
const { getDataMenosXDias } = require("../utils")

describe('solicitação de renegociacao test', () => {
    let mongod

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await makeNewClient(mongod.getUri())
    })

    afterAll(async () => {
        await mongod.stop()
    })

    it('Deve solicitar uma renegociacao com sucesso', async () => {
        const member = new Member('joao')
        const box = new Box()
        box.joinMember(member)
        const input = {
            approved: true,
            member,
            date: getDataMenosXDias(31).toString(),
            totalValue: { value: 10 },
            valueRequested: { value: 10 },
            remainingAmount: { value: 10 },
            fees: { value: 0 },
            interest: { value: 0 },
            box,
            description: 'fake',
            approvals: 1,
            memberName: member.memberName,
            requiredNumberOfApprovals: 0,
            billingDates: [getDataMenosXDias(31).toString()],
            uid: 'uid',
            listOfMembersWhoHaveAlreadyApproved: [member],
            payments: []
        }

        box['loans'] = [Loan.fromBox(input)]
        const { id } = await saveAndReturnCaixinhaIds(box)

        const req = {
            body: {
                caixinhaId: id,
                emprestimoUid: input.uid
            }
        }

        const context = {
            log: jest.fn()
        }

        await Func(context, req)

        expect(context.res.body).not.toBeNull()
        expect(context.res.body.renegId).not.toBeNull()
        expect(context.res.body.sugestao).not.toBeNull()

        const reneg = await getByIdOrThrow(context.res.body.renegId, 'renegociacoes')
        expect(reneg).not.toBeNull()
    }, 30000)

    it('Deve solicitar uma renegociacao para um emprestimo com pagamento parcial', async () => {
        const member = new Member('joao')
        const box = new Box()
        box.joinMember(member)
        const input = {
            approved: true,
            member,
            date: getDataMenosXDias(31).toString(),
            totalValue: { value: 10 },
            valueRequested: { value: 10 },
            remainingAmount: { value: 10 },
            fees: { value: 0 },
            interest: { value: 0 },
            box,
            description: 'fake',
            approvals: 1,
            memberName: member.memberName,
            requiredNumberOfApprovals: 0,
            billingDates: [getDataMenosXDias(31).toString()],
            uid: 'uid',
            listOfMembersWhoHaveAlreadyApproved: [member],
            payments: [{
                date: getDataMenosXDias(1).toString(),
                value: { value: 5 },
                member: {
                    name: member.name,
                    email: member.email
                },
                description: 'pagamento1'
            }]
        }

        box['loans'] = [Loan.fromBox(input)]
        const { id } = await saveAndReturnCaixinhaIds(box)

        const req = {
            body: {
                caixinhaId: id,
                emprestimoUid: input.uid
            }
        }

        const context = {
            log: jest.fn()
        }

        await Func(context, req)

        expect(context.res.body).not.toBeNull()
        expect(context.res.body.renegId).not.toBeNull()
        expect(context.res.body.sugestao).not.toBeNull()

        const reneg = await getByIdOrThrow(context.res.body.renegId, 'renegociacoes')
        expect(reneg).not.toBeNull()
    }, 30000)

    it('Deve renegociar quando uma parcela anterior venceu e a ultima ainda esta no futuro', async () => {
        const member = new Member('joao-parcelado')
        const box = new Box()
        box.joinMember(member)
        const futureBillingDate = new Date()
        futureBillingDate.setDate(futureBillingDate.getDate() + 30)
        const input = {
            approved: true,
            member,
            date: getDataMenosXDias(31).toString(),
            totalValue: { value: 100 },
            valueRequested: { value: 100 },
            remainingAmount: { value: 100 },
            fees: { value: 0 },
            interest: { value: 0 },
            box,
            description: 'emprestimo parcelado',
            approvals: 1,
            memberName: member.memberName,
            requiredNumberOfApprovals: 0,
            billingDates: [getDataMenosXDias(2).toString(), futureBillingDate.toString()],
            uid: 'uid-overdue-first-installment',
            listOfMembersWhoHaveAlreadyApproved: [member],
            payments: []
        }

        box['loans'] = [Loan.fromBox(input)]
        const { id } = await saveAndReturnCaixinhaIds(box)
        const context = { log: jest.fn() }

        await Func(context, {
            body: { caixinhaId: id, emprestimoUid: input.uid }
        })

        expect(context.res.status).not.toBe(400)
        expect(context.res.body.sugestao.newInterestRate).toBeGreaterThan(0)
        expect(context.res.body.sugestao.newTotalValue).toBeGreaterThan(100)
        expect(context.log).toHaveBeenCalledWith(expect.objectContaining({
            event: 'renegotiation_proposal_generated',
            caixinhaId: id,
            emprestimoUid: input.uid,
            coreVersion: expect.any(String),
            overdueDays: expect.any(Number)
        }))

        const reneg = await getByIdOrThrow(context.res.body.renegId, 'renegociacoes')
        expect(reneg).not.toBeNull()
    }, 30000)

    it.each([
        {
            cenario: 'nao aprovado',
            override: { approved: false },
            mensagem: 'Somente emprestimos aprovados podem ser renegociados'
        },
        {
            cenario: 'quitado',
            override: { isPaidOff: true },
            mensagem: 'Emprestimos quitados nao podem ser renegociados'
        },
        {
            cenario: 'em dia',
            override: { billingDates: [new Date(Date.now() + 86400000).toString()] },
            mensagem: 'Somente emprestimos atrasados podem ser renegociados'
        }
    ])('Deve rejeitar emprestimo $cenario', async ({ override, mensagem }) => {
        const member = new Member('maria')
        const box = new Box()
        box.joinMember(member)
        const input = {
            approved: true,
            member,
            date: getDataMenosXDias(31).toString(),
            totalValue: { value: 10 },
            valueRequested: { value: 10 },
            remainingAmount: { value: 10 },
            fees: { value: 0 },
            interest: { value: 0 },
            box,
            description: 'fake',
            approvals: 1,
            memberName: member.memberName,
            requiredNumberOfApprovals: 0,
            billingDates: [getDataMenosXDias(31).toString()],
            uid: `uid-${override.approved === false ? 'unapproved' : override.isPaidOff ? 'paid' : 'current'}`,
            listOfMembersWhoHaveAlreadyApproved: [member],
            payments: [],
            ...override
        }

        box['loans'] = [Loan.fromBox(input)]
        const { id } = await saveAndReturnCaixinhaIds(box)
        const context = { log: jest.fn() }

        await Func(context, {
            body: { caixinhaId: id, emprestimoUid: input.uid }
        })

        expect(context.res.status).toBe(400)
        expect(context.res.body.message).toBe(mensagem)
    }, 30000)
})
