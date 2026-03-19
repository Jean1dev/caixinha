import { useState } from 'react'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import MuiLink from '@mui/material/Link'
import { AddCircleOutline } from '@mui/icons-material'
import NextLink from 'next/link'
import Layout from '@/components/Layout'
import { Seo } from '@/components/Seo'
import { useCarteiras } from '@/features/carteira/hooks/useCarteiras'
import { useAtivos } from '@/features/carteira/hooks/useAtivos'
import { AtivosTable } from '@/features/carteira/components/ativos/AtivosTable'
import { AtivosFilters } from '@/features/carteira/components/ativos/AtivosFilters'
import { AtivoFormDrawer } from '@/features/carteira/components/ativos/AtivoFormDrawer'
import { CarteiraEmptyState } from '@/features/carteira/components/shared/CarteiraEmptyState'

export default function MeusAtivos() {
  const { carteiras, isLoading: loadingCarteiras } = useCarteiras()
  const {
    ativos,
    page,
    totalElements,
    pageSize,
    isLoading,
    applyFilter,
    changePage,
    changePageSize,
    criar,
    atualizar,
    remover,
  } = useAtivos(carteiras.length > 0 ? [carteiras[0].id] : [])

  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleSave = async (payload: any) => {
    await criar(payload)
  }

  if (!loadingCarteiras && carteiras.length === 0) {
    return (
      <Layout>
        <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
          <Container maxWidth="xl">
            <CarteiraEmptyState />
          </Container>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <Seo title="Meus Ativos" />
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
              <Stack spacing={0.5}>
                <Typography variant="h5" fontWeight={700}>
                  Meus Ativos
                </Typography>
                <Breadcrumbs separator="›" sx={{ fontSize: '0.8rem' }}>
                  <MuiLink component={NextLink} href="/" color="text.secondary" underline="hover">
                    Dashboard
                  </MuiLink>
                  <MuiLink component={NextLink} href="/carteira" color="text.secondary" underline="hover">
                    Carteira
                  </MuiLink>
                  <Typography variant="body2" color="text.primary">
                    Meus Ativos
                  </Typography>
                </Breadcrumbs>
              </Stack>

              <Button
                variant="contained"
                size="small"
                startIcon={<SvgIcon fontSize="small"><AddCircleOutline /></SvgIcon>}
                onClick={() => setDrawerOpen(true)}
                disabled={carteiras.length === 0}
              >
                Adicionar ativo
              </Button>
            </Stack>

            {/* Table + Filters */}
            <Card>
              <AtivosFilters
                carteiras={carteiras}
                onFiltersChange={applyFilter}
              />
              <Divider />
              <AtivosTable
                ativos={ativos}
                page={page}
                totalElements={totalElements}
                pageSize={pageSize}
                isLoading={isLoading}
                onPageChange={changePage}
                onPageSizeChange={changePageSize}
                onUpdate={atualizar}
                onDelete={remover}
              />
            </Card>
          </Stack>
        </Container>
      </Box>

      {/* Drawer de add/edit */}
      <AtivoFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        carteiras={carteiras}
        onSave={handleSave}
      />
    </Layout>
  )
}
