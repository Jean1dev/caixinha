import { CAIXINHA_SERVICE, COMMUNICATION_SERVICE, STORAGE_SERVICE } from '@/constants/ApiConts'
import axios from 'axios'

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
    console.log(error.response?.data);
    if (error.response) {
        debugger
        throw new Error(error.response.data.message)
    }

    throw error
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

    const response = await axios.request(options)

    if (dev) {
        return response.data.storageLocaion
    }

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

        debugger
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

        debugger
    } catch (error) {
        throw error
    }
}

export async function aprovarEmprestimo(payload: any): Promise<any> {
    if (dev) {
        return retornaComAtraso(true)
    }

    return asyncFetch(`${BASE_URL}/aprovar-emprestimo`, 'POST', payload)
}

export async function doEmprestimo(params: any) {
    if (dev) {
        return retornaComAtraso(true)
    }

    return asyncFetch(`${BASE_URL}/emprestimo?code=Q47dylJAkJc3xSGB2RNiBkLzLms-lhvWFbyRE4qrlCriAzFuN_CxsA==&clientId=default`,
        'POST',
        JSON.stringify(params))
}

export async function doDeposito(params: any) {
    if (dev) {
        return retornaComAtraso(true)
    }

    return asyncFetch(`${BASE_URL}/deposito`,
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

export async function pagarEmprestimo(params: any) {
    if (dev) {
        return retornaComAtraso(true)
    }

    return asyncFetch(`${BASE_URL}/pagamento-emprestimo`,
        'POST',
        params)
}

export async function getValorParcelas(params: any) {
    if (dev) {
        return retornaComAtraso([
            {
                "value": 2.58
            },
            {
                "value": 2.58
            }
        ])
    }

    return asyncFetch(`${BASE_URL}/calcular-parcelas`,
        'POST',
        params
    )
}

export async function getChavesPix(caixinhaID: string) {
    if (dev) {
        return retornaComAtraso({
            "keysPix": [
                "fe52da16-71c9-47f6-9daa-2e89034f97b0"
            ],
            "urlsQrCodePix": [
                "https://cvws.icloud-content.com/B/ARhxmpJ2w7BmrNOVeYZVHQRBgPhCAU-JQb6LqqWjYGX73-pD8mnxHt9c/Captura+de+Tela+2023-05-31+a%CC%80%28s%29+14.44.30.png?o=Ar519Drlg4Gh0A5ohG6PrE9KAwfUmcz55_7mJ7rv8iyx&v=1&x=3&a=CAogvl8SBV9_Ajgaoslhrhtx9LK_6-_amcZoLAKQpBQNk7oSbxCxjq-XhzEYseuKmYcxIgEAUgRBgPhCWgTxHt9caidOXL1-O84Qr5LLA_VwvngENj56s-SjeUcxsfyVwJgMYIopd2emXoRyJ5K0bb-KXGGLRKhuVkqEsXkBoUXg6JK7cVQKzkKtdCFYpK9yrPBrcA&e=1685558834&fl=&r=8985d717-8299-48df-8ead-201f3605aa08-1&k=L-qDoY-jaoxPgueEijo7og&ckc=com.apple.clouddocs&ckz=com.apple.CloudDocs&p=107&s=zM1b0XuCEb7SlCyobqvv02Z4ook&cd=i"
            ]
        })
    }

    return asyncFetch(`${BASE_URL}/get-chaves-pix?caixinhaId=${caixinhaID}`, 'GET')
}

export async function getExtrato(params: any) {
    if (dev) {
        return retornaComAtraso([
            {
                "id": "64765f0bf72fe795ddd61c34",
                "tipo": "DEPOSITO",
                "valor": 25,
                "nick": "jean",
                "status": "completed",
                "date": "30/05/2023"
            },
            {
                "id": "64766bc201dd4e6d382db357",
                "tipo": "DEPOSITO",
                "valor": 25.89,
                "nick": "jean",
                "status": "completed",
                "date": "30/05/2023"
            }
        ])
    }

    return asyncGetWithParamethers(`${BASE_URL}/get-extrato`, params)
}

export async function updatePerfil(body: any) {
    if (dev) {
        return retornaComAtraso(true)
    }

    return asyncFetch(`${BASE_URL}/update-profile-member`, 'POST', body)
}

export async function getEmprestimo(uid: string) {
    if (dev) {
        return retornaComAtraso({
            "requiredNumberOfApprovals": 1,
            "description": "sera que foi mesmo?",
            "approvals": 1,
            "interest": 3,
            "fees": 0,
            "valueRequested": 5,
            "date": "17/07/2023",
            "totalValue": 5.15,
            "approved": true,
            "uid": "044b0dd2-a21f-4b6f-b0f1-f93865e0ead0",
            "memberName": "jean",
            "parcelas": 0,
            "billingDates": [
                {
                    "valor": null,
                    "data": "16/08/2023"
                }
            ]
        })
    }

    return asyncGetWithParamethers(`${BASE_URL}/get-emprestimo`, { uid })
}

export async function sairDaCaixinha(body: any) {
    if (dev) {
        return retornaComAtraso(true)
    }

    return asyncFetch(`${BASE_URL}/remover-membro`, 'POST', body)
}

export async function publicarPost(payload: any) {
    if (dev) {
        return retornaComAtraso(true)
    }
    
    return asyncFetch(`${COMMUNICATION_SERVICE}/something`, 'POST', payload)
}