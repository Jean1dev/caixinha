const { connect, insertDocument } = require('../v2/mongo-operations')

function createFullCaixinhaJson() {
    return {
        "members": [
            {
                "name": "augusto",
                "email": "jean@jean"
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
                "date": new Date(),
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
        "loans": [
            {
                "approved": true,
                "member": {
                    "name": "jean",
                    "email": "jean@jean"
                },
                "date": new Date(),
                "valueRequested": {
                    "value": 2
                },
                "fees": {
                    "value": 0
                },
                "interest": {
                    "value": 3
                },
                "box": null,
                "approvals": 2,
                "description": "primeiro",
                "payments": [],
                "uid": "51530288-cbc3-431f-b9c1-965b02ddc767",
                "installments": 2,
                "memberName": "jean",
                "requiredNumberOfApprovals": 2,
                "listOfMembersWhoHaveAlreadyApproved": [
                    {
                        "name": "jean",
                        "email": "jean@jean"
                    },
                    {
                        "name": "augusto",
                        "email": "jean@jean"
                    }
                ],
                "billingDates": [
                    {
                        "date": new Date()
                    },
                    {
                        "date": new Date()
                    }
                ],
                "totalValue": {
                    "value": 2.06
                },
                "isPaidOff": null,
                "remainingAmount": {
                    "value": 0
                }
            },
            {
                "approved": false,
                "member": {
                    "name": "jean",
                    "email": "jean@jean"
                },
                "date": {
                    "date": new Date()
                },
                "valueRequested": {
                    "value": 2
                },
                "fees": {
                    "value": 0
                },
                "interest": {
                    "value": 3
                },
                "box": null,
                "approvals": 1,
                "description": "primeiro",
                "payments": [],
                "uid": "2b3a0799-2d33-42ee-8455-207bdd42a071",
                "installments": 2,
                "memberName": "jean",
                "requiredNumberOfApprovals": 2,
                "listOfMembersWhoHaveAlreadyApproved": [
                    {
                        "name": "jean",
                        "email": "jean@jean"
                    }
                ],
                "billingDates": [
                    {
                        "date": new Date()
                    },
                    {
                        "date": new Date()
                    }
                ],
                "totalValue": {
                    "value": 2.06
                },
                "isPaidOff": null,
                "remainingAmount": {
                    "value": 0
                }
            }
        ],
        "name": "quarto debug"
    }
}

async function saveAndReturnCaixinhaIds(caixinha) {
    await connect()

    if (!caixinha) {
        caixinha = createFullCaixinhaJson()
    }

    const result = await insertDocument('caixinhas', caixinha)
    return { id: result.insertedId, caixinha }
}

module.exports = {
    saveAndReturnCaixinhaIds,
    createFullCaixinhaJson
}