import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

interface Props {
  nota: number
  showLabel?: boolean
  compact?: boolean
}

function getColor(nota: number): 'success' | 'info' | 'warning' | 'error' {
  if (nota >= 8) return 'success'
  if (nota >= 6) return 'info'
  if (nota >= 4) return 'warning'
  return 'error'
}

export function NotaDisplay({ nota, showLabel = true, compact = false }: Props) {
  const color = getColor(nota)

  return (
    <Tooltip title={`Nota: ${nota}/10`} arrow>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: compact ? 60 : 80 }}>
        <LinearProgress
          value={nota * 10}
          variant="determinate"
          color={color}
          sx={{ height: 6, borderRadius: 3, flexGrow: 1 }}
        />
        {showLabel && (
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 16 }}>
            {nota}
          </Typography>
        )}
      </Box>
    </Tooltip>
  )
}
