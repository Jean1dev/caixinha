import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Chart } from '../chart';
import { ArrowCircleDownOutlined, ArrowCircleUpOutlined } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { getDistribuicaoPorMeta } from '@/pages/api/api.carteira';
import toast from 'react-hot-toast';

const useChartOptions = (labels: any) => {
    const theme = useTheme();

    return {
        chart: {
            background: 'transparent'
        },
        colors: [
            theme.palette.primary.main,
            theme.palette.info.main,
            theme.palette.warning.main,
            theme.palette.info.light,
            theme.palette.primary.light,
            theme.palette.warning.light,
            theme.palette.success.light
        ],
        dataLabels: {
            enabled: false
        },
        grid: {
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        },
        labels,
        legend: {
            show: false
        },
        plotOptions: {
            pie: {
                expandOnClick: false
            },
            radialBar: {
                dataLabels: {
                    show: false
                },
                hollow: {
                    size: '100%'
                }
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
            fillSeriesColor: false,
            y: {
                formatter(value: any) {
                    return `%${value}`;
                }
            }
        }
    };
};

export const CarteiraBalanco = (props: any) => {
    const { carteiras } = props;
    const [chartSeries, setChartSeries] = useState<any[]>([])
    const [labels, setLabels] = useState<String[]>([])
    const chartOptions = useChartOptions(labels);

    const totalAmount = useMemo(() => {
        return chartSeries.reduce((acc: any, item: any) => acc += item, 0)
    }, [chartSeries]);

    useEffect(() => {
        if (carteiras.length > 0) {
            getDistribuicaoPorMeta(carteiras[0]['id'])
                .then((response: any) => {
                    const categorias = Object.keys(response);
                    const valores = Object.values(response);

                    setLabels(categorias)
                    setChartSeries(valores)
                })
                .catch(() => toast.error('Nao foi possivel buscar a distruicao por ativos'))
        }
    }, [carteiras])

    return (
        <Card>
            <CardHeader
                title="Balanço"
                subheader="Distribuicao de ativos por meta"
            />
            <CardContent>
                <Stack
                    alignItems="center"
                    direction="row"
                    flexWrap="wrap"
                    spacing={3}
                >
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            height: 200,
                            justifyContent: 'center',
                            width: 200
                        }}
                    >
                        <Chart
                            height={200}
                            options={chartOptions}
                            series={chartSeries}
                            type="donut"
                        />
                    </Box>
                    <Stack
                        spacing={4}
                        sx={{ flexGrow: 1 }}
                    >
                        <Stack spacing={1}>
                            <Typography
                                color="text.secondary"
                                variant="overline"
                            >
                                Balanço total
                            </Typography>
                            <Typography variant="h4">
                                {`%${totalAmount}`}
                            </Typography>
                        </Stack>
                        <Stack spacing={1}>
                            <Typography
                                color="text.secondary"
                                variant="overline"
                            >
                                Tipos de ativos
                            </Typography>
                            <Stack
                                component="ul"
                                spacing={1}
                                sx={{
                                    listStyle: 'none',
                                    m: 0,
                                    p: 0
                                }}
                            >
                                {chartSeries.map((item: any, index: any) => {
                                    const amount = `%${item}`;

                                    return (
                                        <Stack
                                            alignItems="center"
                                            component="li"
                                            direction="row"
                                            key={index}
                                            spacing={2}
                                        >
                                            <Box
                                                sx={{
                                                    backgroundColor: chartOptions.colors[index],
                                                    borderRadius: '4px',
                                                    height: 16,
                                                    width: 16
                                                }}
                                            />
                                            <Typography
                                                sx={{ flexGrow: 1 }}
                                                variant="subtitle2"
                                            >
                                                {labels[index]}
                                            </Typography>
                                            <Typography
                                                color="text.secondary"
                                                variant="subtitle2"
                                            >
                                                {amount}
                                            </Typography>
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
            <Divider />
            <CardActions>
                <Button
                    LinkComponent={NextLink}
                    href="/carteira/aporte"
                    color="inherit"
                    endIcon={(
                        <SvgIcon fontSize="small">
                            <ArrowCircleUpOutlined />
                        </SvgIcon>
                    )}
                    size="small"
                >
                    Novo Aporte
                </Button>
                <Button
                    color="inherit"
                    endIcon={(
                        <SvgIcon fontSize="small">
                            <ArrowCircleDownOutlined />
                        </SvgIcon>
                    )}
                    size="small"
                >
                    Transferir entre carteiras
                </Button>
            </CardActions>
        </Card>
    );
};
