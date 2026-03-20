import { CAIXINHA_SERVICE, COMMUNICATION_SERVICE, STORAGE_SERVICE } from '@/constants/ApiConts'
import axios from 'axios'
import * as postData from './feed/data'

function isDev() {
    if (process.env.NEXT_PUBLIC_API_URL)
        return false

    return process.env.NODE_ENV === 'development'
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || CAIXINHA_SERVICE
const URL_STORAGE_SERVER = STORAGE_SERVICE
const BUCKET_STORAGE = 'binnoroteirizacao'

const dev = isDev()

const http = axios.create({
    baseURL: BASE_URL,
    timeout: 20000
})

http.interceptors.response.use((response) => {
    return response
}, (error) => {
    if (process.env.NODE_ENV === 'development') {
        console.warn('[http]', error.response?.data ?? error.message)
    }
    if (error.response) {
        const msg = error.response.data?.message
        throw new Error(typeof msg === 'string' ? msg : 'Erro na requisição')
    }
    throw error instanceof Error ? error : new Error('Erro na requisição')
})

const state = {
    CAIXINHA_URL: BASE_URL,
    STORAGE_URL: URL_STORAGE_SERVER,
    httpCaixinha: http,
    isDev: dev,
    cache: new Map()
}

export default state

export function getBuckets() {
    if (dev) {
        return
    }

    http.get(`${URL_STORAGE_SERVER}/v1/s3/buckets`).then(({ data }) => {
        console.log(data)
    }).catch(() => {
        console.log('do nothing')
    })
}

export async function uploadResource(resourceFile: string | Blob) {
    const url = dev
        ? `${URL_STORAGE_SERVER}/v1/local`
        : `${URL_STORAGE_SERVER}/v1/s3`

    const form = new FormData();
    form.append("file", resourceFile);

    const options = {
        method: 'POST',
        url,
        params: { bucket: BUCKET_STORAGE },
        headers: {
            'Content-Type': 'multipart/form-data',
            'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
        },
        data: form
    };

    if (dev) {
        return 'https://teletime.com.br/wp-content/uploads/2021/06/Itau_berrini_6-scaled.jpeg'
    }

    const response = await axios.request(options)

    // if (dev) {
    //     return response.data.storageLocaion
    // }

    return response.data
}

export function retornaComAtraso(value: any): Promise<any> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value)
        }, 1000)
    })
}

export async function asyncGetWithParamethers(url: string, params: any) {
    try {
        const response = await http({
            url,
            method: 'GET',
            params
        })

        if (response.status == 200) {
            return response.data
        }

        throw new Error('Resposta inválida')
    } catch (error) {
        throw error
    }
}

export async function asyncFetch(url: string, method: string, body?: any): Promise<any> {
    try {
        const response = await http({
            url,
            method,
            data: body
        })

        if (response.status == 200) {
            return response.data
        }

        throw new Error('Resposta inválida')
    } catch (error) {
        throw error
    }
}

export type { IGerarLinkPagamentoBody } from '@/features/caixinha/api/caixinha.types'
export {
    aprovarEmprestimo,
    doEmprestimo,
    doDeposito,
    joinABox,
    pagarEmprestimo,
    recusarEmprestimo,
    removerEmprestimo,
    getValorParcelas,
    getChavesPix,
    getExtrato,
    updatePerfil,
    getMeusPagamentos,
    getEmprestimo,
    getUltimoEmprestimoPendente,
    sairDaCaixinha,
    gerarLinkDePagamento,
    solicitarRenegociacao,
    aceitarRenegociacao,
} from '@/features/caixinha/api/caixinha.api'

export async function getPostInfo(postId: string) {
    if (dev) {
        return retornaComAtraso(postData.default[0])
    }

    return asyncFetch(`https://${COMMUNICATION_SERVICE}/social-feed/${postId}`, 'GET')
}

export interface IPostPayload {
    authorName?: string
    authorAvatar?: string
    message: string
    media?: string | null
}

export async function publicarPost(payload: IPostPayload) {
    if (dev) {
        return retornaComAtraso(true)
    }

    return asyncFetch(`https://${COMMUNICATION_SERVICE}/social-feed`, 'POST', payload)
}

export async function likePost(postId: string) {
    if (dev) {
        return retornaComAtraso(true)
    }

    return asyncFetch(`https://${COMMUNICATION_SERVICE}/social-feed/like`, 'POST', {
        postId,
        like: true,
        unlike: false
    })
}

export async function unlikePost(postId: string) {
    if (dev) {
        return retornaComAtraso(true)
    }

    return asyncFetch(`https://${COMMUNICATION_SERVICE}/social-feed/like`, 'POST', {
        postId,
        like: false,
        unlike: true
    })
}

export async function publicarComentario(payload: any) {
    if (dev) {
        return retornaComAtraso(true)
    }

    return asyncFetch(`https://${COMMUNICATION_SERVICE}/social-feed/comment`, 'POST', payload)
}

export async function marcarNotificactionsComoLida(payload: any) {
    if (dev) {
        return retornaComAtraso(true)
    }

    return asyncFetch(`https://${COMMUNICATION_SERVICE}/notificacao/mark-as-read`, 'POST', payload)
}
