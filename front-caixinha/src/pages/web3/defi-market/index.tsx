import TradeHistory from "@/components/defi/trade-history";
import TradeMapping from "@/components/defi/charts/trade-mapping";
import { Seo } from "@/components/Seo";
import { Box } from "@mui/material";
import Web3Layout from "@/components/Web3-Layoyt";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { rpc_getCaixinhas } from "@/program/get-caixinhas";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import TempDeposit from "@/components/defi/temp-deposit";

const Page = () => {
    const wallet = useAnchorWallet();
    const [caixinhas, setCaixinhas] = useState<any[]>([]);

    useEffect(() => {
        if (wallet) {
            rpc_getCaixinhas(wallet as NodeWallet).then((res) => {
                if (res.error) {
                    console.error('Failed to fetch caixinhas', res.sig)
                    return
                }

                console.log('Caixinhas', res.sig)
                setCaixinhas(res.sig)
            });
        }
    }, [wallet]);

    return (
        <>
            <Seo title="DeFi Market" />
            <Box component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}>
                <Box>
                    <h1>DeFi Market</h1>
                    <TempDeposit wallet={wallet as NodeWallet} data={caixinhas} />
                    <TradeMapping />
                    <TradeHistory />
                </Box>
            </Box>
        </>
    )
}

export default function DefiMarket() {
    return (
        <Web3Layout>
            <Page />
        </Web3Layout>
    )
};