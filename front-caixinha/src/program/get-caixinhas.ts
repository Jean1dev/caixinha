import { anchorProgram } from '@/anchor/anchor-provider'
import * as anchor from '@coral-xyz/anchor'

export const rpc_getCaixinhas = async (wallet: anchor.Wallet) => {
    const program = anchorProgram(wallet)

    try {
        const caixinhas = await program.account.caixinha.all()
        const remapped = caixinhas.map((caixinha) => ({
            refId: caixinha.account.refId,
            amount: caixinha.account.amount,
            depositsCount: caixinha.account.depositsCount,
            description: caixinha.account.desc,
            name: caixinha.account.name,
            owner: caixinha.account.owner.toBase58(),
        }))

        return { error: false, sig: remapped }
    } catch (error) {
        console.error('Failed to fetch caixinhas', error)
        return { error: true, sig: []}
    }
}