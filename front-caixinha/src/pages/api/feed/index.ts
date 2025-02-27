import { COMMUNICATION_SERVICE } from "@/constants/ApiConts"
import state, { asyncGetWithParamethers, retornaComAtraso } from "../api.service"
import data from "./data"

export async function getMeuFeed(username: string, page = 0) {
    return state.isDev 
        ? retornaComAtraso(data)
        : asyncGetWithParamethers(`https://${COMMUNICATION_SERVICE}/social-feed`, {
            username, 
            page
        })
}
