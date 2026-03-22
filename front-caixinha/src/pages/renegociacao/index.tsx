import Layout from "@/components/Layout";
import { Seo } from "@/components/Seo";
import {
    Box,
    Container,
    Stack,
    Typography,
    Paper,
    LinearProgress,
    Stepper,
    Step,
    StepLabel,
    Alert,
} from "@mui/material";
import { ListarEmprestimosParaRenegociar } from "@/components/renegociacao/listar-emprestimos-para-renegociar";
import { useCallback, useState } from "react";
import { PropostaRenegociacao } from "@/components/renegociacao/proposta-renegociacao";
import { useCaixinhaSelect } from "@/hooks/useCaixinhaSelect";
import { solicitarRenegociacao } from "../api/api.service";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import type { SolicitarRenegociacaoResponse } from "@/features/caixinha/api/caixinha.types";

const TOAST_ID = "reneg-solicitacao";

export default function Renegociacao() {
    const [renegociacao, setRenegociacao] = useState<SolicitarRenegociacaoResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [requestError, setRequestError] = useState<string | null>(null)
    const [activeStep, setActiveStep] = useState(0)
    const { caixinha } = useCaixinhaSelect()
    const { t } = useTranslation()
    const theme = useTheme()

    const verProposta = useCallback((uid: string) => {
        if (!caixinha?.id) {
            toast.error(t('renegociacao.erro_solicitacao') || 'Selecione uma caixinha.')
            return
        }
        setRequestError(null)
        setLoading(true)
        setActiveStep(1)
        toast.loading(t('renegociacao.solicitando_renegociacao'), { id: TOAST_ID })
        solicitarRenegociacao({
            caixinhaId: caixinha.id,
            emprestimoUid: uid
        }).then((res) => {
            setRenegociacao(res)
            setActiveStep(2)
            toast.success(t('renegociacao.proposta_carregada') || 'Proposta carregada com sucesso!', { id: TOAST_ID })
        }).catch((error: Error) => {
            setRequestError(error.message)
            setActiveStep(0)
            toast.error(t('renegociacao.erro_solicitacao') || error.message, { id: TOAST_ID })
        }).finally(() => {
            setLoading(false)
        })
    }, [caixinha, t])

    const steps = [
        t('renegociacao.passo_emprestimo') || 'Empréstimo',
        t('renegociacao.passo_proposta') || 'Proposta',
        t('renegociacao.passo_conclusao') || 'Conclusão',
    ]

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
                    <Stack spacing={4} alignItems="center">
                            <Stack spacing={1} alignItems="center" sx={{ width: '100%' }}>
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
                                    sx={{ color: 'text.primary' }}
                                >
                                    {t('renegociacao.ultimo_emprestimo')}
                                </Typography>
                                <Stepper activeStep={activeStep} alternativeLabel sx={{ width: '100%', maxWidth: 560, mt: 2 }}>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </Stack>

                            {requestError && activeStep === 0 ? (
                                <Alert severity="error" sx={{ width: '100%', maxWidth: 560 }} onClose={() => setRequestError(null)}>
                                    {requestError}
                                </Alert>
                            ) : null}

                            <Box sx={{ width: '100%' }}>
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
                                        {loading ? <LinearProgress /> : null}
                                        <ListarEmprestimosParaRenegociar verProposta={verProposta} solicitando={loading} />
                                        
                                        {renegociacao && (
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
