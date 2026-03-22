import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import SvgIcon from '@mui/material/SvgIcon'
import { TrendingUp, AddCircleOutline } from '@mui/icons-material'
import NextLink from 'next/link'

export function CarteiraEmptyState() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2,
        textAlign: 'center',
      }}
    >
      <SvgIcon sx={{ fontSize: 64, color: 'text.disabled' }}>
        <TrendingUp />
      </SvgIcon>
      <Typography variant="h6" color="text.secondary">
        Nenhuma carteira encontrada
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 320 }}>
        Crie sua primeira carteira de investimentos e comece a acompanhar seu patrimônio.
      </Typography>
      <Button
        component={NextLink}
        href="/carteira/nova-carteira"
        variant="contained"
        startIcon={<SvgIcon><AddCircleOutline /></SvgIcon>}
        sx={{ mt: 1 }}
      >
        Criar minha primeira carteira
      </Button>
    </Box>
  )
}
