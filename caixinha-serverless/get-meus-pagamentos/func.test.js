const { MongoMemoryServer } = require("mongodb-memory-server")
const { makeNewClient, insertDocument } = require("../v2/mongo-operations")
const func = require('./index')

const mockData = [
    {
        name: 'caixa1',
        loans: [
            {
                uid: '49aaffd0-bd52-4b7a-802c-03f456ed1adc',
                payments: [
                    {
                        member: {
                            email: 'jean@jean',
                            name: 'jean'
                        },
                        description: 'pagamento1',
                        value: {
                            value: 10
                        },
                        date: '2023-12-11T13:44:36.107Z'
                    },
                    {
                        member: {
                            email: 'jean@jean',
                            name: 'jean'
                        },
                        description: 'pagamento2',
                        value: {
                            value: 20
                        },
                        date: '2023-12-11T13:44:36.107Z'
                    }
                ]
            }
        ]
    },
    {
        name: 'caixa2',
        loans: [
            {
                uid: '49aaffd0-bd52-4b7a-802c-03f456ed1ada',
                payments: [
                    {
                        member: {
                            email: 'jean@jean',
                            name: 'jean'
                        },
                        description: 'pagamento12',
                        value: {
                            value: 10
                        },
                        date: '2023-12-11T13:44:36.107Z'
                    }
                ]
            }
        ]
    },
    {
        name: 'caixa3',
        loans: [
            {
                uid: '49aaffd0-bd52-4b7a-802c-03f456ed1adi',
                payments: [
                    {
                        member: {
                            email: 'jhon@doe',
                            name: 'jhon'
                        },
                        description: 'pagamento1',
                        value: {
                            value: 10
                        },
                        date: '2023-12-11T13:44:36.107Z'
                    }
                ]
            }
        ]
    }
]

function getContext() {
    const context = {
        log: (...args) => console.log(args)
    }

    return context
}

describe('get meus pagamentos test', () => {
    let mongod

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await makeNewClient(mongod.getUri())
        await insertDocument('caixinhas', mockData[0])
        await insertDocument('caixinhas', mockData[1])
        await insertDocument('caixinhas', mockData[2])
    })

    afterAll(async () => {
        await mongod.stop()
    })

    it('deve trazer todos os pagamentos por uid', async () => {
        const context = getContext()
        const req = {
            query: {
                uid: '49aaffd0-bd52-4b7a-802c-03f456ed1adc',
            }
        }

        await func(context, req)
        expect(typeof context.res).toBe('object')
        const result = context.res.body
        expect(result).toHaveLength(2)
        expect(result[0].description).toBe('pagamento1')
        expect(result[1].description).toBe('pagamento2')
        expect(result[0].value).toBe(10)
        expect(result[1].value).toBe(20)
    })

    it('deve trazer todos os pagamentos por nome e email', async () => {
        const context = getContext()
        const req = {
            query: {
                user: 'jean',
                email: 'jean@jean',
                all: true
            }
        }

        await func(context, req)
        expect(typeof context.res).toBe('object')
        const result = context.res.body
        expect(result).toHaveLength(3)
        expect(result[0].description).toBe('pagamento1')
        expect(result[1].description).toBe('pagamento2')
        expect(result[2].description).toBe('pagamento12')
        expect(result[0].value).toBe(10)
        expect(result[1].value).toBe(20)
    })
})