import Layout from "@/components/Layout";
import { Seo } from "@/components/Seo";
import {
    Box,
    Container,
    Stack,
    Typography,
    Paper,
    CircularProgress
} from "@mui/material";
import { ListarEmprestimosParaRenegociar } from "@/components/renegociacao/listar-emprestimos-para-renegociar";
import { useCallback, useState } from "react";
import { PropostaRenegociacao } from "@/components/renegociacao/proposta-renegociacao";
import { useCaixinhaSelect } from "@/hooks/useCaixinhaSelect";
import { solicitarRenegociacao } from "../api/api.service";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";

export default function Renegociacao() {
    const [renegociacao, setRenegociacao] = useState<any | null>(null)
    const [loading, setLoading] = useState(false)
    const { caixinha } = useCaixinhaSelect()
    const { t } = useTranslation()
    const theme = useTheme()

    const verProposta = useCallback((uid: string) => {
        setLoading(true)
        toast.success(t('renegociacao.solicitando_renegociacao'))
        solicitarRenegociacao({
            caixinhaId: caixinha?.id,
            emprestimoUid: uid
        }).then(res => {
            setRenegociacao(res)
            toast.success(t('renegociacao.proposta_carregada') || 'Proposta carregada com sucesso!')
        }).catch(error => {
            console.error('Erro ao solicitar renegociação:', error)
            toast.error(t('renegociacao.erro_solicitacao') || 'Erro ao solicitar renegociação. Tente novamente.')
        }).finally(() => {
            setLoading(false)
        })
        
    }, [caixinha, t])


    return (
        <Layout>
            <Seo title={t('renegociacao.title')} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: '100vh',
                    py: { xs: 4, md: 8 },
                    background: theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack 
                        spacing={4} 
                        alignItems="center"
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
                            <Stack spacing={1} alignItems="center">
                                <Typography
                                    color="text.secondary"
                                    variant="overline"
                                    sx={{ 
                                        fontSize: '0.875rem', 
                                        fontWeight: 600,
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {t('renegociacao.title')}
                                </Typography>
                                <Typography 
                                    variant="h3" 
                                    fontWeight={700} 
                                    align="center"
                                    sx={{ 
                                        color: 'text.primary',
                                    }}
                                >
                                    {t('renegociacao.ultimo_emprestimo')}
                                </Typography>
                            </Stack>

                            <Box 
                                sx={{ 
                                    width: '100%',
                                    animation: 'slideInUp 0.5s ease-out 0.2s both',
                                    '@keyframes slideInUp': {
                                        '0%': {
                                            opacity: 0,
                                            transform: 'translateY(30px) scale(0.95)'
                                        },
                                        '100%': {
                                            opacity: 1,
                                            transform: 'translateY(0) scale(1)'
                                        }
                                    }
                                }}
                            >
                                <Paper 
                                    elevation={3} 
                                    sx={{ 
                                        width: '100%', 
                                        p: { xs: 2, sm: 3 }, 
                                        borderRadius: 3,
                                        background: theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
                                        border: `1px solid ${theme.palette.divider}`,
                                    }}
                                >
                                    <Stack spacing={3}>
                                        {loading ? (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    py: 6,
                                                    gap: 2,
                                                    animation: 'fadeIn 0.3s ease-out',
                                                    '@keyframes fadeIn': {
                                                        '0%': { opacity: 0 },
                                                        '100%': { opacity: 1 }
                                                    }
                                                }}
                                            >
                                                <CircularProgress 
                                                    size={48} 
                                                    thickness={4}
                                                    sx={{ 
                                                        color: theme.palette.primary.main,
                                                        '& .MuiCircularProgress-circle': {
                                                            strokeLinecap: 'round',
                                                        }
                                                    }} 
                                                />
                                                <Typography 
                                                    variant="body1" 
                                                    sx={{ 
                                                        fontWeight: 500,
                                                        color: 'text.secondary'
                                                    }}
                                                >
                                                    {t('renegociacao.carregando_proposta') || 'Carregando proposta...'}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Box
                                                sx={{
                                                    animation: 'fadeIn 0.4s ease-out',
                                                    '@keyframes fadeIn': {
                                                        '0%': { opacity: 0 },
                                                        '100%': { opacity: 1 }
                                                    }
                                                }}
                                            >
                                                <ListarEmprestimosParaRenegociar verProposta={verProposta} />
                                            </Box>
                                        )}
                                        
                                        {renegociacao && (
                                            <Box
                                                sx={{
                                                    animation: 'slideInUp 0.5s ease-out',
                                                    '@keyframes slideInUp': {
                                                        '0%': {
                                                            opacity: 0,
                                                            transform: 'translateY(30px) scale(0.95)'
                                                        },
                                                        '100%': {
                                                            opacity: 1,
                                                            transform: 'translateY(0) scale(1)'
                                                        }
                                                    }
                                                }}
                                            >
                                                <Paper 
                                                    elevation={1} 
                                                    sx={{ 
                                                        p: 3, 
                                                        borderRadius: 2,
                                                        background: theme.palette.mode === 'dark' ? 'neutral.700' : 'background.paper',
                                                        border: `1px solid ${theme.palette.primary.main}20`,
                                                    }}
                                                >
                                                    <PropostaRenegociacao renegociacao={renegociacao} />
                                                </Paper>
                                            </Box>
                                        )}
                                    </Stack>
                                </Paper>
                            </Box>
                        </Stack>
                </Container>
            </Box>
        </Layout>
    )
}