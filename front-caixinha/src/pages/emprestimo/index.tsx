import {
    Box,
    Button,
    Card,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    FormLabel,
    List,
    ListItem,
    ListItemText,
    OutlinedInput,
    Slider,
    Stack,
    Typography,
} from "@mui/material"
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { doEmprestimo, getValorParcelas } from '../api/api.service'
import Layout from '@/components/Layout'
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect'
import CenteredCircularProgress from '@/components/CenteredCircularProgress'
import toast from 'react-hot-toast'
import { Seo } from '@/components/Seo'
import { useUserAuth } from "@/hooks/useUserAuth";

const PARCELAS = [2, 3, 6, 12]
const TAXA = 0.018

const brl = (n: number) =>
    'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const Emprestimo = () => {
    const { user } = useUserAuth()
    const router = useRouter()
    const { caixinha } = useCaixinhaSelect()
    const [isLoading, setLoading] = useState(false)
    const [motivoTemp, setMotivoTemp] = useState('')
    const [solicitacao, setSolicitacao] = useState({
        valor: 500,
        juros: 2,
        parcela: 3,
        name: "",
        email: '',
        fees: 3.00
    })
    const [stateParcelas, setStateParcelas] = useState({
        data: [],
        loading: false
    })

    useEffect(() => {
        setSolicitacao((prev) => ({
            ...prev,
            name: user.name,
            email: user.email
        }))
    }, [user])

    useEffect(() => {
        if (!solicitacao.parcela) return
        setStateParcelas({ data: [], loading: true })
        getValorParcelas({ parcelas: solicitacao.parcela, total: solicitacao.valor })
            .then(response => setStateParcelas({ data: response, loading: false }))
            .catch(() => setStateParcelas({ data: [], loading: false }))
    }, [solicitacao.valor, solicitacao.parcela])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        doEmprestimo({
            ...solicitacao,
            motivo: motivoTemp,
            caixinhaID: caixinha?.id
        })
            .then(() => router.push('/sucesso'))
            .catch(err => {
                setLoading(false)
                toast.error(err.message)
            })
    }

    // mesma fórmula do EmprestimoResumo original
    const total = solicitacao.valor + (solicitacao.valor * (solicitacao.juros / 100)) + solicitacao.fees
    const parcelaValor = total / solicitacao.parcela

    if (isLoading) return <CenteredCircularProgress />

    return (
        <>
            <Seo title="Emprestimo" />
            <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
                <Container maxWidth="md">
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="overline"
                            color="text.secondary"
                            sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.5px', lineHeight: 2 }}
                        >
                            Empréstimo coletivo
                        </Typography>
                        <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                            Novo empréstimo {caixinha?.name ? `na ${caixinha.name}` : ''}
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 3,
                                alignItems: 'start',
                            }}
                        >
                            {/* Card esquerdo — formulário visual */}
                            <Card sx={{ p: 3, borderRadius: 5, boxShadow: '0 5px 22px rgba(0,0,0,0.08)' }}>
                                <Stack spacing={3}>
                                    {/* Valor com slider */}
                                    <Box>
                                        <Typography
                                            variant="overline"
                                            color="text.secondary"
                                            sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.5px' }}
                                        >
                                            Valor solicitado
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            color="primary"
                                            fontWeight={700}
                                            sx={{ mt: 0.5 }}
                                        >
                                            {brl(solicitacao.valor)}
                                        </Typography>
                                        <Slider
                                            min={100}
                                            max={5000}
                                            step={100}
                                            value={solicitacao.valor}
                                            onChange={(_, v) =>
                                                setSolicitacao((prev) => ({ ...prev, valor: v as number }))
                                            }
                                            sx={{ mt: 1.5, color: 'primary.main' }}
                                        />
                                    </Box>

                                    {/* Parcelas */}
                                    <Box>
                                        <Typography
                                            variant="overline"
                                            color="text.secondary"
                                            sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.5px' }}
                                        >
                                            Parcelamento
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                            {PARCELAS.map((m) => (
                                                <Button
                                                    key={m}
                                                    variant={solicitacao.parcela === m ? 'contained' : 'outlined'}
                                                    size="small"
                                                    onClick={() =>
                                                        setSolicitacao((prev) => ({ ...prev, parcela: m }))
                                                    }
                                                    sx={{ flex: 1, borderRadius: 2.5, fontWeight: 600 }}
                                                >
                                                    {m}x
                                                </Button>
                                            ))}
                                        </Stack>
                                    </Box>

                                    {/* Motivo */}
                                    <FormControl fullWidth>
                                        <FormLabel sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'text.secondary', mb: 0.75 }}>
                                            Motivo do empréstimo
                                        </FormLabel>
                                        <OutlinedInput
                                            name="motivo"
                                            value={motivoTemp}
                                            onChange={(e) => setMotivoTemp(e.target.value)}
                                            multiline
                                            rows={3}
                                            placeholder="Descreva o motivo..."
                                            sx={{ borderRadius: 2 }}
                                        />
                                    </FormControl>

                                    {/* Juros (obrigatório para o backend, exibido como campo secundário) */}
                                    <FormControl>
                                        <FormLabel sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'text.secondary', mb: 0.75 }}>
                                            Taxa de juros (%)
                                        </FormLabel>
                                        <OutlinedInput
                                            required
                                            name='juros'
                                            type='number'
                                            size="small"
                                            value={solicitacao.juros}
                                            onChange={(e) =>
                                                setSolicitacao((prev) => ({ ...prev, juros: Number(e.target.value) }))
                                            }
                                            sx={{ borderRadius: 2, maxWidth: 120 }}
                                        />
                                    </FormControl>
                                </Stack>
                            </Card>

                            {/* Card direito — resumo */}
                            <Card sx={{ p: 3, borderRadius: 5, boxShadow: '0 5px 22px rgba(0,0,0,0.08)', position: { md: 'sticky' }, top: { md: 88 } }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                    Resumo
                                </Typography>

                                {/* Valores */}
                                <Stack spacing={0}>
                                    {[
                                        ['Subtotal', brl(solicitacao.valor)],
                                        ['Taxas', `${solicitacao.juros}%`],
                                        ['Impostos', `R$ ${solicitacao.fees.toFixed(2)}`],
                                    ].map(([label, value]) => (
                                        <Box
                                            key={label}
                                            sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}
                                        >
                                            <Typography variant="body2" color="text.secondary">{label}</Typography>
                                            <Typography variant="body2" fontWeight={600}>{value}</Typography>
                                        </Box>
                                    ))}
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', py: 1 }}>
                                        <Typography fontWeight={700}>Total</Typography>
                                        <Typography variant="h5" fontWeight={700} color="primary">{brl(total)}</Typography>
                                    </Box>
                                    {!stateParcelas.loading && stateParcelas.data.length === 0 && solicitacao.parcela > 0 && (
                                        <Typography variant="caption" color="text.secondary">
                                            {solicitacao.parcela}× de {brl(parcelaValor)}
                                        </Typography>
                                    )}
                                </Stack>

                                {/* Parcelas do backend */}
                                {stateParcelas.loading && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                                        <CircularProgress size={14} />
                                        <Typography variant="caption" color="text.secondary">Calculando parcelamento…</Typography>
                                    </Box>
                                )}
                                {stateParcelas.data.length > 0 && (
                                    <List disablePadding dense sx={{ mt: 1 }}>
                                        {stateParcelas.data.map((parcela: any, index: number) => (
                                            <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                                                <ListItemText
                                                    primary={`Parcela ${index + 1}`}
                                                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                                />
                                                <Typography variant="body2" fontWeight={600}>
                                                    R$ {parcela.value}
                                                </Typography>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}

                                <Button
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                    sx={{ mt: 2, borderRadius: 3 }}
                                >
                                    Solicitar empréstimo
                                </Button>
                            </Card>
                        </Box>
                    </form>
                </Container>
            </Box>
        </>
    )
}

export default function Page() {
    return (
        <Layout>
            <Emprestimo />
        </Layout>
    )
}