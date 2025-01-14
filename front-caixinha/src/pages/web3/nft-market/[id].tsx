import { RouterLink } from "@/components/RouterLink"
import { Seo } from "@/components/Seo"
import Web3Layout from "@/components/Web3-Layoyt"
import { rpc_BuyNft } from "@/program/buy-nft"
import { rpc_getNftById, rpc_getNFts } from "@/program/get-nft"
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet"
import { GavelOutlined, ShoppingCart } from "@mui/icons-material"
import {
    Box,
    Container,
    Stack,
    Typography,
    Breadcrumbs,
    Link,
    Avatar,
    styled,
    Button,
    SvgIcon,
    Card,
    CardContent,
    Divider,
    Grid,
    Rating,
    CardMedia
} from "@mui/material"
import { useAnchorWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/router"
import { useCallback, useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"

const MarkdownWrapper = styled('div')(({ theme }) => ({
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    '& p': {
        margin: 0
    },
    '& p+p': {
        marginTop: theme.spacing(2)
    }
}));

const description = `
  Design files are attached in the files tab.
  
  Develop the web app screens for our product called "PDFace". Please look at the wireframes, system activity workflow and read the section above to understand what we're trying to archive.
  
  There's not many screens we need designed, but there will be modals and various other system triggered events that will need to be considered.
  
  The project has been created in Sketch so let me know if there are any problems opening this project and I'll try to convert into a usable file.
  `;

const Page = () => {
    const router = useRouter()
    const wallet = useAnchorWallet();
    const [nft, setNft] = useState<any>({});
    const [sugestaoNFts, setSugestaoNFts] = useState<any[]>([]);
    const [bid, setBid] = useState(0.0)

    const id = useMemo(() => {
        return router.query.id as string
    }, [router])

    useEffect(() => {
        const fetchNft = async () => {
            if (id && wallet) {
                const res = await rpc_getNftById(wallet as NodeWallet, id);
                setNft(res.sig);

                const sugestaoNFTS = await rpc_getNFts(wallet as NodeWallet)
                const items = []
                for (let i = 0; i < 3; i++) {
                    const item = sugestaoNFTS.sig[i]
                    if (item)
                        items.push(item)
                }

                setSugestaoNFts(items)
            }
        };
        fetchNft();
    }, [id, wallet]);

    const buyNft = useCallback(async () => {
        const result = await rpc_BuyNft(wallet as NodeWallet, bid, id);
        if (result.error && typeof result.sig === 'object' && result.sig !== null && 'error' in result.sig) {
            toast.error((result.sig as { error: { errorMessage: string } }).error.errorMessage);
            return
        }

        toast.success('NFT Adiquirido')
    }, [id, wallet, bid]);

    const placeBid = useCallback(() => {
        const inputBid = parseFloat(prompt('Enter your bid:') || '0');
        if (!isNaN(inputBid)) {
            setBid(inputBid);
            toast(`Sua oferta foi atualizada para ${inputBid.toFixed(4)} $OL`)
        } else {
            toast.error('Invalid bid amount');
        }
    }, [])

    const updatePage = useCallback((id: string) => {
        router.push(`/web3/nft-market/${id}`)
    }, [])

    return (
        <>
            <Seo title="Detalhes do NFt" />
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
                                        Detalhe do Nft
                                    </Typography>
                                </Breadcrumbs>
                            </Stack>
                        </Stack>
                    </Stack>
                </Container>

                <Box
                    component="main"
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            lg: 'repeat(2, 1fr)',
                            xs: 'repeat(1, 1fr)'
                        },
                        flexGrow: 1
                    }}
                >
                    <Box
                        sx={{
                            py: 8
                        }}
                    >
                        <Container
                            maxWidth="md"
                            sx={{ pl: { lg: 35 } }}
                        >
                            <Avatar
                                src={nft.img}
                                variant="square"
                                sx={{
                                    height: 600,
                                    mb: 2,
                                    width: 500
                                }}
                            />
                            <Stack
                                alignItems="center"
                                direction="row"
                                flexWrap="wrap"
                                gap={4}
                                sx={{
                                    color: 'text.primary',
                                    '& > *': {
                                        flex: '0 0 auto'
                                    }
                                }}
                            >
                            </Stack>
                        </Container>
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: 'background.paper',
                            px: 6,
                            py: 15
                        }}
                    >
                        <Container
                            maxWidth="md"
                            sx={{
                                pr: {
                                    lg: 15
                                }
                            }}
                        >
                            <Stack spacing={3}>
                                <Stack spacing={1}>
                                    <Typography
                                        color="text.secondary"
                                        variant="overline"
                                    >
                                        Price SOL {nft.price}
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Sua Oferta SOL {bid}
                                    </Typography>
                                </Stack>
                                <Stack spacing={1}>
                                    <div>
                                        <Button
                                            color="inherit"
                                            variant="outlined"
                                            onClick={placeBid}
                                            startIcon={(
                                                <SvgIcon fontSize="small">
                                                    <GavelOutlined />
                                                </SvgIcon>
                                            )}
                                        >
                                            Place a bid
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={buyNft}
                                            startIcon={(
                                                <SvgIcon fontSize="small">
                                                    <ShoppingCart />
                                                </SvgIcon>
                                            )}
                                        >
                                            Buy Now
                                        </Button>
                                    </div>
                                </Stack>
                                <Stack spacing={1}>
                                    <Typography
                                        color="text.secondary"
                                        variant="overline"
                                    >
                                        Description
                                    </Typography>
                                    <MarkdownWrapper>
                                        <Typography>
                                            {description}
                                        </Typography>
                                    </MarkdownWrapper>
                                </Stack>
                            </Stack>
                        </Container>
                    </Box>

                </Box>

                <Stack
                    spacing={8}
                    sx={{ py: '120px' }}
                >
                    <Stack spacing={2}>
                        <Typography
                            align="center"
                            variant="h3"
                        >
                            Confira outros NFTs.
                        </Typography>
                        <Typography
                            align="center"
                            color="text.secondary"
                            variant="subtitle1"
                        >
                            Our template is so simple that people can’t help but fall in love with it. Simplicity is easy when you just skip tons of mission-critical features.
                        </Typography>
                    </Stack>

                    <Grid
                        container
                        spacing={3}
                    >
                        {sugestaoNFts.map((nfs, index) => (
                            <Grid
                                key={index}
                                xs={12}
                                md={6}
                                lg={4}
                            >
                                <Card
                                    onClick={() => updatePage(nfs.id)}
                                    sx={{ height: '100%' }}>
                                    <CardContent
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            height: '100%'
                                        }}
                                    >
                                        <CardMedia
                                            image={nfs.img}
                                            sx={{
                                                height: '100%',
                                                position: 'absolute',
                                                top: 0,
                                                width: '100%'
                                            }}
                                        />
                                        <Box sx={{ position: 'absolute' }}>
                                            <Avatar src={nfs.img} />
                                        </Box>
                                        <div>
                                            <Rating
                                                readOnly
                                                sx={{ color: 'success.main' }}
                                                value={4}
                                            />
                                        </div>
                                        <Typography
                                            sx={{
                                                flexGrow: 1,
                                                mt: 2
                                            }}
                                        >
                                            {nfs.price}
                                        </Typography>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography color="text.secondary">
                                            {nfs.price}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>

            </Box>
        </>
    )
}

export default function NftDetails() {
    return (
        <Web3Layout>
            <Page />
        </Web3Layout>
    )
};