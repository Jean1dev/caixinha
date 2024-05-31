const { MongoMemoryServer } = require("mongodb-memory-server")
const { getByIdOrThrow, makeNewClient, insertDocument, find } = require("../v2/mongo-operations")
const Func = require('./index')
const { saveAndReturnCaixinhaIds } = require("../factory/factory-tests")
const { Member, Box, Loan } = require("caixinha-core/dist/src")
const { getDataMenosXDias } = require("../utils")

describe('Renegociacao teste test', () => {
    let mongod

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await makeNewClient(mongod.getUri())
    })

    afterAll(async () => {
        await mongod.stop()
    })

    it('Deve renegociar com sucesso', async () => {
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

        delete box['loans'][0]['box']
        await insertDocument('emprestimos', box['loans'][0])
        const { insertedId: renegociacaoId } = await insertDocument('renegociacoes', {
            oldLoan: box['loans'][0],
            status: 'PENDING',
            delayedDays: 62,
            createdAt: new Date(),
            boxId: id
        })

        const req = {
            body: {
                renegociacaoId,
                valorProposta: 25,
                parcelas: 2
            }
        }

        const context = {
            log: jest.fn()
        }

        await Func(context, req)

        const reneg = await getByIdOrThrow(renegociacaoId, 'renegociacoes')
        expect(reneg).not.toBeNull()
        expect(reneg.status).toBe('FINISHED')
        expect(reneg.newLoan).not.toBe(null)    
        expect(reneg.finishedAt).not.toBe(null)
        expect(reneg.newLoan.installments).toBe(2)

        const emprestimosRegistrados = await find('emprestimos')
        expect(emprestimosRegistrados.length).toBe(1)
        expect(emprestimosRegistrados[0].installments).toBe(2)
        expect(emprestimosRegistrados[0].uid).toBe(reneg.newLoan.uid)

        const caixinhaAtualizada = await getByIdOrThrow(id, 'caixinhas')
        expect(caixinhaAtualizada.loans.length).toBe(1)
        expect(caixinhaAtualizada.loans[0].installments).toBe(2)
        expect(caixinhaAtualizada.loans[0].uid).toBe(reneg.newLoan.uid)
    }, 30000)
})