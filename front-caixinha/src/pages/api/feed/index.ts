import { COMMUNICATION_SERVICE } from "@/constants/ApiConts"
import state, { asyncGetWithParamethers, retornaComAtraso } from "../api.service"
import data from "./data"

const CACHE_KEY = 'feed'

export async function getMeuFeed(username: string, page = 0) {
    if (state.cache.has(CACHE_KEY)) {
        return state.cache.get(CACHE_KEY)
    }

    let dados 
    if (state.isDev) {
        dados = await retornaComAtraso(data)
    } else {
        dados = await asyncGetWithParamethers(`https://${COMMUNICATION_SERVICE}/social-feed`, {
            username, 
            page
        })
    }

    state.cache.set(CACHE_KEY, dados)
    return dados
}
