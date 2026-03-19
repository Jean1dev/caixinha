import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { Chart } from '@/components/chart'
import { useDistribuicao } from '../../hooks/useDistribuicao'

const COLORS = [
  '#1976d2', '#7b1fa2', '#2e7d32', '#f57c00',
  '#e65100', '#00796b', '#c62828', '#0277bd',
]

interface Props {
  carteiraId: string | null
}

export function DistribuicaoChart({ carteiraId }: Props) {
  const theme = useTheme()
  const { labels, series, isLoading } = useDistribuicao(carteiraId)

  const hasData = series.length > 0

  const chartOptions: any = {
    chart: { background: 'transparent', sparkline: { enabled: false } },
    colors: COLORS,
    dataLabels: { enabled: false },
    labels,
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: false,
              label: 'Total',
              fontSize: '14px',
              color: theme.palette.text.secondary,
              formatter: () => `100%`,
            },
          },
        },
        expandOnClick: false,
      },
    },
    states: {
      active: { filter: { type: 'none' } },
      hover: { filter: { type: 'lighten', value: 0.1 } },
    },
    stroke: { width: 2, colors: [theme.palette.background.paper] },
    theme: { mode: theme.palette.mode },
    tooltip: {
      fillSeriesColor: false,
      y: { formatter: (value: number) => `${value.toFixed(1)}%` },
    },
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Distribuição por Classe"
        subheader="Percentual atual de cada tipo de ativo"
        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 700 }}
      />
      <Divider />
      <CardContent>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Skeleton variant="circular" width={200} height={200} />
          </Box>
        ) : !hasData ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Selecione uma carteira para ver a distribuição
            </Typography>
          </Box>
        ) : (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
            <Box sx={{ flexShrink: 0 }}>
              <Chart
                height={200}
                options={chartOptions}
                series={series}
                type="donut"
                width={200}
              />
            </Box>
            <Stack spacing={1} sx={{ flexGrow: 1 }}>
              {labels.map((label, index) => (
                <Stack
                  key={label}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: COLORS[index % COLORS.length],
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" noWrap>
                      {label}
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle2" color="text.secondary">
                    {series[index]}%
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}
