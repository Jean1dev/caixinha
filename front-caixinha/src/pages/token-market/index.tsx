import WalletIcon from '@mui/icons-material/Wallet';
import Layout from "@/components/Layout";
import { RouterLink } from "@/components/RouterLink";
import { Seo } from "@/components/Seo";
import { useSettings } from "@/hooks/useSettings";
import { 
    Box, 
    Button, 
    Container, 
    Rating, 
    Stack, 
    SvgIcon, 
    Typography 
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { LocalConvenienceStore } from '@mui/icons-material';
import { genereateSolanaKeyPair } from 'web3-client-lib/dist/src/solana/index';
import { useCallback, useState } from 'react';
import useWeb3Wallet from '@/hooks/useWeb3Wallet';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function TokenMarket() {
    const settings = useSettings()
    const [loading, setLoading] = useState(false);
    const { web3Wallet, saveData } = useWeb3Wallet();
    const router = useRouter();

    const createWallet = useCallback(() => {
        if (web3Wallet?.publicKey) {
            toast('Carteira já criada');
            toast.loading('Redirecionando em 2 segundos')
            setTimeout(() => {
                router.push('/defi-market');
            }, 2000);

            return;
        }

        setLoading(true);
        genereateSolanaKeyPair().then((solanaResponse) => {
            if (solanaResponse.error) {
                toast.error(solanaResponse.errorDetails?.message || 'Erro ao criar carteira');
                return
            }

            const { privKey, pubKey } = solanaResponse;
            const walletData = {
                privateKey: privKey,
                publicKey: pubKey
            };
            const blob = new Blob([JSON.stringify(walletData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'wallet.json';
            a.click();
            URL.revokeObjectURL(url);

            alert('Carteira criada. Cuide bem da sua chave privada, pois ela é irrecuperável!');

            saveData(pubKey || '');
            router.push('/defi-market');

        }).finally(() => {
            setLoading(false);
        });
    }, [web3Wallet]); 

    return (
        <Layout>
            <Seo title="Token Market" />
            <Box component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}>
                <Container maxWidth={settings.stretch ? false : 'xl'}>
                    <Grid container
                        spacing={{
                            xs: 3,
                            lg: 4
                        }}>
                        <Grid
                            xs={12}
                            md={7}>

                            <Box maxWidth="sm">
                                <Typography
                                    variant="h1"
                                    sx={{ mb: 2 }}
                                >
                                    Featuring&nbsp;
                                    <Typography
                                        component="span"
                                        color="primary.main"
                                        variant="inherit"
                                    >
                                        DREX Caixinha
                                    </Typography>
                                    , decentralized and secure.
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        fontSize: 20,
                                        fontWeight: 500
                                    }}
                                >
                                    Cryptocurrencies offer a decentralized and secure way to conduct transactions, providing
                                    greater privacy and lower transaction fees compared to traditional financial systems. They
                                    enable fast and borderless transfers, making it easier to engage in global commerce and
                                    investment opportunities.
                                </Typography>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    flexWrap="wrap"
                                    spacing={1}
                                    sx={{ my: 3 }}
                                >
                                    <Rating
                                        readOnly
                                        value={4.7}
                                        precision={0.1}
                                        max={5}
                                    />
                                    <Typography
                                        color="text.primary"
                                        variant="caption"
                                        sx={{ fontWeight: 700 }}
                                    >
                                        4.7/5
                                    </Typography>
                                    <Typography
                                        color="text.secondary"
                                        variant="caption"
                                    >
                                        based on (70+ reviews)
                                    </Typography>
                                </Stack>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={2}
                                >
                                    <Button
                                        onClick={createWallet}
                                        disabled={loading}
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <WalletIcon />
                                            </SvgIcon>
                                        )}
                                        sx={(theme) => theme.palette.mode === 'dark'
                                            ? {
                                                backgroundColor: 'neutral.50',
                                                color: 'neutral.900',
                                                '&:hover': {
                                                    backgroundColor: 'neutral.200'
                                                }
                                            }
                                            : {
                                                backgroundColor: 'neutral.900',
                                                color: 'neutral.50',
                                                '&:hover': {
                                                    backgroundColor: 'neutral.700'
                                                }
                                            }}
                                        variant="contained"
                                    >
                                        {loading ? 'Creating wallet...' : 'Create wallet'}
                                    </Button>
                                    <Button
                                        color="inherit"
                                        component={RouterLink}
                                        href={'https://capicoin-web3.vercel.app'}
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <LocalConvenienceStore />
                                            </SvgIcon>
                                        )}
                                    >
                                        Site institucional
                                    </Button>
                                </Stack>
                            </Box>
                        </Grid>

                        <Grid
                            xs={12}
                            md={5}
                        >
                            <div className="media-icon">
                                <img
                                    alt="Rocket"
                                    src={"assets/crypto/images/capicoin.png"}
                                    width={500}
                                    height={500}
                                />
                            </div>
                        </Grid>

                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
}