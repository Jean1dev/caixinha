import axios from 'axios'
import { retornaComAtraso } from './api.service'

const dev = process.env.NODE_ENV === 'development'
const baseURL = 'https://carteira-production-7aeb1.up.railway.app'
/**
 * 'https://carteira-14bc707a7fab.herokuapp.com'
 * http://localhost:8080  
 */


const http = axios.create({
    baseURL,
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
        ])
    }

    return asyncFetch(`/carteira?user=${user}&email=${email}`, 'GET')
}

export async function getMeusAtivos(carteiraId: string) {
    if (dev) {
        return retornaComAtraso([
            {
                "id": "64a32459bc8fe91194c8e2b6",
                "carteiraRef": "64a31a89e5be69144c4aac8c",
                "tipoAtivo": "ACAO_NACIONAL",
                "localAlocado": "PETR4",
                "percentualRecomendado": 0.0,
                "valorAtual": 66.23,
                "nota": 5,
                "percentualTotal": 100.0,
                "quantidade": 2.0,
                "ticker": "VALE3",
                "valorRecomendado": 100.0,
                "image": "https://s3-symbol-logo.tradingview.com/brasileiro-petrobras--600.png"
            },
            {
                "id": "64a32459bc8fe91194c8e2b1",
                "carteiraRef": "64a31a89e5be69144c4aac8c",
                "tipoAtivo": "ACAO_NACIONAL",
                "localAlocado": "DASA3",
                "percentualRecomendado": 0.0,
                "valorAtual": 12.18,
                "nota": 9,
                "percentualTotal": 100.0,
                "quantidade": 4,
                "ticker": "DASA3",
                "valorRecomendado": 100.0,
                "image": "https://s3-symbol-logo.tradingview.com/dasa-on-nm--600.png"
            },
            {
                "id": "64a32459bc8fe91194c8A2b1",
                "carteiraRef": "64a31a89e5be69144c4aac8c",
                "tipoAtivo": "ACAO_NACIONAL",
                "localAlocado": "VALE3",
                "percentualRecomendado": 0.0,
                "valorAtual": 12.18,
                "nota": 1,
                "percentualTotal": 100.0,
                "quantidade": 4,
                "ticker": "VALE3",
                "valorRecomendado": 100.0,
                "image": "https://s3-symbol-logo.tradingview.com/vale--600.png"
            }
        ])
    }

    return asyncFetch(`/carteira/meus-ativos/${carteiraId}`, 'GET')
}

export async function getCriterios(tipo: string) {
    return asyncFetch(`/criterio?tipo=${tipo}`, 'GET')
}

export async function criarAtivo(payload: any) {
    return asyncFetch('/ativo', 'POST', payload)
}