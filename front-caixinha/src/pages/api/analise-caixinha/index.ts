import state, { asyncFetch, retornaComAtraso } from '@/pages/api/api.service';
import data from './data'
const CACHE_KEY = 'analise-caixinha'

export async function getDadosAnaliseCaixinha(idCaixinha: string) {
    const key = `${CACHE_KEY}-${idCaixinha}`
    if (state.cache.has(key)) {
        return state.cache.get(CACHE_KEY)
    }

    let response
    if (state.isDev) {
        response = await retornaComAtraso(data)
    } else {
        response = await asyncFetch(`${state.CAIXINHA_URL}/dados-analise?caixinhaId=${idCaixinha}`, 'GET')
    }

    state.cache.set(key, response)
    return response
}