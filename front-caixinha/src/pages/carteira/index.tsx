import { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import SvgIcon from '@mui/material/SvgIcon'
import { AddCircleOutline, AccountBalanceWallet } from '@mui/icons-material'
import NextLink from 'next/link'
import Layout from '@/components/Layout'
import { Seo } from '@/components/Seo'
import { useSettings } from '@/hooks/useSettings'
import { useCarteiras } from '@/features/carteira/hooks/useCarteiras'
import { CarteiraSelector } from '@/features/carteira/components/dashboard/CarteiraSelector'
import { DistribuicaoChart } from '@/features/carteira/components/dashboard/DistribuicaoChart'
import { QuotesTicker } from '@/features/carteira/components/dashboard/QuotesTicker'
import { AporteDrawer } from '@/features/carteira/components/aporte/AporteDrawer'
import { CarteiraEmptyState } from '@/features/carteira/components/shared/CarteiraEmptyState'
import { DashboardSkeleton } from '@/features/carteira/components/shared/Skeletons'
import { ResumoMercado } from '@/components/carteira/resumo-mercado'

export default function Carteira() {
  const settings = useSettings()
  const { carteiras, isLoading, consolidarTodas } = useCarteiras()
  const [selectedCarteiraId, setSelectedCarteiraId] = useState<string | null>(null)
  const [aporteOpen, setAporteOpen] = useState(false)

  const selectedId = selectedCarteiraId ?? carteiras[0]?.id ?? null

  return (
    <Layout>
      <Seo title="Carteira de Investimentos" />

      {/* Ticker de cotações */}
      <QuotesTicker />

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth={settings.stretch ? false : 'xl'}>

          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
            flexWrap="wrap"
            gap={2}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <SvgIcon color="primary" sx={{ fontSize: 32 }}>
                <AccountBalanceWallet />
              </SvgIcon>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Carteira de Investimentos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Acompanhe e gerencie seus ativos
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} flexWrap="wrap" gap={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setAporteOpen(true)}
                disabled={carteiras.length === 0}
              >
                Novo Aporte
              </Button>
              <Button
                component={NextLink}
                href="/carteira/meus-ativos"
                variant="outlined"
                size="small"
              >
                Meus Ativos
              </Button>
              <Button
                component={NextLink}
                href="/carteira/nova-carteira"
                variant="contained"
                size="small"
                startIcon={<SvgIcon fontSize="small"><AddCircleOutline /></SvgIcon>}
              >
                Nova Carteira
              </Button>
            </Stack>
          </Stack>

          {/* Body */}
          {isLoading ? (
            <DashboardSkeleton />
          ) : carteiras.length === 0 ? (
            <CarteiraEmptyState />
          ) : (
            <Grid container spacing={3}>
              {/* Seletor de carteiras */}
              <Grid xs={12} md={3}>
                <CarteiraSelector
                  carteiras={carteiras}
                  selectedId={selectedId}
                  onSelect={setSelectedCarteiraId}
                  onConsolidar={consolidarTodas}
                />
              </Grid>

              {/* Gráfico de distribuição */}
              <Grid xs={12} md={5}>
                <DistribuicaoChart carteiraId={selectedId} />
              </Grid>

              {/* Resumo do mercado */}
              <Grid xs={12} md={4}>
                <ResumoMercado />
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>

      {/* Drawer de aporte */}
      {carteiras.length > 0 && (
        <AporteDrawer
          open={aporteOpen}
          onClose={() => setAporteOpen(false)}
          carteiras={carteiras}
          defaultCarteiraId={selectedId ?? undefined}
        />
      )}
    </Layout>
  )
}
