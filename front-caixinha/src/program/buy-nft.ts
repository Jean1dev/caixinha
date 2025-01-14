import { anchorProgram } from '@/anchor/anchor-provider'
import * as anchor from '@coral-xyz/anchor'

export const rpc_BuyNft = async (
    wallet: anchor.Wallet,
    amount: number,
    achiviement: string
) => {
    const program = anchorProgram(wallet)

    try {
        const txHash = await program.methods.buyNft(amount)
            .accounts({
                achiviement,
            })
            .rpc()

        return { error: false, sig: txHash }
    } catch (error) {
        console.error('Failed to buy nft', error)
        return { error: true, sig: error }
    }
}