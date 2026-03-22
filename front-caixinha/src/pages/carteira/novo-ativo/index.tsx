import { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import MuiLink from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { ArrowBack, AddCircleOutline } from '@mui/icons-material'
import NextLink from 'next/link'
import Layout from '@/components/Layout'
import { Seo } from '@/components/Seo'
import { useCarteiras } from '@/features/carteira/hooks/useCarteiras'
import { useAtivos } from '@/features/carteira/hooks/useAtivos'
import { AtivoFormDrawer } from '@/features/carteira/components/ativos/AtivoFormDrawer'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

export default function NovoAtivo() {
  const router = useRouter()
  const { carteiras } = useCarteiras()
  const { criar } = useAtivos()
  const [open, setOpen] = useState(true)

  const handleSave = async (payload: any) => {
    await criar(payload)
    toast.success('Ativo adicionado com sucesso!')
    router.push('/carteira/meus-ativos')
  }

  return (
    <Layout>
      <Seo title="Novo Ativo" />
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="sm">
          <Stack spacing={3}>
            <Box>
              <MuiLink
                component={NextLink}
                href="/carteira/meus-ativos"
                color="text.secondary"
                underline="hover"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
              >
                <SvgIcon fontSize="small"><ArrowBack /></SvgIcon>
                <Typography variant="body2">Voltar para Meus Ativos</Typography>
              </MuiLink>
            </Box>

            <Stack alignItems="center" spacing={1.5} sx={{ textAlign: 'center', py: 6 }}>
              <SvgIcon sx={{ fontSize: 48, color: 'primary.main' }}>
                <AddCircleOutline />
              </SvgIcon>
              <Typography variant="h5" fontWeight={700}>
                Adicionar Ativo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Adicione um novo ativo à sua carteira.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setOpen(true)}
                startIcon={<AddCircleOutline />}
              >
                Adicionar ativo
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <AtivoFormDrawer
        open={open}
        onClose={() => setOpen(false)}
        carteiras={carteiras}
        onSave={handleSave}
      />
    </Layout>
  )
}
