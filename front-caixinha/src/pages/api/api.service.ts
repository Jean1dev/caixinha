import { Caixinha } from "@/types/types"

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


export async function getCaixinhas(): Promise<Caixinha[]> {
    if (dev) {
        return retornaComAtraso([
            {
                "members": [],
                "currentBalance": {
                    "value": 85
                },
                "deposits": [],
                "loans": [],
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