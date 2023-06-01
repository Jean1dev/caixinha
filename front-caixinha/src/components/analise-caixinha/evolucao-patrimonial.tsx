import { ArrowRight, ArrowUpward } from '@mui/icons-material';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    SvgIcon
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Chart } from '../chart';

const useChartOptions = () => {
    const theme = useTheme();

    return {
        chart: {
            background: 'transparent',
            stacked: false,
            toolbar: {
                show: false
            }
        },
        colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
        dataLabels: {
            enabled: false
        },
        fill: {
            opacity: 1,
            type: 'solid'
        },
        grid: {
            borderColor: theme.palette.divider,
            strokeDashArray: 2,
            xaxis: {
                lines: {
                    show: false
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        legend: {
            show: false
        },
        plotOptions: {
            bar: {
                columnWidth: '40px'
            }
        },
        stroke: {
            colors: ['transparent'],
            show: true,
            width: 2
        },
        theme: {
            mode: theme.palette.mode
        },
        xaxis: {
            axisBorder: {
                color: theme.palette.divider,
                show: true
            },
            axisTicks: {
                color: theme.palette.divider,
                show: true
            },
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            labels: {
                offsetY: 5,
                style: {
                    colors: theme.palette.text.secondary
                }
            }
        },
        yaxis: {
            labels: {
                formatter: (value: any) => (value > 0 ? `R$${value}` : `${value}`),
                offsetX: -10,
                style: {
                    colors: theme.palette.text.secondary
                }
            }
        }
    };
};

export const EvolucaoPatrimonial = (props: any) => {
    const { chartSeries, sx } = props;
    const chartOptions = useChartOptions();

    return (
        <Card sx={sx}>
            <CardHeader
                action={(
                    <Button
                        color="inherit"
                        size="small"
                        startIcon={(
                            <SvgIcon fontSize="small">
                                <ArrowUpward />
                            </SvgIcon>
                        )}
                    >
                        Sync
                    </Button>
                )}
                title="Evolução patrimonial"
            />
            <CardContent>
                <Chart
                    height={350}
                    options={chartOptions}
                    series={chartSeries}
                    type="bar"
                    width="100%"
                />
            </CardContent>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                    color="inherit"
                    endIcon={(
                        <SvgIcon fontSize="small">
                            <ArrowRight />
                        </SvgIcon>
                    )}
                    size="small"
                >
                    Acessar extrato de anos anteriores
                </Button>
            </CardActions>
        </Card>
    );
};