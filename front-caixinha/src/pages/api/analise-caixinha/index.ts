import state, { asyncFetch, retornaComAtraso } from '@/pages/api/api.service';
import data from './data'

export async function getDadosAnaliseCaixinha(idCaixinha: string) {
    let response
    if (state.isDev) {
        response = await retornaComAtraso(data)
    } else {
        response = await asyncFetch(`${state.CAIXINHA_URL}/dados-analise?caixinhaId=${idCaixinha}`, 'GET')
    }

    return response
}