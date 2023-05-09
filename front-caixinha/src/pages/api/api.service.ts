import { Caixinha, IMeusEmprestimos } from "@/types/types"

const BASE_URL = 'https://emprestimo-caixinha.azurewebsites.net/api'

const dev = process.env.NODE_ENV === 'development'
console.log('NODE ENV', dev)

function retornaComAtraso(value: any): Promise<any> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value)
        }, 2000)
    })
}

async function asyncFetch(url: string, method: string, body?: any): Promise<any> {
    try {
        const response = await fetch(url, { method, body })
        if (!response.ok) {
            const json = await response.json()
            throw new Error(`HTTP error! Status: ${response.status} - ${json}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        throw new Error('Http error')
    }
}

export async function getMeusEmprestimos(): Promise<IMeusEmprestimos> {
    if (dev) {
        return retornaComAtraso({
            "caixinhas": [
                {
                    "currentBalance": 84,
                    "myLoans": [],
                    "loansForApprove": [
                        {
                            "requiredNumberOfApprovals": 2,
                            "description": "sera que foi mesmo?",
                            "approvals": 2,
                            "interest": 3,
                            "fees": 0,
                            "valueRequested": 1,
                            "date": "2023-05-09T14:09:57.110Z",
                            "totalValue": 1.03,
                            "approved": true,
                            "uid": "013b1172-f830-41bf-9f36-92177c66bf6c",
                            "memberName": "augusto"
                        },
                        {
                            "requiredNumberOfApprovals": 2,
                            "description": "sera que foi mesmo?",
                            "approvals": 2,
                            "interest": 3,
                            "fees": 0,
                            "valueRequested": 1,
                            "date": "2023-05-09T14:09:57.110Z",
                            "totalValue": 1.03,
                            "approved": true,
                            "uid": "013b1172-f830-41bf-9f36-92177c66bf6c",
                            "memberName": "augusto"
                        }
                    ]
                }
            ]
        })
    }

    return asyncFetch(`${BASE_URL}/meus-emprestimos`, 'GET')
}

export async function getCaixinhas(): Promise<Caixinha[]> {
    if (dev) {
        return retornaComAtraso([
            {
                "members": [],
                "currentBalance": {
                    "value": 85
                },
                "id": "644ab7f5f10d4800c629a1d2"
            }
        ])
    }

    return asyncFetch(`${BASE_URL}/get-caixinhas`, 'GET')
}

export async function doEmprestimo(params: any) {
    if (dev) {
        return retornaComAtraso(true)
    }

    return asyncFetch(`${BASE_URL}/emprestimo?code=Q47dylJAkJc3xSGB2RNiBkLzLms-lhvWFbyRE4qrlCriAzFuN_CxsA==&clientId=default`,
        'POST',
        JSON.stringify(params))
}

export async function joinABox(params: any) {
    if (dev) {
        return retornaComAtraso(true)
    }

    return asyncFetch(`${BASE_URL}/user-join-caixinha`,
        'POST',
        JSON.stringify(params))
}