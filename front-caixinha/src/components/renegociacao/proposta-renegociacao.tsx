import { ArrowRightAltOutlined, CheckCircle, ContactSupport } from "@mui/icons-material"
import {
    Box,
    Button,
    Container,
    Divider,
    FormControlLabel,
    Radio,
    RadioGroup,
    Stack,
    Typography,
    Paper
} from "@mui/material"
import CenteredCircularProgress from "../CenteredCircularProgress"
import { useCallback, useMemo, useState } from "react"
import { aceitarRenegociacao } from "@/pages/api/api.service"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"
import { useTheme } from "@mui/material/styles"

export const PropostaRenegociacao = (props: any) => {
    const { renegociacao } = props
    const [parcelamento, setParcelamento] = useState(1)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { t } = useTranslation()
    const theme = useTheme()

    const formattedTotalAmount = useMemo(() => {
        return `R$ ${renegociacao.sugestao.newTotalValue.toFixed(2)}`
    }, [renegociacao.sugestao.newTotalValue])

    const assets = [
        {
            amount: renegociacao.sugestao.newInterestRate,
            color: '#6C76C4',
            name: t('renegociacao.total_juros')
        },
        {
            amount: renegociacao.sugestao.newTotalValue,
            color: '#FF4081',
            name: t('renegociacao.total')
        }
    ]

    const aceitarProposta = useCallback(() => {
        setLoading(true)
        aceitarRenegociacao({
            renegociacaoId: renegociacao.renegId,
            valorProposta: renegociacao.sugestao.newTotalValue,
            parcelas: parcelamento
        })
        .then(() => router.push('sucesso'))
        .finally(() => setLoading(false))
    }, [parcelamento, renegociacao])

    const propostaPersonalizada = useCallback(() => {
        alert(t('renegociacao.proposta_personalizada'))
    }, [t])

    if (loading) {
        return <CenteredCircularProgress />
    }

    return (
        <Box
            sx={{
                animation: 'fadeInUp 0.6s ease-out',
                '@keyframes fadeInUp': {
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
            <Container maxWidth="md">
                <Paper 
                    elevation={3}
                    sx={{ 
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: theme.palette.mode === 'dark' ? 'neutral.800' : 'background.paper',
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    {/* Header com Valor da Proposta */}
                    <Box sx={{ 
                        p: 4, 
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}10)`,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        textAlign: 'center'
                    }}>
                        <Typography 
                            variant="overline" 
                            color="text.secondary" 
                            sx={{ fontWeight: 600, fontSize: '0.8rem' }}
                        >
                            {t('renegociacao.proposta')}
                        </Typography>
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                fontWeight: 700,
                                color: theme.palette.primary.main,
                                mt: 1
                            }}
                        >
                            {formattedTotalAmount}
                        </Typography>
                    </Box>

                    <Box sx={{ p: 4 }}>
                        <Stack spacing={4}>
                            {/* Seção RESUMO */}
                            <Box>
                                <Typography 
                                    variant="overline" 
                                    color="text.secondary" 
                                    sx={{ fontWeight: 600, fontSize: '0.8rem' }}
                                >
                                    {t('renegociacao.resumo')}
                                </Typography>
                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    {assets.map((currency) => {
                                        const amount = `R$ ${currency.amount.toFixed(2)}`
                                        return (
                                            <Box 
                                                key={currency.name}
                                                sx={{ 
                                                    p: 2, 
                                                    borderRadius: 2, 
                                                    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                                    border: `1px solid ${theme.palette.divider}`
                                                }}
                                            >
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Box sx={{ 
                                                            width: 12, 
                                                            height: 12, 
                                                            borderRadius: '50%', 
                                                            background: currency.color 
                                                        }} />
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                            {currency.name}
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                        {amount}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        )
                                    })}
                                </Stack>
                            </Box>

                            <Divider />

                            {/* Seção PARCELAMENTO */}
                            <Box>
                                <Typography 
                                    variant="overline" 
                                    color="text.secondary" 
                                    sx={{ fontWeight: 600, fontSize: '0.8rem' }}
                                >
                                    {t('renegociacao.parcelamento')}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <RadioGroup
                                        name="Parcelamento"
                                        onChange={e => setParcelamento(Number(e.target.value))}
                                        value={parcelamento}
                                        sx={{ 
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: 1,
                                            flexWrap: 'wrap'
                                        }}
                                    >
                                        {renegociacao.sugestao.installmentOptions.map((parcela: any) => {
                                            const installmentValue = (renegociacao.sugestao.newTotalValue / parcela).toFixed(2)
                                            return (
                                                <FormControlLabel
                                                    key={parcela}
                                                    value={parcela}
                                                    control={
                                                        <Radio 
                                                            sx={{
                                                                '&.Mui-checked': {
                                                                    color: theme.palette.success.main,
                                                                }
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {parcela}x
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                R$ {installmentValue}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    sx={{
                                                        margin: 0,
                                                        padding: 2,
                                                        borderRadius: 2,
                                                        border: parcelamento === parcela 
                                                            ? `2px solid ${theme.palette.success.main}` 
                                                            : `1px solid ${theme.palette.divider}`,
                                                        background: parcelamento === parcela 
                                                            ? theme.palette.success.main + '10' 
                                                            : 'transparent',
                                                        '&:hover': {
                                                            background: theme.palette.action.hover,
                                                        }
                                                    }}
                                                />
                                            )
                                        })}
                                    </RadioGroup>
                                </Box>
                            </Box>

                            <Divider />

                            {/* Botões de Ação */}
                            <Stack spacing={2}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    startIcon={<CheckCircle />}
                                    endIcon={<ArrowRightAltOutlined />}
                                    onClick={aceitarProposta}
                                    sx={{
                                        py: 2,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        fontSize: '1.1rem',
                                        transform: 'scale(1)',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                        },
                                        '&:active': {
                                            transform: 'scale(0.98)',
                                        }
                                    }}
                                >
                                    {t('renegociacao.aceitar')}
                                </Button>
                                
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                    startIcon={<ContactSupport />}
                                    endIcon={<ArrowRightAltOutlined />}
                                    onClick={propostaPersonalizada}
                                    sx={{
                                        py: 2,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        fontSize: '1rem',
                                        transform: 'scale(1)',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                        },
                                        '&:active': {
                                            transform: 'scale(0.98)',
                                        }
                                    }}
                                >
                                    {t('renegociacao.proposta_personalizada')}
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}