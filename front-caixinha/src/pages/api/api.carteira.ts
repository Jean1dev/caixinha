import axios from 'axios'
import { retornaComAtraso } from './api.service'

const dev = process.env.NODE_ENV === 'development'

const http = axios.create({
    baseURL: 'https://carteira-14bc707a7fab.herokuapp.com',
    timeout: 30000
})

http.interceptors.response.use((response) => {
    return response
}, (error) => {
    console.log(error.response?.data);
    if (error.response) {
        debugger
        console.log(error.response.data.message)
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

export async function setDefaultHeaders(user: string, email: string) {
    http.defaults.headers.common['user'] = user
    http.defaults.headers.common['email'] = email
}

export async function getTipoAtivos() {
    return asyncFetch(`/ativo/tipo-ativos`, 'GET')
}

export async function getMetaPronta(tipoMeta: string) {
    return asyncFetch(`/carteira/meta?tipo=${tipoMeta}`, 'GET')
}

export async function criarNovaCarteira(payload: any) {
    return asyncFetch('/carteira', 'POST', payload)
}

export async function getMinhasCarteiras(user: string, email: string) {
    if (dev) {
        return retornaComAtraso([
            {
                "id": "6499dee25b06ad77e23ccaad",
                "nome": "minha-primeira-carteira",
                "quantidadeAtivos": 0
            },
            {
                "id": "6499f9895bbd71299aa85f8a",
                "nome": "minha-primeira-carteira",
                "quantidadeAtivos": 1
            },
            {
                "id": "649aed140f31fd4311ef67e4",
                "nome": "nome da minha carteira",
                "quantidadeAtivos": 0
            },
            {
                "id": "649aed190f31fd4311ef67e5",
                "nome": "nome da minha carteira",
                "quantidadeAtivos": 0
            },
            {
                "id": "649af067f996d030a53cc27a",
                "nome": "nome da minha carteira",
                "quantidadeAtivos": 0
            }
        ])
    }

    return asyncFetch(`/carteira?user=${user}&email=${email}`, 'GET')
}