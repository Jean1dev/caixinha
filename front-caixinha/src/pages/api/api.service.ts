import { Caixinha, IMeusEmprestimos } from "@/types/types"
import axios from 'axios'

//const BASE_URL = 'http://localhost:7071/api'
const BASE_URL = 'https://emprestimo-caixinha.azurewebsites.net/api'
const URL_STORAGE_SERVER = 'https://storage-manager-svc.herokuapp.com'
const BUCKET_STORAGE = 'binnoroteirizacao'

const dev = process.env.NODE_ENV === 'development'

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

    const response = await http.request(options)

    if (dev) {
        return response.data.storageLocaion
    }

    return response.data
}

function retornaComAtraso(value: any): Promise<any> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value)
        }, 1000)
    })
}

async function asyncGetWithParamethers(url: string, params: any) {
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

export async function aprovarEmprestimo(payload: any): Promise<any> {
    if (dev) {
        return retornaComAtraso(true)
    }

    return asyncFetch(`${BASE_URL}/aprovar-emprestimo`, 'POST', payload)
}

export async function getMinhasCaixinhas(name: string, email: string) {
    if (dev) {
        return retornaComAtraso([
            {
                "id": "6463d5093d725c4efc81a530",
                "name": "primeira-caixinha"
            },
            {
                "id": "6463e5601f8126593381a55d",
                "name": "segunda-caixinha"
            }
        ])
    }

    return asyncFetch(`${BASE_URL}/minhas-caixinhas?name=${name}&email=${email}`, 'GET')
}

export async function getMeusEmprestimos({ name, email }: any): Promise<IMeusEmprestimos> {
    if (dev) {
        return retornaComAtraso({
            "caixinhas": [
                {
                    "currentBalance": 84,
                    "myLoans": [
                        {
                            "requiredNumberOfApprovals": 2,
                            "description": "meu emprestimo?",
                            "approvals": 2,
                            "interest": 3,
                            "fees": 0,
                            "valueRequested": 1,
                            "date": "2023-05-09T14:09:57.110Z",
                            "totalValue": 1.03,
                            "approved": true,
                            "uid": "013b1172-f830-41bf-9f36-92127c66b36c",
                            "memberName": "jeanluca jeanlucajea"
                        },
                    ],
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
                            "uid": "013b1172-f830-41bf-9f36-92177c66b36c",
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

    return asyncFetch(`${BASE_URL}/meus-emprestimos?name=${name}&email=${email}`, 'GET')
}

export async function getCaixinhas(): Promise<Caixinha[]> {
    if (dev) {
        return retornaComAtraso([
            {
                "members": [],
                "currentBalance": {
                    "value": 85
                },
                "id": "644ab7f5f10d4800c629a1d2",
                "name": "caixinha da ana"
            },
            {
                "members": [],
                "currentBalance": {
                    "value": 885
                },
                "id": "644ab7f5f10d4800c629a1d3",
                "name": "caixinha do jorge"
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

export async function getDadosAnaliseCaixinha(idCaixinha: string) {
    if (dev) {
        return retornaComAtraso({
            saldoTotal: 102,
            totalDepositos: 1600,
            movimentacoes: [{
                id: 'f69f88012978187a6c12897f',
                tipo: 'DEPOSITO',
                valor: 30.5,
                nick: 'Arnando',
                date: '25/05/2022',
                status: 'pending'
            }],
            membros: [
                {
                    "name": "jeanluca jeanlucajea",
                    "email": "jeanlucafp@gmail.com"
                },
                {
                    "name": "Augusto Savi",
                    "email": "guto_savi@outlook.com"
                },
            ],
            percentuais: {
                series: [25.9, 23.9, 23.8, 15.6, 6.9, 3.8],
                labels: ['jean', 'augusto', 'gava', 'arnaldo', 'arthur', 'gean']
            },
            evolucaoPatrimonial: [
                {
                    name: 'Saldo da carteira',
                    data: [1500, 1505, 1545, 1590, 1650, 1750, 1800, 2100, 2250, 2300, 2450, 2800]
                },
                {
                    name: 'Saldo disponivel no mês',
                    data: [1500, 463, 505, 505, 909, 1545, 2000, 505, 498, 1997, 1800, 0]
                }
            ]
        })
    }

    return asyncFetch(`${BASE_URL}/dados-analise?caixinhaId=${idCaixinha}`, 'GET')
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