import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useCotacoes } from '../../hooks/useCotacoes'
import { CotacoesSkeleton } from '../shared/Skeletons'

export function QuotesTicker() {
  const { cotacoes, isLoading } = useCotacoes()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  if (isLoading && !cotacoes.length) return <CotacoesSkeleton />
  if (!cotacoes.length) return null

  const items = [...cotacoes, ...cotacoes]

  return (
    <Box
      sx={{
        overflow: 'hidden',
        backgroundColor: isDark ? 'grey.900' : 'grey.100',
        borderBottom: '1px solid',
        borderColor: 'divider',
        py: 0.75,
        '@keyframes ticker': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: 'max-content',
          animation: 'ticker 30s linear infinite',
          '&:hover': { animationPlayState: 'paused' },
        }}
      >
        {items.map((cotacao, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 2,
              borderRight: '1px solid',
              borderColor: 'divider',
              flexShrink: 0,
            }}
          >
            <Typography variant="caption" fontWeight={700}>
              {cotacao.ticker}
            </Typography>
            <Typography
              variant="caption"
              fontWeight={600}
              sx={{ color: cotacao.type === '+' ? 'success.main' : 'error.main' }}
            >
              {cotacao.type}{cotacao.variation}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
