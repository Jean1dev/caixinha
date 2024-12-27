import { anchorProgram } from '@/anchor/anchor-provider'
import * as anchor from '@coral-xyz/anchor'

export const rpc_Deposit = async (
    wallet: anchor.Wallet,
    amount: number
) => {
    const program = anchorProgram(wallet)

    try {
        const txHash = await program.methods.deposit(amount)
            .accounts({
                caixinha: "J6qaYNFohTUhQzmu6ZYBcNbcAGXfhS3SbjtT1f3NEgDz",
            })
            .rpc()

        return { error: false, sig: txHash }
    } catch (error) {
        console.error('Failed to deposit', error)
        return { error: true, sig: null }
    }
}