const path = require('path')
const fileSystem = require('fs')

jest.mock('../v2/mongo-operations.js', () => {
    return {
        connect: function () {
            console.log('connect mock')
        },
        insertDocument: function (fileName, document) {
            const id = "646e588a78404a6458745770"
            document['_id'] = id
            const fs = require('fs')
            fs.writeFileSync(`${fileName}.json`, JSON.stringify(document))
            return {
                "acknowledged": true,
                "insertedId": id
            }
        },
        getByIdOrThrow: function (_id, collection) {
            const fs = require('fs')
            const result = fs.readFileSync(`${collection}.json`)
            return JSON.parse(result)
        },
        replaceDocumentById: function (id, fileName, document) {
            const fs = require('fs')
            fs.writeFileSync(`${fileName}.json`, JSON.stringify(document))
        }
    }
})

describe('Teste end to end', () => {
    it(`
        Cenario 1: 
            Deve criar uma caixinha, 
            atribuir 2 membros nela, 
            1 membro fazer um deposito, 
            1 membro abrir um emprestimo,
            1 membro aprovar um emprestimo,
            1 membro pagar o emprestimo
    `, async () => {
        // Deve criar uma caixinha, 
        const createCaixinha = require('../create-caixinha')
        const nameCaixinha = 'e2e-test'
        let req = {
            body: {
                name: nameCaixinha
            }
        }
        let context = {
            log: jest.fn()
        }

        await createCaixinha(context, req)
        let result = fileSystem.readFileSync(path.resolve(__dirname, '..', 'caixinhas.json'))

        expect({
            "members": [],
            "currentBalance": {
                "value": 0
            },
            "deposits": [],
            "loans": [],
            "name": "e2e-test",
            "_id": "646e588a78404a6458745770"
        }).toStrictEqual(JSON.parse(result))

        // atribuir 2 membros nela, 
        const joinMember = require('../user-join-caixinha')
        req.body = {
            boxId: result['_id'],
            email: "jean@jean",
            nick: "jean"
        }

        await joinMember(context, req)

        req.body = {
            boxId: result['_id'],
            email: "augusto@augusto",
            nick: "augusto"
        }

        await joinMember(context, req)

        result = fileSystem.readFileSync(path.resolve(__dirname, '..', 'caixinhas.json'))

        expect({
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
                "value": 0
            },
            "deposits": [],
            "loans": [],
            "name": "e2e-test"
        }).toStrictEqual(JSON.parse(result))


        //1 membro fazer um deposito, 
        req.body = {
            "caixinhaId": "646d247edf8df258a1eeea59",
            "name": "jean",
            "email": "jean@jean",
            "valor": 25
        }

        const deposito = require('../deposito')
        await deposito(context, req)

        result = JSON.parse(fileSystem.readFileSync(path.resolve(__dirname, '..', 'caixinhas.json')))
        expect({
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
                    "date": result.deposits[0].date,
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
            "loans": [],
            "name": "e2e-test"
        }).toStrictEqual(result)


        /**
         * 1 membro abrir um emprestimo
         */

        const abrirEmprestimo = require('../emprestimo')
        req.body = {
            valor: 5,
            juros: 2,
            parcela: 0,
            motivo: 'test e2e',
            name: 'jean',
            email: 'jean@jean',
            caixinhaID: 'id-e2e'
        }

        await abrirEmprestimo(context, req)
        result = JSON.parse(fileSystem.readFileSync(path.resolve(__dirname, '..', 'caixinhas.json')))

        expect({
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
                    "date": result.deposits[0].date,
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
                    "date": result.loans[0].date,
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
                    "uid": result.loans[0].uid,
                    "memberName": "jean",
                    "requiredNumberOfApprovals": 2,
                    "listOfMembersWhoHaveAlreadyApproved": [
                        {
                            "name": "jean",
                            "email": "jean@jean"
                        }
                    ],
                    "billingDates": [
                        result.loans[0].billingDates[0]
                    ]
                }
            ],
            "name": "e2e-test"
        }).toStrictEqual(result)

        /**
         *
            1 membro aprovar um emprestimo,
         */

        const aprovarEmprestimo = require('../aprovar-emprestimo')
        req.body = {
            memberName: 'augusto',
            emprestimoId: result.loans[0].uid,
            caixinhaid: 'e2e-test'
        }

        await aprovarEmprestimo(context, req)
        result = JSON.parse(fileSystem.readFileSync(path.resolve(__dirname, '..', 'caixinhas.json')))

        expect({
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
                "value": 20
            },
            "deposits": [
                {
                    "date": result.deposits[0].date,
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
                    "approved": true,
                    "member": {
                        "name": "jean",
                        "email": "jean@jean"
                    },
                    "date": result.loans[0].date,
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
                    "approvals": 2,
                    "description": "test e2e",
                    "payments": [],
                    "uid": result.loans[0].uid,
                    "memberName": "jean",
                    "requiredNumberOfApprovals": 2,
                    "listOfMembersWhoHaveAlreadyApproved": [
                        {
                            "name": "jean",
                            "email": "jean@jean"
                        },
                        {
                            "name": "augusto"
                        }
                    ],
                    "billingDates": [
                        result.loans[0].billingDates[0]
                    ],
                    "totalValue": {
                        "value": 5.1
                    },
                    "remainingAmount": {
                        "value": 0
                    }
                }
            ],
            "name": "e2e-test"
        }).toStrictEqual(result)

        // 1 membro pagar o emprestimo
        const pagarEmprestimo = require('../pagamento-emprestimo')
        req.body = {
            caixinhaId: 'e2e-test', 
            emprestimoUid: result.loans[0].uid, 
            valor: 5.1, 
            name: 'jean', 
            email: 'jean@jean'
        }

        await pagarEmprestimo(context, req)

        result = JSON.parse(fileSystem.readFileSync(path.resolve(__dirname, '..', 'caixinhas.json')))

        expect({
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
                "value": 25.1
            },
            "deposits": [
                {
                    "date": result.deposits[0].date,
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
                    "approved": true,
                    "member": {
                        "name": "jean",
                        "email": "jean@jean"
                    },
                    "date": result.loans[0].date,
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
                    "approvals": 2,
                    "description": "test e2e",
                    "payments": [
                        {
                            "member": {
                                "name": "jean",
                                "email": "jean@jean"
                            },
                            "date": result.loans[0].payments[0].date,
                            "value": {
                                "value": 5.1
                            },
                            "description": "Pago via caixinha web"
                        }
                    ],
                    "uid": result.loans[0].uid,
                    "memberName": "jean",
                    "requiredNumberOfApprovals": 2,
                    "listOfMembersWhoHaveAlreadyApproved": [
                        {
                            "name": "jean",
                            "email": "jean@jean"
                        },
                        {
                            "name": "augusto"
                        }
                    ],
                    "billingDates": [
                        result.loans[0].billingDates[0]
                    ],
                    "isPaidOff": true,
                    "totalValue": {
                        "value": 5.1
                    },
                    "remainingAmount": {
                        "value": 0
                    }
                }
            ],
            "name": "e2e-test"
        }).toStrictEqual(result)
    })

})