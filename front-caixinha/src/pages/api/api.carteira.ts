import axios from 'axios'
import { asyncGetWithParamethers, retornaComAtraso } from './api.service'
import { INovoAporte } from '@/types/types'
import { CARTEIRA_SERVICE } from '@/constants/ApiConts'

function isDev() {
    if (process.env.NEXT_PUBLIC_API_CARTEIRA)
        return false

    return process.env.NODE_ENV === 'development'
}

const dev = isDev()
const baseURL = process.env.NEXT_PUBLIC_API_CARTEIRA || CARTEIRA_SERVICE

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
            {
                "id": "6496dee25b06ad77e23ccaad",
                "nome": "outra carteira",
                "quantidadeAtivos": 2
            },
        ])
    }

    return asyncFetch(`/carteira?user=${user}&email=${email}`, 'GET')
}

export interface AtivoDto {
    id: string
    carteira: string
    tipoAtivo: string
    nome: string
    nota: number
    quantidade: number
    image: string | null
    valorAtual: number
}

export interface SpringPage<T> {
    content: T[]
    pageable: Pageable
    totalPages: number
    totalElements: number
    last: boolean
    size: number
    number: number
    sort: any
    numberOfElements: number
    first: boolean
    empty: boolean
}

export interface Pageable {
    sort: any
    offset: number
    pageNumber: number
    pageSize: number
    paged: boolean
    unpaged: boolean
}

export interface MeusAtivosRequestFilter {
    page: number,
    size: number,
    carteiras: string[],
    tipos: string[] | null
}

export async function getMeusAtivos(params: MeusAtivosRequestFilter): Promise<SpringPage<AtivoDto>> {
    if (dev) {
        return retornaComAtraso({
            content: [{
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
            }],
            "pageable": {
                "sort": {
                    "empty": true,
                    "sorted": false,
                    "unsorted": true
                },
                "offset": 0,
                "pageNumber": 0,
                "pageSize": 10,
                "paged": true,
                "unpaged": false
            },
            "totalPages": 1,
            "totalElements": 3,
            "last": true,
            "size": 5,
            "number": 0,
            "sort": {
                "empty": true,
                "sorted": false,
                "unsorted": true
            },
            "numberOfElements": 3,
            "first": true,
            "empty": false
        })
    }

    return asyncGetWithParamethers(`${baseURL}/carteira/meus-ativos`, {
        page: params.page,
        size: params.size,
        carteiras: params.carteiras.join(','),
        tipos: params.tipos ? params.tipos.join(',') : null
    })
}

export async function getCriterios(tipo: string) {
    return asyncFetch(`/criterio?tipo=${tipo}`, 'GET')
}

export async function criarAtivo(payload: any) {
    return asyncFetch('/ativo', 'POST', payload)
}

export async function getDistribuicaoPorMeta(carteiraId: string) {
    if (dev) {
        return retornaComAtraso({
            "Cryptomoedas": 25,
            "Renda Fixa": 0.0,
            "Real Estate": 0.0,
            "Ações Internacionais": 0.0,
            "Fundos Imobiliarios": 0.0,
            "Ações Nacionais": 75
        })
    }
    return asyncFetch(`carteira/distribuicao-por-meta/${carteiraId}`, 'GET')
}

export async function atualizarAtivo(payload: any) {
    if (dev) {
        return retornaComAtraso(true)
    }

    return asyncFetch('/ativo', 'PUT', payload)
}

export async function removerAtivo(ativoId: string) {
    if (dev) {
        return retornaComAtraso(true)
    }

    return asyncFetch(`/ativo/${ativoId}`, 'DELETE')
}

export async function calcularAporte(carteira: string, valor: number): Promise<INovoAporte> {
    if (dev) {
        return retornaComAtraso({
            "recomendacaoAporteList": [
                {
                    "recomendacao": -39.5,
                    "ativo": {
                        "tipoAtivo": "ACAO_NACIONAL",
                        "localAlocado": "IRBR3",
                        "percentualRecomendado": 0.0,
                        "valorAtual": 39.5,
                        "nota": 5,
                        "percentualTotal": 97.5,
                        "quantidade": 1.0,
                        "ticker": "IRBR3"
                    }
                },
                {
                    "recomendacao": -1.02,
                    "ativo": {
                        "tipoAtivo": "ACAO_NACIONAL",
                        "localAlocado": "OIBR3",
                        "percentualRecomendado": 0.0,
                        "valorAtual": 1.02,
                        "nota": 7,
                        "percentualTotal": 2.5,
                        "quantidade": 1.0,
                        "ticker": "OIBR3"
                    }
                }
            ],
            "metaComValorRecomendados": [
                {
                    "tipoAtivo": "FII",
                    "valorRecomendado": 9.828000000000001
                },
                {
                    "tipoAtivo": "ACAO_INTERNACIONAL",
                    "valorRecomendado": 6.552000000000001
                },
                {
                    "tipoAtivo": "RENDA_FIXA",
                    "valorRecomendado": 32.760000000000005
                },
                {
                    "tipoAtivo": "ACAO_NACIONAL",
                    "valorRecomendado": -30.692
                },
                {
                    "tipoAtivo": "CRYPTO",
                    "valorRecomendado": 0.0
                },
                {
                    "tipoAtivo": "REITs",
                    "valorRecomendado": 6.552000000000001
                }
            ]
        })
    }

    return asyncFetch('/carteira/novo-aporte/' + carteira, 'POST', { valor })
}

export async function aportarNoAtivo(params: any) {
    if (dev) {
        return retornaComAtraso(true)
    }
}

export async function consolidar(carteira: string): Promise<void> {
    if (dev) {
        return retornaComAtraso({})
    }

    return asyncFetch('/carteira/consolidar/' + carteira, 'POST')
}

export async function getListaSugestao(query: string): Promise<string[]> {
    if (dev) {
        return retornaComAtraso(['PETR4', 'ABCB4', 'ALUP11'])
    }



    return asyncFetch('/ativo/sugestao?query=' + query, 'GET')
}

export async function getSlideAcoes(): Promise<any[]> {
    return retornaComAtraso([{
        ticker: 'PETR4',
        type: '-',
        variation: 2.34
    }, {
        ticker: 'ABCB4',
        type: '+',
        variation: 0.15
    }, {
        ticker: 'ALUP11',
        type: '+',
        variation: 5.34
    }, {
        ticker: 'AAPL',
        type: '-',
        variation: 2.34
    }, {
        ticker: 'TOTS3',
        type: '+',
        variation: 1
    }])
    // if (dev) {
    //     return retornaComAtraso([{
    //         ticker: 'PETR4',
    //         type: '-',
    //         variation: 2.34
    //     }, {
    //         ticker: 'ABCB4',
    //         type: '+',
    //         variation: 0.15
    //     }, {
    //         ticker: 'ALUP11',
    //         type: '+',
    //         variation: 5.34
    //     }, {
    //         ticker: 'AAPL',
    //         type: '-',
    //         variation: 2.34
    //     }, {
    //         ticker: 'TOTS3',
    //         type: '+',
    //         variation: 1
    //     }])
    // }

    // return asyncFetch('/ativo/sugestao?query=', 'GET')
}