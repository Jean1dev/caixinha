import { Seo } from "@/components/Seo";
import Web3Layout from "@/components/Web3-Layoyt";
import CardNFt from "@/components/web3/card-nft";
import { rpc_getNFts } from "@/program/get-nft";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import {
    Box,
    Container,
    Unstable_Grid2 as Grid,
    Pagination,
    Stack,
    Typography
} from "@mui/material";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

const Page = () => {
    const wallet = useAnchorWallet();
    const [nfts, setNfts] = useState<any[]>([]);

    useEffect(() => {
        if (wallet) {
            rpc_getNFts(wallet as NodeWallet).then((res) => {
                if (res.error) {
                    console.error('Failed to fetch nfts', res.sig)
                    return
                }

                console.log('nfts', res.sig)
                setNfts(res.sig)
            });
        }
    }, [wallet]);

    return (
        <>
            <Seo title="NFT Market" />
            <Box component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}>

                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    NFT Disponiveis
                                </Typography>

                            </Stack>

                        </Stack>
                        <Grid
                            container
                            spacing={{
                                xs: 3,
                                lg: 4
                            }}
                        >
                            {nfts.map((nft: any, index: any) => (
                                <Grid
                                    key={index}
                                    xs={12}
                                    md={4}
                                >
                                    <CardNFt nft={nft} />
                                </Grid>

                            ))}
                        </Grid>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <Pagination
                                count={1}
                                size="small"
                            />
                        </Box>
                    </Stack>
                </Container>
            </Box>
        </>
    )
}

export default function NftMarket() {
    return (
        <Web3Layout>
            <Page />
        </Web3Layout>
    )
};