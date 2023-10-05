import state, { asyncFetch, retornaComAtraso } from '@/pages/api/api.service';
import data from './data'
import { Caixinha } from '@/types/types';
const CACHE_KEY = 'caixinhas'

interface IGetCaixinhasQuery {
    query: string
}

export async function getCaixinhas(search?: IGetCaixinhasQuery): Promise<Caixinha[]> {
    if (state.cache.has(CACHE_KEY)) {
        const caixinhas: Caixinha[] = state.cache.get(CACHE_KEY)
        
        if (search?.query) {
            return caixinhas.filter((caix) => caix.name?.includes(search.query))
        }

        return caixinhas
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