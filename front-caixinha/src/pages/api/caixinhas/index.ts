import state, { asyncFetch, retornaComAtraso } from '@/pages/api/api.service';
import data from './data'
import { Caixinha } from '@/types/types';
const CACHE_KEY = 'caixinhas'

export async function getCaixinhas(): Promise<Caixinha[]> {
    if (state.cache.has(CACHE_KEY)) {
        return state.cache.get(CACHE_KEY)
    }

    let response
    if (state.isDev) {
        response = await retornaComAtraso(data)
    } else {
        response = await asyncFetch(`${state.CAIXINHA_URL}/get-caixinhas`, 'GET')
    }

    state.cache.set(CACHE_KEY, response)
    return response
}