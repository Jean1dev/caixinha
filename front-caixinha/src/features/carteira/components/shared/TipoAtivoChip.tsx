import Chip from '@mui/material/Chip'
import { SxProps, Theme } from '@mui/material/styles'

const TIPO_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  ACAO_NACIONAL:      { label: 'Ação Nacional',     color: '#1976d2', bg: '#e3f2fd' },
  ACAO_INTERNACIONAL: { label: 'Ação Internacional', color: '#7b1fa2', bg: '#f3e5f5' },
  FII:                { label: 'FII',               color: '#2e7d32', bg: '#e8f5e9' },
  RENDA_FIXA:         { label: 'Renda Fixa',        color: '#f57c00', bg: '#fff3e0' },
  CRYPTO:             { label: 'Cripto',            color: '#e65100', bg: '#fbe9e7' },
  REITs:              { label: 'REITs',             color: '#00796b', bg: '#e0f2f1' },
}

interface Props {
  tipo: string
  size?: 'small' | 'medium'
  sx?: SxProps<Theme>
}

export function TipoAtivoChip({ tipo, size = 'small', sx }: Props) {
  const config = TIPO_CONFIG[tipo] ?? { label: tipo, color: '#616161', bg: '#f5f5f5' }

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        backgroundColor: config.bg,
        color: config.color,
        fontWeight: 600,
        fontSize: '0.7rem',
        ...sx,
      }}
    />
  )
}
