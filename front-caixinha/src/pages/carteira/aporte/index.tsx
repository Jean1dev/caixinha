import { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MuiLink from '@mui/material/Link'
import { ArrowBack, AttachMoney } from '@mui/icons-material'
import NextLink from 'next/link'
import Layout from '@/components/Layout'
import { Seo } from '@/components/Seo'
import { useCarteiras } from '@/features/carteira/hooks/useCarteiras'
import { AporteDrawer } from '@/features/carteira/components/aporte/AporteDrawer'

export default function AportePage() {
  const { carteiras } = useCarteiras()
  const [open, setOpen] = useState(true)

  return (
    <Layout>
      <Seo title="Novo Aporte" />
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="sm">
          <Stack spacing={3}>
            <Box>
              <MuiLink
                component={NextLink}
                href="/carteira"
                color="text.secondary"
                underline="hover"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
              >
                <SvgIcon fontSize="small"><ArrowBack /></SvgIcon>
                <Typography variant="body2">Voltar para Carteira</Typography>
              </MuiLink>
            </Box>

            <Stack alignItems="center" spacing={1.5} sx={{ textAlign: 'center', py: 6 }}>
              <SvgIcon sx={{ fontSize: 48, color: 'primary.main' }}>
                <AttachMoney />
              </SvgIcon>
              <Typography variant="h5" fontWeight={700}>
                Novo Aporte
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calcule a distribuição ideal para seu próximo aporte.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setOpen(true)}
                startIcon={<AttachMoney />}
              >
                Abrir calculadora de aporte
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <AporteDrawer
        open={open}
        onClose={() => setOpen(false)}
        carteiras={carteiras}
      />
    </Layout>
  )
}
