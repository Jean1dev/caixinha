import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
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
    useTheme,
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
import { ArrowBackIos, Mail, QrCode2 } from "@mui/icons-material";

export default function Deposito() {
    const { user } = useUserAuth()
    const { caixinha } = useCaixinhaSelect()
    const router = useRouter()
    const theme = useTheme()
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
        setSolicitacao((prev) => ({
            ...prev,
            memberName: user.name,
            email: user.email
        }))
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
            router.push('/sucesso/deposito')
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
            setArquivo([...arquivos, { file: arquivo, name: arquivo.name }])
        });

        input.click()
    }

    const uploadItem = (resource: any) => {
        toast.loading('enviando arquivo aguarde')

        uploadResource(resource.file).then((fileUrl: string) => {
            toast.success('Upload realizado')
            const novaLista = arquivos.filter((it: { name: any; }) => it.name !== resource.name)
            novaLista.push({ file: resource, name: resource.name, status: 'success' })
            setArquivo(novaLista)
            setSolicitacao({ ...solicitacao, fileUrl })
        }).catch(e => toast.error(e.message))
    }

    const getChipByItem = (item: any) => {
        if (item.status === 'success') {
            return (
                <Chip 
                    key={item.index} 
                    label={`Upload realizado ${item.name}`} 
                    onDelete={() => {
                        window.open(solicitacao.fileUrl, "_blank")
                    }} 
                    deleteIcon={<CheckIcon />}
                    color="success"
                    sx={{ m: 0.5 }}
                />
            )
        }

        return (
            <Chip 
                key={item.index} 
                label={item?.name} 
                variant="outlined" 
                onDelete={() => { uploadItem(item) }} 
                deleteIcon={<CloudUploadIcon />}
                sx={{ m: 0.5 }}
            />
        )
    }

    if (isLoading) return <CenteredCircularProgress />

    return (
        <Layout>
            <Seo title="Deposito" />
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
                            Depositando em {caixinha?.name}
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid xs={12} md={6}>
                                <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                                    <CardContent>
                                        <Stack spacing={3}>
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    <QrCode2 />
                                                </Avatar>
                                                <Typography variant="h6">
                                                    Depósito via PIX
                                                </Typography>
                                            </Stack>

                                            <Box sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'center',
                                                bgcolor: 'background.paper',
                                                p: 2,
                                                borderRadius: 2
                                            }}>
                                                <Avatar
                                                    src={pix?.url}
                                                    variant="square"
                                                    sx={{
                                                        height: 300,
                                                        width: 300,
                                                        boxShadow: 2
                                                    }}
                                                />
                                            </Box>

                                            <Typography variant="subtitle1" align="center" color="text.secondary">
                                                Chave PIX: {pix?.chave}
                                            </Typography>

                                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    <Mail />
                                                </Avatar>
                                                <Typography variant="body2" color="text.secondary">
                                                    Em caso de dúvidas, entre em contato com os administradores da caixinha
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid xs={12} md={6}>
                                <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                                    <CardContent>
                                        <form onSubmit={request}>
                                            <Stack spacing={3}>
                                                <Typography variant="h6" gutterBottom>
                                                    Informações do Depósito
                                                </Typography>

                                                <Grid container spacing={2}>
                                                    <Grid xs={12} sm={6}>
                                                        <FormControl fullWidth>
                                                            <FormLabel>Nome</FormLabel>
                                                            <OutlinedInput
                                                                required
                                                                name="memberName"
                                                                disabled
                                                                value={solicitacao.memberName}
                                                                defaultValue={solicitacao.memberName}
                                                                onChange={handleChange}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid xs={12} sm={6}>
                                                        <FormControl fullWidth>
                                                            <FormLabel>Email</FormLabel>
                                                            <OutlinedInput
                                                                required
                                                                name="email"
                                                                type='email'
                                                                disabled
                                                                value={solicitacao.email}
                                                                defaultValue={solicitacao.email}
                                                                onChange={handleChange}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>

                                                <FormControl fullWidth>
                                                    <FormLabel>Valor do Depósito *</FormLabel>
                                                    <OutlinedInput
                                                        required
                                                        name='valor'
                                                        type='number'
                                                        value={solicitacao.valor}
                                                        onChange={handleChange}
                                                        startAdornment={<Typography sx={{ mr: 1 }}>R$</Typography>}
                                                    />
                                                </FormControl>

                                                <Box>
                                                    <FormLabel>Comprovante de Pagamento</FormLabel>
                                                    <Box sx={{ mt: 1, mb: 2 }}>
                                                        {arquivos.map((item: { name: string, index: Key }) =>
                                                            getChipByItem(item)
                                                        )}
                                                    </Box>
                                                    <Button
                                                        onClick={addComprovante}
                                                        variant="outlined"
                                                        startIcon={<CloudUploadIcon />}
                                                    >
                                                        Adicionar Comprovante
                                                    </Button>
                                                </Box>

                                                <FormControl fullWidth>
                                                    <FormLabel>Mensagem (opcional)</FormLabel>
                                                    <OutlinedInput
                                                        fullWidth
                                                        name="message"
                                                        multiline
                                                        rows={4}
                                                    />
                                                </FormControl>

                                                <Button
                                                    fullWidth
                                                    size="large"
                                                    variant="contained"
                                                    type="submit"
                                                    sx={{ mt: 2 }}
                                                >
                                                    Confirmar Depósito
                                                </Button>

                                                <Typography
                                                    color="text.secondary"
                                                    variant="body2"
                                                    align="center"
                                                >
                                                    Ao confirmar, você concorda com nossa{' '}
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
        </Layout>
    )
}
