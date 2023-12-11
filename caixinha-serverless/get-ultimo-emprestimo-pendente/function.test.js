const { MongoMemoryServer } = require("mongodb-memory-server")
const { makeNewClient, insertDocument } = require("../v2/mongo-operations")
const Func = require('./index')

const mockData =  [
    {
        "approved": true,
        "member": {
            "name": "carlos",
            "email": "jean@jean"
        },
        "date": "2023-12-11T13:44:36.107Z",
        "valueRequested": {
            "value": 2
        },
        "fees": {
            "value": 0
        },
        "interest": {
            "value": 3
        },
        "approvals": 1,
        "description": "primeiro",
        "payments": [],
        "uid": "4a5f3808-3d87-46f1-a7db-716a4ebe6782",
        "installments": 2,
        "memberName": "jean",
        "requiredNumberOfApprovals": 1,
        "listOfMembersWhoHaveAlreadyApproved": [
            {
                "name": "jean",
                "email": "jean@jean"
            }
        ],
        "billingDates": [
            "2024-01-10T13:44:36.107Z",
            "2024-02-09T13:44:36.107Z"
        ],
        "totalValue": {
            "value": 2.06
        },
        "boxId": "657712133959c253fd57dc39"
    },
    {
        "approved": true,
        "member": {
            "name": "jean",
            "email": "jean@jean"
        },
        "date": "2023-13-11T13:44:36.107Z",
        "valueRequested": {
            "value": 2
        },
        "fees": {
            "value": 0
        },
        "interest": {
            "value": 3
        },
        "approvals": 1,
        "description": "tem que achar esse aqui",
        "payments": [],
        "uid": "4a5f3808-3d87-46f1-a7db-716a4ebe6782",
        "installments": 2,
        "memberName": "jean",
        "requiredNumberOfApprovals": 1,
        "listOfMembersWhoHaveAlreadyApproved": [
            {
                "name": "jean",
                "email": "jean@jean"
            }
        ],
        "billingDates": [
            "2024-01-10T13:44:36.107Z",
            "2024-02-09T13:44:36.107Z"
        ],
        "totalValue": {
            "value": 2.06
        },
        "boxId": "657712133959c253fd57dc39"
    },
    {
        "approved": true,
        "member": {
            "name": "jean",
            "email": "jean@jean"
        },
        "date": "2023-12-11T13:44:36.107Z",
        "valueRequested": {
            "value": 2
        },
        "fees": {
            "value": 0
        },
        "interest": {
            "value": 3
        },
        "approvals": 1,
        "description": "primeiro",
        "payments": [],
        "uid": "4a5f3808-3d87-46f1-a7db-716a4ebe6782",
        "installments": 2,
        "memberName": "jean",
        "requiredNumberOfApprovals": 1,
        "listOfMembersWhoHaveAlreadyApproved": [
            {
                "name": "jean",
                "email": "jean@jean"
            }
        ],
        "billingDates": [
            "2024-01-10T13:44:36.107Z",
            "2024-02-09T13:44:36.107Z"
        ],
        "totalValue": {
            "value": 2.06
        },
        "boxId": "657712133959c253fd57dc39"
    }
]

describe('Get Ultimo Emprestimo test', () => {
    let mongod

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()
        await makeNewClient(mongod.getUri())
        await insertDocument('emprestimos', mockData[0])
        await insertDocument('emprestimos', mockData[1])
        await insertDocument('emprestimos', mockData[2])
    })

    afterAll(async () => {
        await mongod.stop()
    })

    it('deve Retornar o ultimo emprestimo', async () => {
        const req = {
            query: {
                name: 'jean',
                email: 'jean@jean'
            }
        }

        const context = {
            log: jest.fn()
        }

        await Func(context, req)

        expect(context.res.body.exists).toBe(true)
        expect(context.res.body.data.description).toBe("tem que achar esse aqui")
    })

    it('Nao deve encontrar nenhum emprestimo', async () => {
        const req = {
            query: {
                name: 'jean-nao-encontrado',
                email: 'jean@jean'
            }
        }

        const context = {
            log: jest.fn()
        }

        await Func(context, req)

        expect(context.res.body.exists).toBe(false)
        expect(context.res.body.data).toBe(null)
    })
})