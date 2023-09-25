import state, { retornaComAtraso } from "../api.service"
import data from "./data"

const CACHE_KEY = 'feed'

export async function getMeuFeed(params: any) {
    if (state.cache.has(CACHE_KEY)) {
        return state.cache.get(CACHE_KEY)
    }

    const dados = await retornaComAtraso(data)
    state.cache.set(CACHE_KEY, dados)
    return dados
}