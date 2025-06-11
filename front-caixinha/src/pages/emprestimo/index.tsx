import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    FormControl,
    FormLabel,
    InputAdornment,
    Link,
    OutlinedInput,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid,
    useTheme
} from "@mui/material"
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { doEmprestimo, getValorParcelas } from '../api/api.service'
import Layout from '@/components/Layout'
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect'
import CenteredCircularProgress from '@/components/CenteredCircularProgress'
import toast from 'react-hot-toast'
import { Seo } from '@/components/Seo'
import { ArrowBackIos, CreditCard, Percent, AttachMoney } from '@mui/icons-material'
import { EmprestimoResumo } from '@/components/emprestimos/emprestimo-resumo'
import { useUserAuth } from "@/hooks/useUserAuth";

const Emprestimo = () => {
    const { user } = useUserAuth()
    const router = useRouter()
    const { caixinha } = useCaixinhaSelect()
    const theme = useTheme()
    const [isLoading, setLoading] = useState(false)
    const [motivoTemp, setMotivoTemp] = useState('')
    const [solicitacao, setSolicitacao] = useState({
        valor: 0,
        juros: 2,
        parcela: 0,
        name: "",
        email: '',
        fees: 3.00
    })
    const [stateParcelas, setStateParcelas] = useState({
        data: [],
        loading: false
    })

    useEffect(() => {
        setSolicitacao({
            ...solicitacao,
            name: user.name,
            email: user.email
        })
    }, [user])

    useEffect(() => {
        if (!solicitacao.parcela) {
            return
        }
        setStateParcelas({
            data: [],
            loading: true
        })

        getValorParcelas({ parcelas: solicitacao.parcela, total: solicitacao.valor })
            .then(response => {
                setStateParcelas({
                    data: response,
                    loading: false
                })
            }).catch(() => {
                setStateParcelas({
                    data: [],
                    loading: false
                })
            })

    }, [solicitacao])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'motivo') {
            setMotivoTemp(value)
            return
        }

        setSolicitacao({ ...solicitacao, [name]: value });
    }

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

    if (isLoading) return <CenteredCircularProgress />

    return (
        <>
            <Seo title="Emprestimo" />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                    background: theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={3}>
                        <Link
                            color="text.primary"
                            component="a"
                            href={'/'}
                            sx={{
                                alignItems: 'center',
                                display: 'inline-flex',
                                width: 'fit-content'
                            }}
                            underline="hover"
                        >
                            <SvgIcon sx={{ mr: 1 }}>
                                <ArrowBackIos />
                            </SvgIcon>
                            <Typography variant="subtitle2">
                                Voltar para Home
                            </Typography>
                        </Link>

                        <Typography variant="h4" fontWeight={700} gutterBottom>
                            Novo empréstimo na {caixinha?.name}
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid xs={12} md={6}>
                                <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                                    <CardContent>
                                        <Stack spacing={3}>
                                            <Typography variant="h6" gutterBottom>
                                                Resumo do Empréstimo
                                            </Typography>
                                            <EmprestimoResumo
                                                solicitacao={solicitacao}
                                                stateParcelas={stateParcelas}
                                            />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid xs={12} md={6}>
                                <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                                    <CardContent>
                                        <form onSubmit={handleSubmit}>
                                            <Stack spacing={3}>
                                                <Typography variant="h6" gutterBottom>
                                                    Informações do Empréstimo
                                                </Typography>

                                                <Grid container spacing={2}>
                                                    <Grid xs={12}>
                                                        <FormControl fullWidth>
                                                            <FormLabel>Valor Solicitado</FormLabel>
                                                            <OutlinedInput
                                                                required
                                                                name='valor'
                                                                type='number'
                                                                value={solicitacao.valor}
                                                                onChange={handleChange}
                                                                startAdornment={
                                                                    <InputAdornment position="start">
                                                                        <AttachMoney />
                                                                    </InputAdornment>
                                                                }
                                                            />
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid xs={12} sm={6}>
                                                        <FormControl fullWidth>
                                                            <FormLabel>Juros (%)</FormLabel>
                                                            <OutlinedInput
                                                                required
                                                                name='juros'
                                                                type='number'
                                                                value={solicitacao.juros}
                                                                onChange={handleChange}
                                                                startAdornment={
                                                                    <InputAdornment position="start">
                                                                        <Percent />
                                                                    </InputAdornment>
                                                                }
                                                            />
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid xs={12} sm={6}>
                                                        <FormControl fullWidth>
                                                            <FormLabel>Quantidade de Parcelas</FormLabel>
                                                            <OutlinedInput
                                                                required
                                                                name='parcela'
                                                                type='number'
                                                                value={solicitacao.parcela}
                                                                onChange={handleChange}
                                                                startAdornment={
                                                                    <InputAdornment position="start">
                                                                        <CreditCard />
                                                                    </InputAdornment>
                                                                }
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>

                                                <FormControl fullWidth>
                                                    <FormLabel>Motivo do Empréstimo</FormLabel>
                                                    <OutlinedInput
                                                        fullWidth
                                                        name="motivo"
                                                        value={motivoTemp}
                                                        onChange={handleChange}
                                                        multiline
                                                        rows={4}
                                                        placeholder="Descreva o motivo do seu empréstimo..."
                                                    />
                                                </FormControl>

                                                <Button
                                                    fullWidth
                                                    size="large"
                                                    variant="contained"
                                                    type="submit"
                                                    sx={{ mt: 2 }}
                                                >
                                                    Solicitar Empréstimo
                                                </Button>

                                                <Typography
                                                    color="text.secondary"
                                                    variant="body2"
                                                    align="center"
                                                >
                                                    Ao solicitar, você concorda com nossa{' '}
                                                    <Link
                                                        color="primary"
                                                        href="#"
                                                        underline="hover"
                                                    >
                                                        Política de Privacidade
                                                    </Link>
                                                </Typography>
                                            </Stack>
                                        </form>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Stack>
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