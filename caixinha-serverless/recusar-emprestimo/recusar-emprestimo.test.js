const { MongoMemoryServer } = require("mongodb-memory-server")
const Func = require('./index')
const { makeNewClient } = require("../v2/mongo-operations")
const { saveAndReturnCaixinhaIds, createFullCaixinhaJson } = require("../factory/factory-tests")

function getContext() {
    const context = {
        log: (...args) => console.log(args)
    }

    return context
}

describe('Recusar emprestimo test', () => {
    let mongod

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await makeNewClient(mongod.getUri())
    })

    afterAll(async () => {
        await mongod.stop()
    })

    it('deve recusar emprestimo', async () => {
        let caixinha = createFullCaixinhaJson()
        caixinha.loans[0]['approved'] = false
        caixinha = await saveAndReturnCaixinhaIds(caixinha)
        const req = {
            body: {
                reason: 'teste unitario',
                name: 'jean',
                email: 'jean@jean',
                caixinhaId: caixinha.id,
                emprestimoUid: caixinha.caixinha.loans[0].uid
            }
        }

        expect(
            async () => await Func(getContext(), req)
        ).not.toThrowError();
    })

    it('nao deve recusar com reason null', async () => {
        let caixinha = createFullCaixinhaJson()
        caixinha.loans[0]['approved'] = false
        caixinha = await saveAndReturnCaixinhaIds(caixinha)
        const req = {
            body: {
                name: 'jean',
                email: 'jean@jean',
                caixinhaId: caixinha.id,
                emprestimoUid: caixinha.caixinha.loans[0].uid
            }
        }

        const context = getContext()
        await Func(context, req)
        expect(typeof context.res).toBe('object')
        expect(context.res.status).toBe(400)
        expect(context.res.body.message).toBe('Reason is required')
    })

    it('nao deve recusar pq o emprestimo ja esta aprovado', async() => {
        const caixinha = await saveAndReturnCaixinhaIds()
        const req = {
            body: {
                reason: 'teste unitario',
                name: 'jean',
                email: 'jean@jean',
                caixinhaId: caixinha.id,
                emprestimoUid: caixinha.caixinha.loans[0].uid
            }
        }

        const context = getContext()
        await Func(context, req)
        expect(typeof context.res).toBe('object')
        expect(context.res.status).toBe(400)
        expect(context.res.body.message).toBe('Nao eh possivel rejeitar esse emprestimo')
    })
})