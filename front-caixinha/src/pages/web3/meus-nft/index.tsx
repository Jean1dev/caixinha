import { RouterLink } from "@/components/RouterLink";
import { Seo } from "@/components/Seo";
import Web3Layout from "@/components/Web3-Layoyt"
import { rpc_get_meusNFT } from "@/program/get-nft";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Container, Stack, Typography, Breadcrumbs, Box, Link } from "@mui/material";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";

const Page = () => {
    const wallet = useAnchorWallet();
    const [nfts, setNfts] = useState<any[]>([]);

    useEffect(() => {
        if (wallet) {
            rpc_get_meusNFT(wallet as NodeWallet, wallet.publicKey.toString()).then((res) => {
                if (res.error) {
                    console.error('Failed to fetch nfts', res.sig)
                    return
                }
                setNfts(res.sig)
            });
        }
    }, [wallet]);


    return (
        <>
            <Seo title="Meus NFT" />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={4}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    Detalhes do NFt
                                </Typography>
                                <Breadcrumbs separator={<Box
                                    sx={{
                                        backgroundColor: 'neutral.500',
                                        borderRadius: '50%',
                                        height: 4,
                                        width: 4
                                    }}
                                />}>
                                    <Link
                                        color="text.primary"
                                        component={RouterLink}
                                        href={'/web3/defi-market'}
                                        variant="subtitle2"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        color="text.primary"
                                        component={RouterLink}
                                        href={'/web3/nft-market'}
                                        variant="subtitle2"
                                    >
                                        Listagem nfts
                                    </Link>
                                    <Typography
                                        color="text.secondary"
                                        variant="subtitle2"
                                    >
                                        Meus NFT
                                    </Typography>
                                </Breadcrumbs>
                            </Stack>
                        </Stack>
                    </Stack>
                </Container>
                <div>
                    {nfts.map((nft, index) => (
                        <img key={index} src={nft.img} alt={`NFT ${index}`} />
                    ))}
                </div>
            </Box>
        </>
    )
}

export default function MeusNFt() {
    return (
        <Web3Layout>
            <Page />
        </Web3Layout>
    )
};