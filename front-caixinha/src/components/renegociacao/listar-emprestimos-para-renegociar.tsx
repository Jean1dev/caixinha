import { useUserAuth } from "@/hooks/useUserAuth"
import { getUltimoEmprestimoPendente } from "@/pages/api/api.service"
import {
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    Typography,
    Box,
    Chip
} from "@mui/material"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useTheme } from "@mui/material/styles"
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ScheduleIcon from '@mui/icons-material/Schedule'
import DescriptionIcon from '@mui/icons-material/Description'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

function extractData(data: string[] | null) {
    if (data) {
        const last = data[data.length - 1]
        const newDate = new Date(last)
        return `${newDate.getDate()}/${newDate.getMonth()}/${newDate.getFullYear()}`
    }

    return ''
}

export const ListarEmprestimosParaRenegociar = ({ verProposta }: any) => {
    const [ultimoEmprestimoAtalho, setUltimoEmprestimoAtalho] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const { user } = useUserAuth()
    const { t } = useTranslation()
    const theme = useTheme()

    useEffect(() => {
        if (user.name === '' || !user) {
            setLoading(false)
            return
        }

        getUltimoEmprestimoPendente(user.name, user.email)
            .then((response) => {
                setUltimoEmprestimoAtalho(response)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [user])


    if (loading) {
        return (
            <Box 
                sx={{ 
                    width: '100%',
                    animation: 'fadeIn 0.3s ease-out',
                    '@keyframes fadeIn': {
                        '0%': { opacity: 0 },
                        '100%': { opacity: 1 }
                    }
                }}
            >
                <Card sx={{ 
                    background: 'transparent',
                    boxShadow: 'none',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid xs={12} md={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ 
                                        width: 40, 
                                        height: 40, 
                                        borderRadius: '50%', 
                                        background: theme.palette.primary.main + '20',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <DescriptionIcon sx={{ color: theme.palette.primary.main }} />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('renegociacao.carregando_emprestimo')}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid xs={12} md={8}>
                                <Stack spacing={2}>
                                    <Box sx={{ height: 20, background: theme.palette.action.hover, borderRadius: 1 }} />
                                    <Box sx={{ height: 16, background: theme.palette.action.hover, borderRadius: 1, width: '60%' }} />
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        )
    }

    if (!ultimoEmprestimoAtalho?.data) {
        return (
            <Box
                sx={{
                    animation: 'slideInUp 0.4s ease-out',
                    '@keyframes slideInUp': {
                        '0%': {
                            opacity: 0,
                            transform: 'translateY(20px)'
                        },
                        '100%': {
                            opacity: 1,
                            transform: 'translateY(0)'
                        }
                    }
                }}
            >
                <Card sx={{ 
                    background: 'transparent',
                    boxShadow: 'none',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    textAlign: 'center',
                    py: 4
                }}>
                    <CardContent>
                        <Box sx={{ 
                            width: 80, 
                            height: 80, 
                            borderRadius: '50%', 
                            background: theme.palette.action.hover,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2
                        }}>
                            <AccountBalanceWalletIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                        </Box>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {t('renegociacao.nenhum_emprestimo_pendente')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t('renegociacao.nenhum_emprestimo_descricao')}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                animation: 'slideInUp 0.5s ease-out',
                '@keyframes slideInUp': {
                    '0%': {
                        opacity: 0,
                        transform: 'translateY(20px)'
                    },
                    '100%': {
                        opacity: 1,
                        transform: 'translateY(0)'
                    }
                }
            }}
        >
            <Card sx={{ 
                background: 'transparent',
                boxShadow: 'none',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                '&:hover': {
                    border: `1px solid ${theme.palette.primary.main}40`,
                    boxShadow: `0 4px 20px ${theme.palette.primary.main}10`,
                },
                transition: 'all 0.3s ease-in-out'
            }}>
                <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid xs={12} md={4}>
                            <Stack spacing={2} alignItems="flex-start">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ 
                                        width: 48, 
                                        height: 48, 
                                        borderRadius: '50%', 
                                        background: theme.palette.primary.main + '20',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: `2px solid ${theme.palette.primary.main}30`
                                    }}>
                                        <DescriptionIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                                    </Box>
                                    <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                        {t('renegociacao.id_emprestimo')}
                                    </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                fontFamily: 'monospace',
                                                fontSize: '0.75rem',
                                                wordBreak: 'break-all',
                                                color: 'text.primary'
                                            }}
                                        >
                                            {ultimoEmprestimoAtalho?.data?.uid}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Grid>
                        <Grid xs={12} md={8}>
                            <Stack spacing={3}>
                                <Box sx={{ 
                                    p: 2, 
                                    borderRadius: 2, 
                                    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                    border: `1px solid ${theme.palette.divider}`
                                }}>
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AccountBalanceWalletIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {ultimoEmprestimoAtalho?.data?.description}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip 
                                                label={`R$ ${ultimoEmprestimoAtalho?.data?.valueRequested.value}`}
                                                size="small"
                                                color="primary"
                                                sx={{ 
                                                    fontWeight: 600
                                                }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {t('valor_solicitado')}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>

                                <Box sx={{ 
                                    p: 2, 
                                    borderRadius: 2, 
                                    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                    border: `1px solid ${theme.palette.divider}`
                                }}>
                                    <Stack 
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={2}
                                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                                        justifyContent="space-between"
                                    >
                                        <Stack spacing={1}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <ScheduleIcon sx={{ fontSize: 20, color: theme.palette.warning.main }} />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    {t('renegociacao.ultima_data_pagamento')}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {extractData(ultimoEmprestimoAtalho?.data?.billingDates)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                {t('renegociacao.proposta_p_voce')}
                                            </Typography>
                                        </Stack>
                                        
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<TrendingUpIcon />}
                                            onClick={() => verProposta(ultimoEmprestimoAtalho?.data?.uid)}
                                            sx={{
                                                borderRadius: 2,
                                                px: 3,
                                                py: 1.5,
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                transform: 'scale(1)',
                                                transition: 'all 0.2s ease-in-out',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                },
                                                '&:active': {
                                                    transform: 'scale(0.95)',
                                                }
                                            }}
                                        >
                                            {t('renegociacao.ver_proposta')}
                                        </Button>
                                    </Stack>
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    )
}