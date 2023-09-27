import { COMMUNICATION_SERVICE } from "@/constants/ApiConts"
import state, { asyncFetch, retornaComAtraso } from "../api.service"
import data from "./data"

const CACHE_KEY = 'feed'

export async function getMeuFeed(username: string) {
    if (state.cache.has(CACHE_KEY)) {
        return state.cache.get(CACHE_KEY)
    }

    let dados 
    if (state.isDev) {
        dados = await retornaComAtraso(data)
    } else {
        dados = await asyncFetch(`https://${COMMUNICATION_SERVICE}/social-feed?username=${username}`, 'GET')
    }

    state.cache.set(CACHE_KEY, dados)
    return dados
}
