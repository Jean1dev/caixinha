const { MongoMemoryServer } = require("mongodb-memory-server")
const { saveAndReturnCaixinhaIds } = require("../factory/factory-tests")
const Func = require('./index')
const { makeNewClient, insertDocument } = require("../v2/mongo-operations")
const dispatchEvent = require('../amqp/events')

jest.mock('../amqp/events')

function createCaixinha() {
    const dateTwoMonthsAgo = new Date()
    dateTwoMonthsAgo.setMonth(dateTwoMonthsAgo.getMonth() - 2)
    return {
        "members": [
            {
                "name": "augusto",
                "email": "outro@jean"
            },
            {
                "name": "jean",
                "email": "jean@jean"
            }
        ],
        "currentBalance": {
            "value": 146
        },
        "deposits": [
            {
                "date": dateTwoMonthsAgo,
                "member": {
                    "name": "jean",
                    "email": "jean@jean"
                },
                "value": {
                    "value": 150
                },
                "memberName": "jean"
            }
        ],
        "loans": [],
        "name": "quarto debug"
    }
}

describe('Oportunidades de deposito test', () => {
    let mongod

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await makeNewClient(mongod.getUri())
        await insertDocument('membros', {
            name: 'jean',
            email: 'jean@jean',
            phoneNumber: '11999999999'
        })
    })

    afterAll(async () => {
        await mongod.stop()
    })

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('deve gerar oportunidades de deposito para membros inativos', async () => {
        const { id } = await saveAndReturnCaixinhaIds(createCaixinha())

        const req = {
            body: {
                ids: [id]
            }
        }

        const context = {
            log: jest.fn()
        }

        await Func(context, req)

        expect(dispatchEvent).toHaveBeenCalled()
        const dispatchCalls = dispatchEvent.mock.calls

        expect(dispatchCalls.length).toBeGreaterThan(0)

        const firstCall = dispatchCalls[0]
        const [events, caixinhaId] = firstCall

        expect(caixinhaId).toBe(id)
        expect(events).toHaveLength(2)
        expect(events[0].type).toBe('EMAIL')
        expect(events[1].type).toBe('SMS')
        expect(events[0].data.remetentes).toBeDefined()
    })

    it('deve processar múltiplas caixinhas', async () => {
        const { id: id1 } = await saveAndReturnCaixinhaIds(createCaixinha())
        const { id: id2 } = await saveAndReturnCaixinhaIds(createCaixinha())

        const req = {
            body: {
                ids: [id1, id2]
            }
        }

        const context = {
            log: jest.fn()
        }

        await Func(context, req)

        expect(dispatchEvent).toHaveBeenCalledTimes(2)
        const dispatchCalls = dispatchEvent.mock.calls

        expect(dispatchCalls[0][1]).toBe(id1)
        expect(dispatchCalls[1][1]).toBe(id2)
    })

    it('deve lidar com caixinha sem membros inativos', async () => {
        const { id } = await saveAndReturnCaixinhaIds()

        const req = {
            body: {
                ids: [id]
            }
        }

        const context = {
            log: jest.fn()
        }

        await Func(context, req)

        expect(dispatchEvent).not.toHaveBeenCalled()
    })
}) 