import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Container } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import TradingView from '../externals/trading-view';

const chartSeries = [
    {
        name: 'Performance',
        data: [10, 5, 11, 20, 13, 28, 18, 4, 13, 12, 13, 5]
    }
];

const useChartOptions = () => {
    const theme = useTheme();

    return {
        chart: {
            background: 'transparent',
            stacked: false,
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        colors: [theme.palette.primary.main],
        dataLabels: {
            enabled: false
        },
        fill: {
            gradient: {
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 100]
            },
            type: 'gradient'
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
        markers: {
            size: 6,
            strokeColors: theme.palette.background.default,
            strokeWidth: 3
        },
        stroke: {
            curve: 'smooth'
        },
        theme: {
            mode: theme.palette.mode
        },
        xaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
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
                formatter: (value: any) => (value > 0 ? `${value}K` : `${value}`),
                offsetX: -10,
                style: {
                    colors: theme.palette.text.secondary
                }
            }
        }
    };
};

const indices = [
    "INDEX:IBOV|1D",
    "OANDA:SPX500USD|1D"
]

export const ResumoMercado = () => {
    const chartOptions = useChartOptions();

    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                py: 4
            }}
        >

            <Container maxWidth="lg">
                <Grid
                    container
                    spacing={3}
                >
                    {indices.map((indice: any, index: any) => (
                        <Grid
                            key={index}
                            xs={12}
                            md={6}
                            lg={3}
                        >
                            <TradingView data={`[ [${indice}] ]`} />
                        </Grid>
                    ))}

                </Grid>

                {/* <Stack spacing={8}>

                    <Card>
                        <CardHeader
                            action={(
                                <IconButton>
                                    <SvgIcon>
                                        <DonutSmall />
                                    </SvgIcon>
                                </IconButton>
                            )}
                            title="Performance Over Time"
                        />
                        <CardContent>
                            <Scrollbar>
                                <Box
                                    sx={{
                                        height: `100%`,
                                        width: '100%',
                                        minWidth: 500,
                                        position: 'relative'
                                    }}
                                >
                                    <Chart
                                        height={350}
                                        //@ts-ignore
                                        options={chartOptions}
                                        series={chartSeries}
                                        type="area"
                                    />
                                </Box>
                            </Scrollbar>
                        </CardContent>
                    </Card>
                </Stack> */}
            </Container>
        </Box>
    );
};
