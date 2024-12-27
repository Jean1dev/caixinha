import * as anchor from '@coral-xyz/anchor'
import { CaixinhaDapp } from './idl'
import idlCaixinha from './idl.json'

export const getProvider = (wallet: anchor.Wallet, rpc_url?: string) => {
    const opts = {
        preflightCommitment: 'processed' as anchor.web3.ConfirmOptions
    }

    const connectionUrl = rpc_url || 'https://api.devnet.solana.com'
    const connection = new anchor.web3.Connection(connectionUrl, opts.preflightCommitment)

    const provider = new anchor.AnchorProvider(
        connection,
        wallet,
        opts.preflightCommitment
    )

    return provider
}

export const anchorProgram = (wallet: anchor.Wallet, network?: string) => {
    const provider = getProvider(wallet, network)
    const idl = idlCaixinha as anchor.Idl 

    const program = new anchor.Program(
        idl, 
        provider,
    ) as unknown as anchor.Program<CaixinhaDapp>

    return program
}