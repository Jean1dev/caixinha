import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    InputAdornment,
    Link,
    OutlinedInput,
    Stack,
    SvgIcon,
    TextField,
    Typography,
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2';
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { doEmprestimo, getValorParcelas } from '../api/api.service'
import Layout from '@/components/Layout'
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect'
import CenteredCircularProgress from '@/components/CenteredCircularProgress'
import toast from 'react-hot-toast'
import { RouterLink } from '@/components/RouterLink'
import { Seo } from '@/components/Seo'
import { ArrowBackIos } from '@mui/icons-material'
import { EmprestimoResumo } from '@/components/emprestimos/emprestimo-resumo'
import { useUserAuth } from "@/hooks/useUserAuth";

const Emprestimo = () => {
    const { user } = useUserAuth()
    const router = useRouter()
    const { caixinha } = useCaixinhaSelect()
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
            <Seo title="Emprestimo " />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Box
                    component="main"
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            lg: 'repeat(2, 1fr)',
                            xs: 'repeat(1, 1fr)'
                        },
                        flexGrow: 1
                    }}
                >
                    <Box
                        sx={{
                            py: 8
                        }}
                    >
                        <Container
                            maxWidth="md"
                            sx={{ pl: { lg: 15 } }}
                        >
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
                                            Voltar
                                        </Typography>
                                    </Link>
                                    <Typography variant="h3">
                                        Novo emprestimo na {caixinha?.name}
                                    </Typography>
                                </div>
                                <EmprestimoResumo
                                    solicitacao={solicitacao}
                                    stateParcelas={stateParcelas}
                                />
                            </Stack>
                        </Container>
                    </Box>

                    <Box
                        sx={{
                            backgroundColor: 'background.paper',
                            px: 6,
                            py: 15
                        }}
                    >
                        <Container
                            maxWidth="md"
                            sx={{
                                pr: {
                                    lg: 15
                                }
                            }}
                        >

                            <form onSubmit={handleSubmit}>
                                <Grid
                                    container
                                    spacing={3}
                                >

                                    <Grid
                                        xs={12}
                                        sm={6}
                                    >
                                        <FormControl fullWidth>
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
                                        </FormControl>
                                        <FormControl fullWidth>
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
                                        </FormControl>
                                        <FormControl fullWidth>
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
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={12}>
                                        <FormControl fullWidth>
                                            <FormLabel
                                                sx={{
                                                    color: 'text.primary',
                                                    mb: 1
                                                }}
                                            >
                                                Mensagem
                                            </FormLabel>
                                            <OutlinedInput
                                                fullWidth
                                                name="motivo"
                                                value={motivoTemp}
                                                defaultValue={motivoTemp}
                                                onChange={handleChange}
                                                multiline
                                                rows={6}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        mt: 3
                                    }}
                                >
                                    <Button
                                        fullWidth
                                        size="large"
                                        variant="contained"
                                        type="submit"
                                    >
                                        Solicitar emprestimo
                                    </Button>
                                </Box>
                                <Typography
                                    color="text.secondary"
                                    sx={{ mt: 3 }}
                                    variant="body2"
                                >
                                    By submitting this, you agree to the
                                    {' '}
                                    <Link
                                        color="text.primary"
                                        href="#"
                                        underline="always"
                                        variant="subtitle2"
                                    >
                                        Privacy Policy
                                    </Link>
                                    {' '}
                                    and
                                    {' '}
                                    <Link
                                        color="text.primary"
                                        href="#"
                                        underline="always"
                                        variant="subtitle2"
                                    >
                                        Cookie Policy
                                    </Link>
                                    .
                                </Typography>
                            </form>
                        </Container>
                    </Box>
                </Box>
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