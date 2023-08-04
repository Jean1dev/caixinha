import state, { asyncGetWithParamethers, retornaComAtraso } from '@/pages/api/api.service';
import data from './data'
const CACHE_KEY = 'perfil'

export async function getDadosPerfil(email: string, name: string) {
    if (state.cache.has(CACHE_KEY)) {
        return state.cache.get(CACHE_KEY)
    }

    let response
    if (state.isDev) {
        response = await retornaComAtraso(data)
    } else {
        response = await asyncGetWithParamethers(`${state.CAIXINHA_URL}/get-user-data`, { email, memberName: name })
    }

    state.cache.set(CACHE_KEY, response)
    return response
}