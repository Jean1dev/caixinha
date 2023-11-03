import { Box, Button, Card, CardContent, Container, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import { CardTotal } from '../../components/analise-caixinha/card-total';
import { GraficoPizzaMembros } from '../../components/analise-caixinha/grafico-pizza-membros';
import { UltimasMovimentacoes } from '@/components/analise-caixinha/ultimas-movimentacoes';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CenteredCircularProgress from '@/components/CenteredCircularProgress';
import { EvolucaoPatrimonial } from '@/components/analise-caixinha/evolucao-patrimonial';
import { Participantes } from '@/components/analise-caixinha/participantes';
import { getDadosAnaliseCaixinha } from '../api/analise-caixinha';
import { VerifiedUserSharp, SavingsRounded, AccountBalance, AccountBalanceWallet } from '@mui/icons-material';

export default function AnaliseCaixinha() {
    const router = useRouter()
    const [state, setState] = useState<any>({
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
                            <CardTotal
                                difference={113}
                                positive
                                sx={{ height: '100%' }}
                                value={state.data?.saldoTotal.toFixed(2)}
                                displayText="Saldo total"
                                displayText2="CDI"
                                icon={(<SavingsRounded />)}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            sm={6}
                            lg={3}
                        >
                            <CardTotal
                                difference={90}
                                positive={false}
                                sx={{ height: '100%' }}
                                value={state.data?.totalDepositos.toFixed(2)}
                                displayText="Total depositos"
                                displayText2="comparação ao mes passado"
                                icon={(<VerifiedUserSharp />)}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            sm={6}
                            lg={3}
                        >
                            <CardTotal
                                difference={40}
                                positive={true}
                                sx={{ height: '100%' }}
                                value={state.data?.totalEmprestimos.toFixed(2)}
                                displayText="Valor total ja emprestado"
                                icon={(<AccountBalance />)}
                            />
                        </Grid>
                        <Grid
                            xs={12}
                            sm={6}
                            lg={3}
                        >
                            <CardTotal
                                difference={1.15}
                                positive={true}
                                sx={{ height: '100%' }}
                                value={state.data?.totalJuros.toFixed(2)}
                                displayText="Total de juros recebido"
                                displayText2="Juros de emprestimos + rendimento sob capital"
                                icon={(<AccountBalanceWallet />)}
                            />
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
