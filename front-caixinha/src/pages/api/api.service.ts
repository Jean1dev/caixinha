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
                    "currentBalance": 15.89,
                    "meusEmprestimosQuitados": [],
                    "meusEmprestimos": [
                        {
                            "requiredNumberOfApprovals": 1,
                            "description": "sera que foi mesmo?",
                            "approvals": 1,
                            "interest": 3,
                            "fees": 0,
                            "valueRequested": 5,
                            "date": "11/07/2023",
                            "totalValue": 5.15,
                            "approved": true,
                            "uid": "ef1f02e3-f6bf-4570-b50f-e581d41f3b08",
                            "memberName": "jean",
                            "remainingAmount": 0,
                            "isPaidOff": null,
                            "caixinha": "teste",
                            "parcelas": 2,
                            "billingDates": [
                                {
                                    "valor": 2.58,
                                    "data": "06/08/2023"
                                },
                                {
                                    "valor": 2.58,
                                    "data": "05/09/2023"
                                }
                            ]
                        },
                        {
                            "requiredNumberOfApprovals": 1,
                            "description": "sera que foi mesmo?",
                            "approvals": 1,
                            "interest": 3,
                            "fees": 0,
                            "valueRequested": 5,
                            "date": "11/07/2023",
                            "totalValue": 5.15,
                            "approved": true,
                            "uid": "3bce4d18-8af8-4db2-a7a5-03b67d455ad6",
                            "memberName": "jean",
                            "caixinha": "teste",
                            "parcelas": 0,
                            "billingDates": [
                                {
                                    "valor": null,
                                    "data": "10/08/2023"
                                }
                            ]
                        }
                    ],
                    "emprestimosParaAprovar": []
                }
            ],
            "totalPendente": 10.3,
            "totalPago": 0,
            "totalGeral": 10.3
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
                labels: ['jean luca fernandes', 'augusto', 'gava', 'arnaldo', 'arthur', 'gean']
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

export async function getDadosPerfil(email: string, name: string) {
    if (dev) {
        return retornaComAtraso({
            "_id": "648a2846b29e9b382ceb970b",
            "email": "jeanlucafp@gmail.com",
            "name": "jeanluca jeanlucajea",
            "phoneNumber": "5548998457797",
            "photoUrl": "https://eletrovibez.com/wp-content/uploads/2022/11/Boris-Brejcha-talento-i%CC%81mpar-que-converge-em-sonoridade-u%CC%81nica.jpg"
        })
    }

    return asyncGetWithParamethers(`${BASE_URL}/get-user-data`, { email, memberName: name })
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