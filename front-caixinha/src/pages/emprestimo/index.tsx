import {
    Box,
    Button,
    Container,
    FormControl,
    InputAdornment,
    Link,
    Stack,
    SvgIcon,
    TextField,
    Typography,
    Unstable_Grid2 as Grid
} from "@mui/material"
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { doEmprestimo, getValorParcelas } from '../api/api.service'
import Layout from '@/components/Layout'
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect'
import CenteredCircularProgress from '@/components/CenteredCircularProgress'
import toast from 'react-hot-toast'
import { RouterLink } from '@/components/RouterLink'
import { Seo } from '@/components/Seo'
import { ArrowBackIos, ArrowRight, Lock } from '@mui/icons-material'
import { EmprestimoResumo } from '@/components/emprestimos/emprestimo-resumo'
import { useUserAuth } from "@/hooks/useUserAuth";

export default function Emprestimo() {
    const { user } = useUserAuth()
    const router = useRouter()
    const { caixinha } = useCaixinhaSelect()
    const [isLoading, setLoading] = useState(false)
    const [solicitacao, setSolicitacao] = useState({
        valor: 0,
        juros: 2,
        parcela: 0,
        motivo: "",
        name: "",
        email: '',
        fees: 1.90
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
        setSolicitacao({ ...solicitacao, [name]: value });
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        doEmprestimo({ ...solicitacao, caixinhaID: caixinha?.id })
            .then(() => router.push('/sucesso'))
            .catch(err => {
                setLoading(false)
                toast.error(err.message)
            })
    }

    if (isLoading) return <CenteredCircularProgress />

    return (
        <Layout>
            <Seo title="Emprestimo " />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="lg">
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <div>
                                <Link
                                    color="text.primary"
                                    component={RouterLink}
                                    href={'/'}
                                    sx={{
                                        alignItems: 'center',
                                        display: 'inline-flex'
                                    }}
                                    underline="hover"
                                >
                                    <SvgIcon sx={{ mr: 1 }}>
                                        <ArrowBackIos />
                                    </SvgIcon>
                                    <Typography variant="subtitle2">
                                        Home
                                    </Typography>
                                </Link>
                            </div>
                            <Typography variant="h3">
                                Novo emprestimo
                            </Typography>
                        </Stack>
                        <Box mt={6}>
                            <Grid
                                container
                                spacing={6}
                            >
                                <Grid
                                    md={7}
                                    xs={12}
                                >
                                    <Stack spacing={6}>
                                        <Stack spacing={3}>
                                            <Stack
                                                alignItems="center"
                                                direction="row"
                                                spacing={2}
                                            >
                                                <Box
                                                    sx={{
                                                        alignItems: 'center',
                                                        border: (theme) => `1px solid ${theme.palette.divider}`,
                                                        borderRadius: 20,
                                                        display: 'flex',
                                                        height: 40,
                                                        justifyContent: 'center',
                                                        width: 40
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{ fontWeight: 'fontWeightBold' }}
                                                        variant="h6"
                                                    >
                                                        1
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h6">
                                                    Favorecido
                                                </Typography>
                                            </Stack>
                                            <div>
                                                <Grid
                                                    container
                                                    spacing={3}
                                                >
                                                    <Grid
                                                        xs={12}
                                                        sm={6}
                                                    >
                                                        <TextField
                                                            fullWidth
                                                            label="Caixinha"
                                                            name="caixinha"
                                                            disabled
                                                            value={caixinha?.name}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        xs={12}
                                                        sm={6}
                                                    >
                                                        <TextField
                                                            fullWidth
                                                            label="Nome"
                                                            name="name"
                                                            disabled
                                                            onChange={handleChange}
                                                            value={solicitacao.name}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        xs={12}
                                                        sm={6}
                                                    >
                                                        <TextField
                                                            fullWidth
                                                            label="Street Address"
                                                            name="address"
                                                            onChange={handleChange}
                                                            disabled
                                                            value={solicitacao.email}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </Stack>
                                        <Stack spacing={3}>
                                            <Stack
                                                alignItems="center"
                                                direction="row"
                                                spacing={2}
                                            >
                                                <Box
                                                    sx={{
                                                        alignItems: 'center',
                                                        border: (theme) => `1px solid ${theme.palette.divider}`,
                                                        borderRadius: 20,
                                                        display: 'flex',
                                                        height: 40,
                                                        justifyContent: 'center',
                                                        width: 40
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{ fontWeight: 'fontWeightBold' }}
                                                        variant="h6"
                                                    >
                                                        2
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h6">
                                                    Descrição
                                                </Typography>
                                            </Stack>
                                            <div>
                                                <FormControl fullWidth>
                                                    <TextField
                                                        id="outlined-multiline-static"
                                                        label="Motivo"
                                                        name='motivo'
                                                        multiline
                                                        value={solicitacao.motivo}
                                                        rows={4}
                                                        defaultValue={solicitacao.motivo}
                                                        onChange={handleChange}
                                                    />
                                                </FormControl>
                                            </div>
                                        </Stack>
                                        <Stack spacing={3}>
                                            <Stack
                                                alignItems="center"
                                                direction="row"
                                                spacing={2}
                                            >
                                                <Box
                                                    sx={{
                                                        alignItems: 'center',
                                                        border: (theme) => `1px solid ${theme.palette.divider}`,
                                                        borderRadius: 20,
                                                        display: 'flex',
                                                        height: 40,
                                                        justifyContent: 'center',
                                                        width: 40
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{ fontWeight: 'fontWeightBold' }}
                                                        variant="h6"
                                                    >
                                                        3
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h6">
                                                    Valores
                                                </Typography>
                                            </Stack>
                                            <div>
                                                <Box p={2}>
                                                    <TextField
                                                        label="Valor solicitado"
                                                        id="outlined-start-adornment"
                                                        defaultValue={solicitacao.valor}
                                                        value={solicitacao.valor}
                                                        onChange={handleChange}
                                                        name='valor'
                                                        type='number'
                                                        sx={{ m: 1, width: '25ch' }}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                                        }}
                                                    />
                                                    <TextField
                                                        label="Juros a ser pago"
                                                        id="outlined-start-adornment"
                                                        onChange={handleChange}
                                                        name='juros'
                                                        type='number'
                                                        value={solicitacao.juros}
                                                        sx={{ m: 1, width: '25ch' }}
                                                        defaultValue={solicitacao.juros}
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                                        }}
                                                    />
                                                    <TextField
                                                        onChange={handleChange}
                                                        name='parcela'
                                                        type='number'
                                                        value={solicitacao.parcela}
                                                        label="Quantidade de parcelas"
                                                        id="outlined-start-adornment"
                                                        sx={{ m: 1, width: '25ch' }}
                                                        defaultValue={solicitacao.parcela}
                                                    />
                                                </Box>
                                            </div>
                                        </Stack>
                                    </Stack>
                                </Grid>
                                <Grid
                                    md={5}
                                    xs={12}
                                >
                                    <EmprestimoResumo
                                        solicitacao={solicitacao}
                                        stateParcelas={stateParcelas}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{ mt: 6 }}>
                            <Stack
                                alignItems="center"
                                direction="row"
                                spacing={2}
                            >
                                <SvgIcon sx={{ color: 'success.main' }}>
                                    <Lock />
                                </SvgIcon>
                                <Typography variant="subtitle2">
                                    Ambiente seguro
                                </Typography>
                            </Stack>
                            <Typography
                                color="text.secondary"
                                sx={{ mt: 2 }}
                                variant="body2"
                            >
                                Suas movimentacoes estao seguras by best encryption
                                service – Braintree
                            </Typography>
                            <Button
                                color="primary"
                                endIcon={(
                                    <SvgIcon>
                                        <ArrowRight />
                                    </SvgIcon>
                                )}
                                size="large"
                                sx={{ mt: 3 }}
                                type="submit"
                                variant="contained"
                            >
                                Solicitar
                            </Button>
                        </Box>
                    </form>
                </Container>
            </Box>
        </Layout>
    )
}
