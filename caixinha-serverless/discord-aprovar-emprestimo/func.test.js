const { MongoMemoryServer } = require("mongodb-memory-server")
const { saveAndReturnCaixinhaIds, createFullCaixinhaJson } = require("../factory/factory-tests")
const { getDocumentById, makeNewClient } = require("../v2/mongo-operations")
const func = require('./index')

function getContext() {
    const context = {
        log: (...args) => console.log(args)
    }

    return context
}

describe('discord aprovar emprestimo function test', () => {

    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create()
        await makeNewClient(mongod.getUri())
    })

    it('deve lancar execao pq o passou um emprestimo inexistente', async () => {
        const caixinha = await saveAndReturnCaixinhaIds()
        const context = getContext()
        const req = {
            body: {
                caixinhaId: caixinha.id,
                emprestimoUid: 'fake'
            }
        }

        await func(context, req)
        expect(typeof context.res).toBe('object')
        expect(context.res.status).toBe(400)
        expect(context.res.body.message).toBe('Loan not found')

    }, 30000)

    it('deve lancar execao pq o emprestimo ja foi aprovado', async () => {
        const caixinha = await saveAndReturnCaixinhaIds()
        const context = getContext()
        const req = {
            body: {
                caixinhaId: caixinha.id,
                emprestimoUid: caixinha.caixinha.loans[0].uid
            }
        }

        await func(context, req)
        expect(typeof context.res).toBe('object')
        expect(context.res.status).toBe(400)
        expect(context.res.body.message).toBe('emprestimo ja foi aprovado')
    }, 30000)

    it('deve processar com sucesso', async () => {
        const caixinha = await saveAndReturnCaixinhaIds()
        const context = getContext()
        const emprestimoId = caixinha.caixinha.loans[1].uid
        const req = {
            body: {
                caixinhaId: caixinha.id,
                emprestimoUid: emprestimoId
            }
        }

        await func(context, req)
        expect(typeof context.res).toBe('object')
        expect(context.res.body.emprestimo.uid).toBe(emprestimoId)
        expect(context.res.body.emprestimo.approved).toBe(true)
        expect(context.res.body.emprestimo.listOfMembersWhoHaveAlreadyApproved.length).toBe(2)
        expect(context.res.body.emprestimo.approvals).toBe(2)

        const caixinhaSalvaNoDb = await getDocumentById(caixinha.id)
        expect(caixinhaSalvaNoDb.loans).toHaveLength(2)
    }, 30000)

    it('deve processar com sucesso - cenario caixinha com apenas 1 emprestimo', async () => {
        let caixinha = createFullCaixinhaJson()
        caixinha.loans.shift()
        caixinha = await saveAndReturnCaixinhaIds(caixinha)
        const context = getContext()
        const emprestimoId = caixinha.caixinha.loans[0].uid
        const req = {
            body: {
                caixinhaId: caixinha.id,
                emprestimoUid: emprestimoId
            }
        }

        await func(context, req)
        expect(typeof context.res).toBe('object')
        expect(context.res.body.emprestimo.uid).toBe(emprestimoId)
        expect(context.res.body.emprestimo.approved).toBe(true)
        expect(context.res.body.emprestimo.listOfMembersWhoHaveAlreadyApproved.length).toBe(2)
        expect(context.res.body.emprestimo.approvals).toBe(2)

        const caixinhaSalvaNoDb = await getDocumentById(caixinha.id)
        expect(caixinhaSalvaNoDb.loans).toHaveLength(1)
    }, 30000)
})