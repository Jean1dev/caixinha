import Typography from '@mui/material/Typography'
import { SxProps, Theme } from '@mui/material/styles'

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

interface Props {
  valor: number
  variant?: 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption'
  color?: string
  sx?: SxProps<Theme>
  component?: React.ElementType
}

export function ValorMonetario({ valor, variant = 'body2', color, sx, component }: Props) {
  return (
    <Typography
      variant={variant}
      color={color}
      sx={sx}
      component={component as any}
    >
      {BRL.format(valor)}
    </Typography>
  )
}

export function formatBRL(valor: number): string {
  return BRL.format(valor)
}
