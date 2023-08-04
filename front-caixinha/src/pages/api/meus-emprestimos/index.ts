import { IMeusEmprestimos } from "@/types/types"
import state, { asyncFetch, retornaComAtraso } from "../api.service"
import data from './data'
const CACHE_KEY = 'meus-emprestimos'

export async function getMeusEmprestimos({ name, email }: any): Promise<IMeusEmprestimos> {
    if (state.cache.has(CACHE_KEY)) {
        return state.cache.get(CACHE_KEY)
    }

    let response
    if (state.isDev) {
        response = await retornaComAtraso(data)
    } else {
        response = await asyncFetch(`${state.CAIXINHA_URL}/meus-emprestimos?name=${name}&email=${email}`, 'GET')
    }

    state.cache.set(CACHE_KEY, response)
    return response
}