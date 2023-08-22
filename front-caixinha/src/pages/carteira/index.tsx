import Layout from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { useSettings } from "@/hooks/useSettings";
import { Box, Container, Stack, Typography, Button, SvgIcon } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { LowPriority, PlusOne } from "@mui/icons-material";
import { CarteiraBalanco } from "@/components/carteira/carteira-balanco";
import { CriarCarteiraNova } from "@/components/carteira/criar-nova-carteira";
import NextLink from 'next/link';
import { useCallback, useEffect, useState } from "react";
import { consolidar, getMinhasCarteiras } from "../api/api.carteira";
import { useSession } from "next-auth/react";
import { MinhasCarteirasList } from "@/components/carteira/minhas-carteiras-list";
import { ResumoMercado } from "@/components/carteira/resumo-mercado";
import toast from "react-hot-toast";

export default function Carteira() {
    const settings = useSettings();
    const [carteiras, setCarteiras] = useState(null)
    const data = useSession()

    useEffect(() => {
        getMinhasCarteiras(data.data?.user?.name || '', data.data?.user?.email || '')
            .then(res => setCarteiras(res))
    }, [data])

    const consolidarCarteiras = useCallback(() => {
        getMinhasCarteiras(data.data?.user?.name || '', data.data?.user?.email || '')
            .then(carteiras => {
                carteiras.forEach((carteira: any) => {
                    toast.loading(`consolidando carteira ${carteira.nome}`)
                    consolidar(carteira.id)
                        .then(() => toast.success(`processo iniciado para ${carteira.nome}`))
                        .catch(() => toast.error(`nao foi possivel consolidar ${carteira.nome}`))
                })
            })
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
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        py: 4
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
                                            onClick={consolidarCarteiras}
                                            startIcon={(
                                                <SvgIcon>
                                                    <LowPriority />
                                                </SvgIcon>
                                            )}
                                            variant="contained"
                                        >
                                            Consolidar carteiras
                                        </Button>
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
                        </Grid>
                    </Container>
                </Box>
                <ResumoMercado />
                {/* <TradingView/> */}

                <Container maxWidth={settings.stretch ? false : 'xl'}>

                    <Grid
                        xs={12}
                        md={7}
                    >
                        {/* <ResumoMercado /> */}

                        {/* <Stack
                                direction="row"
                                spacing={12}
                            >
                                
                                
                                
                            </Stack> */}
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
                            <CarteiraBalanco carteiras={carteiras || []} />
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
                </Container>
            </Box>
        </Layout>
    )
}