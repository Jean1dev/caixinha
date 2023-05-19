import { Caixinha, IMeusEmprestimos } from "@/types/types"
import axios from 'axios'

//const BASE_URL = 'http://localhost:7071/api' || 'https://emprestimo-caixinha.azurewebsites.net/api'
const BASE_URL = 'https://emprestimo-caixinha.azurewebsites.net/api'
const URL_STORAGE_SERVER = 'https://storage-manager-svc.herokuapp.com'
const BUCKET_STORAGE = 'binnoroteirizacao'

const dev = process.env.NODE_ENV === 'development'
console.log('NODE ENV', dev)
console.log(BASE_URL)

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

function getBuckets() {
    http.get(`${URL_STORAGE_SERVER}/v1/s3/buckets`).then(({ data }) => {
        console.log(data)
    }).catch(() => {
        console.log('do nothing')
    })
}

export async function uploadResource(resourceFile: string | Blob) {
    const form = new FormData();
    form.append("file", resourceFile);

    const options = {
        method: 'POST',
        url: `${URL_STORAGE_SERVER}/v1/s3`,
        params: { bucket: BUCKET_STORAGE },
        headers: {
            'Content-Type': 'multipart/form-data',
            'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
        },
        data: form
    };

    const response = await http.request(options)
    return response.data
}


function retornaComAtraso(value: any): Promise<any> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value)
        }, 1000)
    })
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
                    "myLoans": [],
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
                            "uid": "013b1172-f830-41bf-9f36-92177c66bf6c",
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