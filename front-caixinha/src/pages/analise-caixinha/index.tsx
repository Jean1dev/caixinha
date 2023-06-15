//@ts-nocheck
import { Box, Button, Card, CardContent, Container, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import { SaldoTotal } from '../../components/analise-caixinha/saldo-total';
import { TotalDepositos } from '../../components/analise-caixinha/total-depositos';
import { GraficoPizzaMembros } from '../../components/analise-caixinha/grafico-pizza-membros';
import { UltimasMovimentacoes } from '@/components/analise-caixinha/ultimas-movimentacoes';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CenteredCircularProgress from '@/components/CenteredCircularProgress';
import { getDadosAnaliseCaixinha } from '../api/api.service';
import { EvolucaoPatrimonial } from '@/components/analise-caixinha/evolucao-patrimonial';
import { Participantes } from '@/components/analise-caixinha/participantes';

export default function AnaliseCaixinha() {
    const router = useRouter()
    const [state, setState] = useState({
        data: null,
        loading: true
    })

    useEffect(() => {
        const { unique } = router.query
        if (!unique)
            return

        getDadosAnaliseCaixinha(unique as string).then(response => {
            setState({
                loading: false,
                data: response
            })
        }).catch(() => {
            router.push('error')
        })

    }, [router])

    const join = () => {
        router.push({
            pathname: '/join',
            query: { id: router.query.unique },
        })
    }

    const extrato = () => {
        router.push({
            pathname: '/extrato',
            query: { id: router.query.unique },
        })
    }

    if (state.loading) {
        return <CenteredCircularProgress />
    }

    return (
        <Layout>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Grid
                        container
                        spacing={2}
                    >
                        <Grid
                            xs={12}
                            sm={6}
                            lg={3}
                        >
                            <SaldoTotal
                                difference={102}
                                positive
                                sx={{ height: '100%' }}
                                value={state.data.saldoTotal}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            sm={6}
                            lg={3}
                        >
                            <TotalDepositos
                                difference={16}
                                positive={false}
                                sx={{ height: '100%' }}
                                value={state.data.totalDepositos}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            sm={6}
                            lg={3}
                        >
                            {/* <OverviewTasksProgress
                                sx={{ height: '100%' }}
                                value={75.5}
                            /> */}
                        </Grid>
                        <Grid
                            xs={12}
                            sm={6}
                            lg={3}
                        >
                            {/* <OverviewTotalProfit
                                sx={{ height: '100%' }}
                                value="$15k"
                            /> */}
                        </Grid>
                        <Grid
                            xs={12}
                            lg={8}
                        >
                            <EvolucaoPatrimonial
                                chartSeries={state.data?.evolucaoPatrimonial}
                                sx={{ height: '100%' }}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            md={6}
                            lg={4}
                        >
                            <GraficoPizzaMembros
                                chartSeries={state.data.percentuais.series}
                                labels={state.data.percentuais.labels}
                                sx={{ height: '100%' }}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            md={6}
                            lg={4}
                        >
                            <Participantes
                                participantes={state.data.membros}
                                sx={{ height: '100%' }}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            md={12}
                            lg={8}
                        >
                            <UltimasMovimentacoes
                                extrato={extrato}
                                orders={state.data.movimentacoes}
                                sx={{ height: '100%', width: '100%' }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <Card>
                <CardContent>

                    <Box mb={2}>
                        <Typography variant="h6">Gostou? que tal participar dessa caixinha</Typography>
                    </Box>

                    <Box display="flex" sx={{ my: 2 }} gap={2}>
                        <Button
                            onClick={() => router.back()}
                            color="secondary"
                            variant="contained"
                        >
                            Voltar
                        </Button>
                        <Button
                            onClick={join}
                            color="primary"
                            variant="contained"
                        >
                            Participar
                        </Button>
                    </Box>
                </CardContent>
            </Card>

        </Layout>
    )
}
