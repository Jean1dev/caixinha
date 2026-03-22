import { Box, Button, Card, CardContent, Container, Unstable_Grid2 as Grid, Typography } from '@mui/material';
import Link from 'next/link';
import { CardTotal } from '../../components/analise-caixinha/card-total';
import { GraficoPizzaMembros } from '../../components/analise-caixinha/grafico-pizza-membros';
import { UltimasMovimentacoes } from '@/components/analise-caixinha/ultimas-movimentacoes';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CenteredCircularProgress from '@/components/CenteredCircularProgress';
import { EvolucaoPatrimonial } from '@/components/analise-caixinha/evolucao-patrimonial';
import { Participantes } from '@/components/analise-caixinha/participantes';
import { VerifiedUserSharp, SavingsRounded, AccountBalance, AccountBalanceWallet } from '@mui/icons-material';
import { useAnaliseCaixinha } from '@/features/caixinha/hooks/useAnaliseCaixinha';

export default function AnaliseCaixinha() {
    const router = useRouter()
    const unique =
        router.isReady && typeof router.query.unique === 'string' ? router.query.unique : null
    const { dados, isLoading, error } = useAnaliseCaixinha(unique)

    useEffect(() => {
        if (error) {
            router.push('/error')
        }
    }, [error, router])

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

    const hubId = typeof router.query.unique === 'string' ? router.query.unique : null

    if (!router.isReady || isLoading || !dados) {
        return <CenteredCircularProgress />
    }

    const state = { data: dados as Record<string, any> }

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
                                difference={state.data?.info.cdbTaxes.toFixed(2)}
                                positive
                                sx={{ height: '100%' }}
                                value={state.data?.totalDisponivel?.toFixed(2)}
                                displayText="Saldo Disponivel Agora"
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
                                difference={state.data?.info.evolucaoDepositos.toFixed(2)}
                                positive={state.data?.info.evolucaoJuros > 0}
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
                                difference={state.data?.info.evolucaoEmprestimos.toFixed(2)}
                                positive={state.data?.info.evolucaoEmprestimos > 0}
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
                                difference={state.data?.info.evolucaoJuros.toFixed(2)}
                                positive={state.data?.info.evolucaoJuros > 0}
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

                    <Box display="flex" sx={{ my: 2 }} gap={2} flexWrap="wrap">
                        <Button
                            onClick={() => router.back()}
                            color="secondary"
                            variant="contained"
                        >
                            Voltar
                        </Button>
                        {hubId ? (
                            <Button
                                component={Link}
                                href={`/caixinha/${hubId}`}
                                variant="outlined"
                            >
                                Painel da caixinha
                            </Button>
                        ) : null}
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
