import Layout from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { useSettings } from "@/hooks/useSettings";
import { Box, Container, Stack, Typography, Button, SvgIcon } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Grid from '@mui/material/Unstable_Grid2';
import { PlusOne } from "@mui/icons-material";
import { CotacaoCard } from "@/components/carteira/cotacao-card";
import { CarteiraBalanco } from "@/components/carteira/carteira-balanco";
import { CriarCarteiraNova } from "@/components/carteira/criar-nova-carteira";
import NextLink from 'next/link';
import { useEffect, useState } from "react";
import { getMinhasCarteiras } from "../api/api.carteira";
import { useSession } from "next-auth/react";
import { MinhasCarteirasList } from "@/components/carteira/minhas-carteiras-list";

export default function Carteira() {
    const settings = useSettings();
    const theme = useTheme();
    const [carteiras, setCarteiras] = useState(null)
    const data = useSession()

    useEffect(() => {
        getMinhasCarteiras(data.data?.user?.name || '', data.data?.user?.email || '')
            .then(res => setCarteiras(res))
    }, [data])

    return (
        <Layout>
            <Seo title="Carteira dashboard" />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth={settings.stretch ? false : 'xl'}>
                    <Grid
                        container
                        disableEqualOverflow
                        spacing={{
                            xs: 3,
                            lg: 4
                        }}
                    >
                        <Grid xs={12}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                spacing={4}
                            >
                                <div>
                                    <Typography variant="h4">
                                        Overview
                                    </Typography>
                                </div>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={2}
                                >
                                    <Button
                                        LinkComponent={NextLink}
                                        href="/carteira/nova-carteira"
                                        startIcon={(
                                            <SvgIcon>
                                                <PlusOne />
                                            </SvgIcon>
                                        )}
                                        variant="contained"
                                    >
                                        Adicionar Carteira
                                    </Button>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid
                            xs={12}
                            md={7}
                        >
                            <Stack
                                direction="row"
                                spacing={3}
                            >
                                <CotacaoCard
                                    chartColor={theme.palette.primary.main}
                                    chartSeries={[
                                        {
                                            name: 'BTC',
                                            data: [
                                                56, 61, 64, 60, 63, 61, 60, 68, 66, 64, 77, 60, 65, 51, 72, 80,
                                                74, 67, 77, 83, 94, 95, 89, 100, 94, 104, 101, 105, 104, 103, 107, 120
                                            ]
                                        }
                                    ]}
                                    coinAmount={0.7568}
                                    currency="BTC"
                                    rate={0.56}
                                    sx={{ flexBasis: '50%' }}
                                    usdValue={16213.20}
                                />
                                <CotacaoCard
                                    chartColor={theme.palette.info.main}
                                    chartSeries={[
                                        {
                                            name: 'ETH',
                                            data: [
                                                65, 64, 32, 45, 54, 76, 82, 80, 85, 78, 82, 95, 93, 80, 112, 102,
                                                105, 95, 98, 102, 104, 99, 101, 100, 109, 106, 111, 105, 108, 112, 108, 111
                                            ]
                                        }
                                    ]}
                                    coinAmount={2.0435}
                                    currency="ETH"
                                    rate={-0.32}
                                    sx={{ flexBasis: '50%' }}
                                    usdValue={9626.80}
                                />
                                <CotacaoCard
                                    chartColor={theme.palette.info.main}
                                    chartSeries={[
                                        {
                                            name: 'BNB',
                                            data: [
                                                65, 64, 32, 45, 54, 76, 82, 80, 85, 78, 82, 95, 93, 80, 112, 102,
                                                105, 95, 98, 102, 104, 99, 101, 100, 109, 106, 111, 105, 108, 112, 108, 111
                                            ]
                                        }
                                    ]}
                                    coinAmount={2.0435}
                                    currency="BNB"
                                    rate={-0.32}
                                    sx={{ flexBasis: '50%' }}
                                    usdValue={9626.80}
                                />
                            </Stack>
                        </Grid>
                        <Grid
                            xs={12}
                            md={5}
                        >
                            {!carteiras && <CriarCarteiraNova />}
                            {/* <CryptoCards
                                cards={[
                                    {
                                        id: '79f8212e4245e4c11952f2cf',
                                        brand: 'Mastercard',
                                        cardNumber: '5823 4492 2385 1102',
                                        expiryDate: '05/28',
                                        holderName: 'John Carter'
                                    },
                                    {
                                        id: '99f231b1c079b810ba66bef1',
                                        brand: 'VISA',
                                        cardNumber: '3455 4562 7710 3507',
                                        expiryDate: '02/30',
                                        holderName: 'John Carter'
                                    }
                                ]}
                            /> */}
                        </Grid>
                        <Grid
                            xs={12}
                            md={8}
                        >
                            <Stack
                                spacing={{
                                    xs: 3,
                                    lg: 4
                                }}
                            >
                                <CarteiraBalanco
                                    chartSeries={[16213.20, 9626.80, 10076.81]}
                                    labels={['Bitcoin', 'Ethereum', 'US Dollars']}
                                />
                                <MinhasCarteirasList carteiras={carteiras || []} />
                            </Stack>
                        </Grid>
                        <Grid
                            xs={12}
                            md={4}
                        >
                            <Stack
                                spacing={{
                                    xs: 3,
                                    lg: 4
                                }}
                            >
                                {/* <CryptoOperation />
                                <CryptoUpgrade /> */}
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    )
}