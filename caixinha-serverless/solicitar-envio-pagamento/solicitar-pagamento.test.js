const mock_user = () => ({ "_id": { "$oid": "64abfbc0ebc1a68895e87ae9" }, "bankAccount": { "keysPix": ["05833251907"], "urlsQrCodePix": [] }, "email": "jean@jean", "name": "jean", "phoneNumber": "5548998457797", "photoUrl": "to ouvindo o kinho" })
const mock_caixinha = () => ({
    "members": [
        {
            "name": "jean",
            "email": "jean@jean"
        },
        {
            "name": "augusto",
            "email": "augusto@augusto"
        }
    ],
    "currentBalance": {
        "value": 25
    },
    "deposits": [
        {
            "date": new Date(),
            "member": {
                "name": "jean",
                "email": "jean@jean"
            },
            "value": {
                "value": 25
            },
            "memberName": "jean"
        }
    ],
    "loans": [
        {
            "approved": false,
            "member": {
                "name": "jean",
                "email": "jean@jean"
            },
            "date": new Date(),
            "valueRequested": {
                "value": 5
            },
            "fees": {
                "value": 0
            },
            "installments": 0,
            "interest": {
                "value": 2
            },
            "approvals": 1,
            "description": "test e2e",
            "payments": [],
            "uid": "c222eb53-e304-4f26-b52e-7e285c102fda",
            "memberName": "jean",
            "requiredNumberOfApprovals": 2,
            "listOfMembersWhoHaveAlreadyApproved": [
                {
                    "name": "jean",
                    "email": "jean@jean"
                }
            ],
            "billingDates": [
                new Date()
            ]
        }
    ],
    "name": "e2e-test"
})

describe('solicitação pagamento test', () => {

    afterEach(() => {
        jest.clearAllMocks()
        jest.resetAllMocks()
        jest.resetModules()
    });

    it('nao deve solicitar pois ja foi pago', async () => {
        jest.mock('../v2/mongo-operations.js', () => {
            return {
                connect: function () {
                    console.log('connect mock')
                },
                find: function (collectionName, data) {
                    if (collectionName === 'registro_solicitacao_pagamento') {
                        return [{
                            enviado: true
                        }]
                    }
                }
            }
        })

        const context = {
            log: jest.fn()
        }
        const func = require('./index')
        const input = {
            "caixinhaId": "64abfb84ebc1a68895e87ae6",
            "emprestimoUid": "c222eb53-e304-4f26-b52e-7e285c102fda"
        }

        await func(context, {
            body: input
        })

        expect(context.res).not.toBeNull()
        expect(context.res.body.message).toBe('pagamento já solicitado')
    })

    it('nao deve solicitar pq o emprestimo nao foi aprovado', async () => {
        jest.mock('../v2/mongo-operations.js', () => {
            return {
                connect: function () {
                    console.log('connect mock')
                },
                find: function (collectionName, data) {
                    if (collectionName === 'registro_solicitacao_pagamento') {
                        return []
                    }
                },
                getByIdOrThrow: function (id) {
                    const d = mock_caixinha()
                    return d
                }
            }
        })

        const context = {
            log: jest.fn()
        }
        const func = require('./index')
        const input = {
            "caixinhaId": "64abfb84ebc1a68895e87ae6",
            "emprestimoUid": "c222eb53-e304-4f26-b52e-7e285c102fda"
        }

        await func(context, {
            body: input
        })

        expect(context.res).not.toBeNull()
        expect(context.res.body.message).toBe('emprestimo nao esta aprovado ou já foi concluido')
    })

    it('nao deve solicitar emprestimo pq o usuario nao tem um perfil criado', async () => {
        jest.mock('../v2/mongo-operations.js', () => {
            return {
                connect: function () {
                    console.log('connect mock')
                },
                find: function (collectionName, data) {
                    if (collectionName === 'registro_solicitacao_pagamento') {
                        return []
                    }
                },
                getByIdOrThrow: function (id) {
                    const d = mock_caixinha()
                    d.loans.forEach(it => it.approved = true)
                    return d
                },
                findWithLimit: function (a, b, c) {
                    return []
                }
            }
        })

        const context = {
            log: jest.fn()
        }
        const func = require('./index')
        const input = {
            "caixinhaId": "64abfb84ebc1a68895e87ae6",
            "emprestimoUid": "c222eb53-e304-4f26-b52e-7e285c102fda"
        }

        await func(context, {
            body: input
        })

        expect(context.res).not.toBeNull()
        expect(context.res.body.message).toBe('Usuario não tem um perfil criado')
    })

    it('nao deve solicitar emprestimo pq o usuario nao tem uma chave pix', async () => {
        jest.mock('../v2/mongo-operations.js', () => {
            return {
                connect: function () {
                    console.log('connect mock')
                },
                find: function (collectionName, data) {
                    if (collectionName === 'registro_solicitacao_pagamento') {
                        return []
                    }
                },
                getByIdOrThrow: function (id) {
                    const d = mock_caixinha()
                    d.loans.forEach(it => it.approved = true)
                    return d
                },
                findWithLimit: function (a, b, c) {
                    const user = mock_user()
                    delete user.bankAccount
                    return [user]
                }
            }
        })

        const context = {
            log: jest.fn()
        }
        const func = require('./index')
        const input = {
            "caixinhaId": "64abfb84ebc1a68895e87ae6",
            "emprestimoUid": "c222eb53-e304-4f26-b52e-7e285c102fda"
        }

        await func(context, {
            body: input
        })

        expect(context.res).not.toBeNull()
        expect(context.res.body.message).toBe('Usuario não tem chave pix cadastrada')
    })
})