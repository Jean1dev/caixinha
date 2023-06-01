import { Chart } from '@/components/chart';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  useTheme
} from '@mui/material';

const useChartOptions = (labels: any) => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent'
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main
    ],
    dataLabels: {
      enabled: false
    },
    labels,
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        expandOnClick: false
      }
    },
    states: {
      active: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      }
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      fillSeriesColor: false
    }
  };
};

export const GraficoPizzaMembros = (props: any) => {
  const { chartSeries, labels, sx } = props;
  const chartOptions = useChartOptions(labels);

  return (
    <Card sx={sx}>
      <CardHeader/>
      <CardContent>
        <Chart
          height={300}
          options={chartOptions}
          series={chartSeries}
          type="donut"
          width="100%"
        />
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 2 }}
        >
          {chartSeries.map((item: any, index: any) => {
            const label = labels[index];

            return (
              <Box
                key={label}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Typography
                  sx={{ my: 1 }}
                  variant="h6"
                >
                  {label}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="subtitle2"
                >
                  {item}%
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

