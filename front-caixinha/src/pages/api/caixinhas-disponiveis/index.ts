import state, { asyncFetch, retornaComAtraso } from '@/pages/api/api.service';
import data from './data'
const CACHE_KEY = 'minhas-caixinhas'

export async function getMinhasCaixinhas(name: string, email: string) {
    if (state.cache.has(CACHE_KEY)) {
        return state.cache.get(CACHE_KEY)
    }

    let response
    if (state.isDev) {
        response = await retornaComAtraso(data)
    } else {
        response = await asyncFetch(`${state.CAIXINHA_URL}/minhas-caixinhas?name=${name}&email=${email}`, 'GET')
    }

    state.cache.set(CACHE_KEY, response)
    return response
}