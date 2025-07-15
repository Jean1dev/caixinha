const { MongoMemoryServer } = require("mongodb-memory-server")
const Func = require('./index')
const { makeNewClient } = require("../v2/mongo-operations")
const { saveAndReturnCaixinhaIds, createFullCaixinhaJson } = require("../factory/factory-tests")

function getContext() {
    const context = {
        log: (...args) => {},
        res: null
    }
    return context
}

describe('Remover emprestimo test', () => {
    let mongod

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await makeNewClient(mongod.getUri())
    })

    afterAll(async () => {
        await mongod.stop()
    })

    it('deve remover emprestimo', async () => {
        let caixinha = createFullCaixinhaJson()
        caixinha = await saveAndReturnCaixinhaIds(caixinha)
        const req = {
            body: {
                name: 'jean',
                email: 'jean@jean',
                caixinhaId: caixinha.id,
                emprestimoUid: caixinha.caixinha.loans[1].uid
            }
        }
        const context = getContext()
        await Func(context, req)
        expect(context.res).toBeNull()
    })

    it('deve falhar ao tentar remover emprestimo inexistente', async () => {
        let caixinha = createFullCaixinhaJson()
        caixinha = await saveAndReturnCaixinhaIds(caixinha)
        const req = {
            body: {
                name: 'jean',
                email: 'jean@jean',
                caixinhaId: caixinha.id,
                emprestimoUid: 'uid-inexistente'
            }
        }
        const context = getContext()
        await Func(context, req)
        expect(context.res.status).toBe(400)
        expect(context.res.body.message).toBe('Loan not found')
    })
})