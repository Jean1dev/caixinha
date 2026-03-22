import Layout from '@/components/Layout'
import { Seo } from '@/components/Seo'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ListAltSharp from '@mui/icons-material/ListAltSharp'
import ShowChartOutlined from '@mui/icons-material/ShowChartOutlined'
import CenteredCircularProgress from '@/components/CenteredCircularProgress'
import { useMinhasCaixinhas } from '@/features/caixinha/hooks/useMinhasCaixinhas'
import { useAnaliseCaixinha } from '@/features/caixinha/hooks/useAnaliseCaixinha'
import { useCaixinhaContext } from '@/features/caixinha/context/CaixinhaContext'
import { useUserAuth } from '@/hooks/useUserAuth'
import { CardTotal } from '@/components/analise-caixinha/card-total'
import { UltimasMovimentacoes } from '@/components/analise-caixinha/ultimas-movimentacoes'
import { SavingsRounded, VerifiedUserSharp, AccountBalance } from '@mui/icons-material'

function saldoFromCaixinha(c: { currentBalance?: unknown }) {
  const b = c.currentBalance
  if (b != null && typeof b === 'object' && 'value' in b) {
    return String((b as { value: number }).value)
  }
  if (typeof b === 'number') return String(b)
  return '—'
}

export default function CaixinhaHubPage() {
  const router = useRouter()
  const { status: sessionStatus } = useSession()
  const { user } = useUserAuth()
  const { setCaixinha, caixinha: selected } = useCaixinhaContext()
  const { caixinhas, isLoading: loadingMinhas } = useMinhasCaixinhas()

  const id = router.isReady && typeof router.query.id === 'string' ? router.query.id : null

  const mine = useMemo(
    () => (id ? caixinhas.find((c) => c.id === id) : undefined),
    [caixinhas, id]
  )

  const { dados, isLoading: loadingAnalise, error } = useAnaliseCaixinha(mine && id ? id : null)

  useEffect(() => {
    if (mine && selected?.id !== mine.id) {
      setCaixinha(mine)
    }
  }, [mine, selected?.id, setCaixinha])

  useEffect(() => {
    if (error) {
      router.push('/error')
    }
  }, [error, router])

  if (!router.isReady || sessionStatus === 'loading') {
    return (
      <Layout>
        <CenteredCircularProgress />
      </Layout>
    )
  }

  if (sessionStatus === 'unauthenticated') {
    return (
      <Layout>
        <Seo title="Caixinha" />
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" component="p" gutterBottom>
            Faça login na plataforma para acessar esta caixinha.
          </Typography>
          <Button
            sx={{ mt: 2, mr: 1 }}
            variant="contained"
            onClick={() => void signIn(undefined, { callbackUrl: router.asPath })}
          >
            Entrar
          </Button>
          <Button sx={{ mt: 2 }} component={Link} href="/" variant="outlined">
            Início
          </Button>
        </Box>
      </Layout>
    )
  }

  if (!id) {
    return (
      <Layout>
        <Seo title="Caixinha" />
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography>Caixinha inválida.</Typography>
          <Button sx={{ mt: 2 }} component={Link} href="/" variant="contained">
            Início
          </Button>
        </Box>
      </Layout>
    )
  }

  if (!(user?.name && user?.email) || loadingMinhas) {
    return (
      <Layout>
        <CenteredCircularProgress />
      </Layout>
    )
  }

  if (!mine) {
    return (
      <Layout>
        <Seo title="Caixinha" />
        <Container maxWidth="sm" sx={{ py: 8 }}>
          <Card>
            <CardContent>
              <Stack spacing={2} alignItems="center" textAlign="center">
                <Typography variant="h6">Você não participa desta caixinha</Typography>
                <Typography color="text.secondary" variant="body2">
                  Escolha uma caixinha disponível ou peça um convite.
                </Typography>
                <Button component={Link} href="/caixinhas-disponiveis" variant="contained">
                  Ver caixinhas
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Layout>
    )
  }

  if (loadingAnalise || !dados) {
    return (
      <Layout>
        <Seo title={mine.name ?? 'Caixinha'} />
        <CenteredCircularProgress />
      </Layout>
    )
  }

  const d = dados as Record<string, any>
  const movimentacoes = Array.isArray(d.movimentacoes) ? d.movimentacoes : []
  const nome = mine.name ?? 'Caixinha'

  return (
    <Layout>
      <Seo title={nome} />
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 3, md: 6 } }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Button
              component={Link}
              href="/"
              startIcon={<ArrowBackIos fontSize="small" />}
              color="inherit"
              sx={{ alignSelf: 'flex-start' }}
            >
              Início
            </Button>
            <Stack spacing={1}>
              <Typography variant="h4" fontWeight={700}>
                {nome}
              </Typography>
              <Typography color="text.secondary" variant="body1">
                Saldo na caixinha (cadastro): {saldoFromCaixinha(mine)}
              </Typography>
            </Stack>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              <Button
                variant="contained"
                startIcon={<AccountBalanceWalletIcon />}
                component={Link}
                href="/deposito"
              >
                Depositar
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                component={Link}
                href="/emprestimo"
              >
                Pedir empréstimo
              </Button>
              <Button
                variant="outlined"
                startIcon={<ListAltSharp />}
                component={Link}
                href={{ pathname: '/extrato', query: { id } }}
              >
                Extrato
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShowChartOutlined />}
                component={Link}
                href={{ pathname: '/analise-caixinha', query: { unique: id } }}
              >
                Análise completa
              </Button>
            </Stack>
            <Grid container spacing={2}>
              <Grid xs={12} sm={6} md={3}>
                <CardTotal
                  difference={d.info?.cdbTaxes != null ? String(d.info.cdbTaxes) : undefined}
                  positive
                  sx={{ height: '100%' }}
                  value={
                    d.totalDisponivel != null
                      ? String(d.totalDisponivel)
                      : d.saldoTotal != null
                        ? String(d.saldoTotal)
                        : '—'
                  }
                  displayText="Saldo disponível"
                  displayText2="CDI"
                  icon={<SavingsRounded />}
                />
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <CardTotal
                  difference={
                    d.info?.evolucaoDepositos != null ? String(d.info.evolucaoDepositos) : undefined
                  }
                  positive={d.info?.evolucaoJuros > 0}
                  sx={{ height: '100%' }}
                  value={d.totalDepositos != null ? String(d.totalDepositos) : '—'}
                  displayText="Total depósitos"
                  displayText2="vs. mês anterior"
                  icon={<VerifiedUserSharp />}
                />
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <CardTotal
                  difference={
                    d.info?.evolucaoEmprestimos != null ? String(d.info.evolucaoEmprestimos) : undefined
                  }
                  positive={d.info?.evolucaoEmprestimos > 0}
                  sx={{ height: '100%' }}
                  value={d.totalEmprestimos != null ? String(d.totalEmprestimos) : '—'}
                  displayText="Total emprestado"
                  icon={<AccountBalance />}
                />
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <CardTotal
                  difference={d.info?.evolucaoJuros != null ? String(d.info.evolucaoJuros) : undefined}
                  positive={d.info?.evolucaoJuros > 0}
                  sx={{ height: '100%' }}
                  value={d.totalJuros != null ? String(d.totalJuros) : '—'}
                  displayText="Juros"
                  icon={<SavingsRounded />}
                />
              </Grid>
            </Grid>
            <UltimasMovimentacoes
              orders={movimentacoes.slice(0, 8)}
              extrato={() => router.push({ pathname: '/extrato', query: { id } })}
              sx={{ width: '100%' }}
            />
          </Stack>
        </Container>
      </Box>
    </Layout>
  )
}
