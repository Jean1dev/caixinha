import axios from 'axios'

function retornaComAtraso(value: any): Promise<any> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value)
        }, 1000)
    })
}

const dev = process.env.NODE_ENV === 'development'

const http = axios.create({
    baseURL: 'BASE_URL',
    timeout: 20000
})

http.interceptors.response.use((response) => {
    return response
}, (error) => {
    console.log(error.response?.data);
    if (error.response) {
        debugger
        throw new Error(error.response.data.message)
    }

    throw error
})


async function asyncFetch(url: string, method: string, body?: any): Promise<any> {
    try {
        const response = await http({
            url,
            method,
            data: body
        })

        if (response.status == 200) {
            return response.data
        }

        debugger
    } catch (error) {
        throw error
    }
}

export function getTipoAtivos() {
    if (dev) {
        return retornaComAtraso({
            "TipoAtivo": [
                {
                    "ACAO_NACIONAL": "Ações Nacionais"
                },
                {
                    "ACAO_INTERNACIONAL": "Ações Internacionais"
                },
                {
                    "REITs": "Real Estate"
                },
                {
                    "FII": "Fundos Imobiliarios"
                },
                {
                    "CRYPTO": "Cryptomoedas"
                },
                {
                    "RENDA_FIXA": "Renda Fixa"
                }
            ]
        })
    }

    return asyncFetch(`/ativo/tipo-ativos`, 'GET')
}