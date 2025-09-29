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
                emprestimoUid: input.uid,
                juros: 10
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
})