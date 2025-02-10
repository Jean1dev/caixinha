import { CARTEIRA_SERVICE } from "@/constants/ApiConts";
import { getUserId } from "./user";

interface DefaultBackendResponse {
    status: number
    message: string
}

export interface OrdemCompraInput {
    quantidade: number
    ticker: string
    email: string
    username: string
}

function buildBackendResponse(res: any): DefaultBackendResponse {
    if (res.status === 200) {
        return {
            status: 200,
            message: 'OK'
        }
    }

    return {
        status: res.statusCode || 500,
        message: JSON.stringify(res.message || 'Internal Server Error')
    }
}

async function getIDByTicker(ticker: string): Promise<string> {
    const url = `${CARTEIRA_SERVICE}/ativo/id?ticker=${ticker}`
    try {
        const call = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const response = await call.json()
        console.log('getIDByTicker response:', response)
        return response.id
    } catch (error) {
        console.error('Error during getIDByTicker:', error);
        throw new Error('Internal Server Error')
    }
}

export async function OrdemCompraCall(input: OrdemCompraInput): Promise<DefaultBackendResponse> {
    const url = `${CARTEIRA_SERVICE}/marketplace/compra-ativos`
    
    try {
        const ativoRef = await getIDByTicker(input.ticker)
        const body = {
            usuarioRef: await getUserId({
                email: input.email,
                username: input.username
            }),
            quantidade: 1.0,
            ativoRef,
        }

        const call = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return buildBackendResponse(call)
    } catch (error) {
        console.error('Error during OrdemCompraCall:', error);
        return {
            status: 500,
            message: 'Internal Server Error'
        };
    }
}