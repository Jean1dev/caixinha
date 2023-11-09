const { MongoMemoryServer } = require("mongodb-memory-server")
const { saveAndReturnCaixinhaIds } = require("../factory/factory-tests")
const Func = require('./index')
const { find, getByIdOrThrow, makeNewClient } = require("../v2/mongo-operations")

describe('Pagamento emprestimo test', () => {
    let mongod

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await makeNewClient(mongod.getUri())
    })

    afterAll(async () => {
        await mongod.stop()
    })
    it('deve pagar o emprestimo corretamente', async () => {
        const { caixinha, id } = await saveAndReturnCaixinhaIds()
        const emprestimoUid = caixinha['loans'][0]['uid']

        const req = {
            body: {
                caixinhaId: id,
                emprestimoUid,
                valor: 3,
                name: 'jean',
                email: 'jean@jean'
            }
        }

        const context = {
            log: jest.fn()
        }

        await Func(context, req)
        const result = await find('emprestimos', { uid: emprestimoUid })
        const emprestimoSalvoNoBd = result[0]

        expect(emprestimoSalvoNoBd).not.toBe(null)
        expect(emprestimoSalvoNoBd.isPaidOff).toBe(true)

        const caixinhaSalva = await getByIdOrThrow(id, 'caixinhas')
        const pagamentoFeito = caixinhaSalva.loans[0]['payments'][0]
        expect(pagamentoFeito).not.toBe(null)
        expect(pagamentoFeito.value.value).toBe(3)
        expect(pagamentoFeito.description).toBe('Pago via caixinha web')
    })
})