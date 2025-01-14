import { anchorProgram } from '@/anchor/anchor-provider'
import * as anchor from '@coral-xyz/anchor'

const isValidUrl = (urlString: string): boolean => {
    try {
        new URL(urlString)
        return true
    } catch (error) {
        return false
    }
}

const getRandomItem = () => {
    const data = [
        'https://superex-shreethemes.vercel.app/static/media/5.ad387a486cd876f237a3.gif',
        'https://superex-shreethemes.vercel.app/static/media/6.43acc78f9a5c1e7cdd41.gif',
        'https://superex-shreethemes.vercel.app/static/media/7.b068fd372d1ec31728d4.gif'
    ]
    const randomIndex = Math.floor(Math.random() * data.length)
    return data[randomIndex]
}

export const rpc_get_meusNFT = async (wallet: anchor.Wallet, pubKey: string) => {
    const program = anchorProgram(wallet)

    try {
        const items = await program.account.myAchievement.all()
        const remapped = items
            .filter((item) => item.account.owner == pubKey)
            .map((item) => ({
                id: item.publicKey.toString(),
                img: isValidUrl(item.account.imgUrl) ? item.account.imgUrl : getRandomItem(),
                price: item.account.price,
                creator: item.account.creator.toString()
            }))

        return { error: false, sig: remapped }
    } catch (error) {
        console.error('Failed to fetch items', error)
        return { error: true, sig: [] }
    }
}

export const rpc_getNFts = async (wallet: anchor.Wallet) => {
    const program = anchorProgram(wallet)

    try {
        const items = await program.account.myAchievement.all()
        const remapped = items
            .filter((item) => !item.account.owner)
            .map((item) => ({
                id: item.publicKey.toString(),
                img: isValidUrl(item.account.imgUrl) ? item.account.imgUrl : getRandomItem(),
                price: item.account.price,
                creator: item.account.creator.toString()
            }))

        return { error: false, sig: remapped }
    } catch (error) {
        console.error('Failed to fetch items', error)
        return { error: true, sig: [] }
    }
}

export const rpc_getNftById = async (wallet: anchor.Wallet, id: string) => {
    const program = anchorProgram(wallet)

    try {
        const item = await program.account.myAchievement.fetch(id)
        const remapped = {
            img: isValidUrl(item.imgUrl) ? item.imgUrl : getRandomItem(),
            price: item.price,
            creator: item.creator.toString()
        }

        return { error: false, sig: remapped }
    } catch (error) {
        console.error('Failed to fetch items', error)
        return { error: true, sig: [] }
    }
}