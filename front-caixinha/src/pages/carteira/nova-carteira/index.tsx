import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import MuiLink from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { ArrowBack } from '@mui/icons-material'
import NextLink from 'next/link'
import Layout from '@/components/Layout'
import { Seo } from '@/components/Seo'
import { NovaCarteiraWizard } from '@/features/carteira/components/nova-carteira/NovaCarteiraWizard'

export default function NovaCarteira() {
  return (
    <Layout>
      <Seo title="Nova Carteira" />
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="md">
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

            <Box>
              <Typography variant="h5" fontWeight={700}>
                Nova Carteira
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure sua carteira em poucos passos
              </Typography>
            </Box>

            <NovaCarteiraWizard />
          </Stack>
        </Container>
      </Box>
    </Layout>
  )
}
