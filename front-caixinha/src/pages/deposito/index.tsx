import {
    Avatar,
    Box,
    Button,
    Chip,
    Container,
    FormControl,
    FormLabel,
    Unstable_Grid2 as Grid,
    Link,
    OutlinedInput,
    Stack,
    SvgIcon,
    Typography,
} from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckIcon from '@mui/icons-material/Check';
import { FormEvent, Key, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { doDeposito, getBuckets, getChavesPix, uploadResource } from '../api/api.service'
import Layout from '@/components/Layout'
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';
import CenteredCircularProgress from '@/components/CenteredCircularProgress';
import toast from 'react-hot-toast';
import { Seo } from '@/components/Seo';
import { useUserAuth } from "@/hooks/useUserAuth";
import { ArrowBackIos, Mail } from "@mui/icons-material";
import { RouterLink } from "@/components/RouterLink";

export default function Deposito() {
    const { user } = useUserAuth()
    const { caixinha } = useCaixinhaSelect()
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)
    const [arquivos, setArquivo] = useState<any>([])
    const [pix, setPix] = useState<any>(null)
    const [solicitacao, setSolicitacao] = useState({
        valor: 0,
        fileUrl: '',
        memberName: "",
        email: '',
    })

    useEffect(() => {
        setSolicitacao({
            ...solicitacao,
            memberName: user.name,
            email: user.email
        })
    }, [user])

    useEffect(() => {
        if (!caixinha)
            return

        getBuckets()
        toast.loading('Carregando informacoes da chave pix')
        getChavesPix(caixinha.id).then(res => {
            if (res) {
                setPix({
                    chave: res.keysPix[0],
                    url: res.urlsQrCodePix[0]
                })
            }
        })
    }, [caixinha])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSolicitacao({ ...solicitacao, [name]: value });
    }

    const request = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        doDeposito({
            caixinhaId: caixinha?.id,
            name: solicitacao.memberName,
            email: solicitacao.email,
            valor: solicitacao.valor,
            comprovante: solicitacao.fileUrl
        }).then(() => {
            router.push('/sucesso')
        }).catch(err => {
            console.log(err)
            setLoading(false)
            toast.error(err.message)
        })
    }, [caixinha, solicitacao, router])

    const addComprovante = () => {
        let input = document.createElement('input');
        input.type = 'file';

        input.addEventListener('change', function (event: any) {
            let arquivo = event.target.files[0];

            console.log('Arquivo selecionado:', arquivo);
            setArquivo([...arquivos, { file: arquivo, name: arquivo.name }])

        });

        input.click()
    }

    const uploadItem = (resource: any) => {
        toast.loading('enviando arquivo aguarde')

        uploadResource(resource.file).then((fileUrl: string) => {
            toast.success('Upload realizado')
            //@ts-ignore
            const novaLista = arquivos.filter(it => it.name !== resource.name)
            novaLista.push({ file: resource, name: resource.name, status: 'success' })
            setArquivo(novaLista)
            setSolicitacao({ ...solicitacao, fileUrl })
        }).catch(e => toast.error(e.message))
    }

    const getChipByItem = (item: any) => {
        if (item.status === 'success') {
            return (
                <p>
                    <Chip key={item.index} label={`Upload realizado ${item.name}`} onDelete={() => {
                        window.open(solicitacao.fileUrl, "_blank")
                    }} deleteIcon={<CheckIcon />} />
                </p>
            )
        }

        return (
            <Chip key={item.index} label={item?.name} variant="outlined" onDelete={() => { uploadItem(item) }} deleteIcon={<CloudUploadIcon />} />
        )
    }

    if (isLoading) return <CenteredCircularProgress />

    return (
        <Layout>
            <Seo title="Contact" />
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
                        backgroundColor: (theme) => theme.palette.mode === 'dark'
                            ? 'neutral.800'
                            : 'neutral.50',
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
                                        Home
                                    </Typography>
                                </Link>
                            </div>

                        </Stack>
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={2}
                            sx={{
                                mb: 6,
                                mt: 8
                            }}
                        >
                            <Avatar
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'primary.contrastText'
                                }}
                                variant="rounded"
                            >
                                <SvgIcon>
                                    <Mail />
                                </SvgIcon>
                            </Avatar>
                            <Typography variant="overline">
                                Contato com administrador
                            </Typography>
                        </Stack>
                        <Typography
                            sx={{ mb: 3 }}
                            variant="body1"
                        >
                            Se tiver algum duvida sobre os objetivos dessa caixinha, voce pode entrar em contato com os membros
                        </Typography>
                        <Typography
                            color="primary"
                            sx={{ mb: 3 }}
                            variant="h6"
                        >
                            Faca um deposito e se junto a nossa comunidade
                        </Typography>
                        <Avatar
                            src={pix?.url}
                            variant="square"
                            sx={{
                                height: 400,
                                mb: 2,
                                width: 400
                            }}
                        />
                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >
                            Chave pix {pix?.chave}
                        </Typography>
                        <Stack
                            alignItems="center"
                            direction="row"
                            flexWrap="wrap"
                            gap={4}
                            sx={{
                                color: 'text.primary',
                                '& > *': {
                                    flex: '0 0 auto'
                                }
                            }}
                        >
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
                        <Typography
                            sx={{ pb: 3 }}
                            variant="h6"
                        >
                            Depositando em {caixinha?.name}
                        </Typography>
                        <form onSubmit={request}>
                            <Grid
                                container
                                spacing={3}
                            >
                                <Grid
                                    xs={12}
                                    sm={6}
                                >
                                    <FormControl fullWidth>
                                        <FormLabel
                                            sx={{
                                                color: 'text.primary',
                                                mb: 1
                                            }}
                                        >
                                            Nome
                                        </FormLabel>
                                        <OutlinedInput
                                            required
                                            name="memberName"
                                            disabled
                                            value={solicitacao.memberName}
                                            defaultValue={solicitacao.memberName}
                                            onChange={handleChange}
                                            inputProps={{ "data-testid": "name" }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid
                                    xs={12}
                                    sm={6}
                                >
                                    <FormControl fullWidth>
                                        <FormLabel
                                            sx={{
                                                color: 'text.primary',
                                                mb: 1
                                            }}
                                        >
                                            Email
                                        </FormLabel>
                                        <OutlinedInput
                                            required
                                            name="email"
                                            type='email'
                                            disabled
                                            value={solicitacao.email}
                                            defaultValue={solicitacao.email}
                                            onChange={handleChange}
                                            inputProps={{ "data-testid": "name" }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid
                                    xs={12}
                                    sm={6}
                                >
                                    <FormControl fullWidth>
                                        <FormLabel
                                            sx={{
                                                color: 'text.primary',
                                                mb: 1
                                            }}
                                        >
                                            Valor *
                                        </FormLabel>
                                        <OutlinedInput
                                            id="outlined-start-adornment"
                                            defaultValue={solicitacao.valor}
                                            value={solicitacao.valor}
                                            onChange={handleChange}
                                            name='valor'
                                            type='number'
                                            sx={{ m: 1, width: '25ch' }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid xs={12}>
                                    <Box display="row" gap={2}>
                                        {arquivos.map((item: { name: string, index: Key }) =>
                                            getChipByItem(item)
                                        )}

                                    </Box>
                                    <Box display="flex" gap={2}>

                                        <Button
                                            onClick={addComprovante}
                                            variant="contained"
                                            color="secondary"
                                        >
                                            Adicionar Comprovante
                                        </Button>
                                    </Box>
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
                                            name="message"
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
                                    Depositar
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
        </Layout>

    )
}
