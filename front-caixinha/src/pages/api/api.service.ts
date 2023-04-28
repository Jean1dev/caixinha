const BASE_URL = 'https://emprestimo-caixinha.azurewebsites.net/api'

const dev = process.env.NODE_ENV === 'development'
console.log('NODE ENV', dev)

function retornaComAtraso(value: any) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value)
        }, 2000)
    })
}


export async function getCaixinhas() {
    if (dev) {
        return retornaComAtraso([
            {
                "members": [],
                "currentBalance": 85,
                "deposits": [],
                "loans": [],
                "id": "644ab7f5f10d4800c629a1d2"
            }
        ])
    }

    const res = await fetch(`${BASE_URL}/get-caixinhas`)
    const data = await res.json()
    return data
}

export async function doEmprestimo(params: any) {
    if (dev) {
        return retornaComAtraso(true)
    }

    await fetch(`${BASE_URL}/emprestimo?code=Q47dylJAkJc3xSGB2RNiBkLzLms-lhvWFbyRE4qrlCriAzFuN_CxsA==&clientId=default`, {
        method: 'POST',
        body: JSON.stringify(params),
    })
}