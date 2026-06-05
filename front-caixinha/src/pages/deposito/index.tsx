import {
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    Collapse,
    Container,
    Divider,
    FormControl,
    FormLabel,
    OutlinedInput,
    Stack,
    Typography,
} from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckIcon from '@mui/icons-material/Check';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BoltIcon from '@mui/icons-material/Bolt';
import { FormEvent, Key, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { doDeposito, getBuckets, getChavesPix, uploadResource } from '../api/api.service'
import Layout from '@/components/Layout'
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';
import CenteredCircularProgress from '@/components/CenteredCircularProgress';
import toast from 'react-hot-toast';
import { Seo } from '@/components/Seo';
import { useUserAuth } from "@/hooks/useUserAuth";

const METODOS = [
    { id: 'pix', icon: <QrCode2Icon />, label: 'Pix', desc: 'Aprovação na hora' },
    { id: 'cartao', icon: <CreditCardIcon />, label: 'Cartão', desc: 'Crédito ou débito' },
    { id: 'boleto', icon: <ReceiptLongIcon />, label: 'Boleto', desc: 'Até 1 dia útil' },
]

const QUICKS = [50, 100, 200, 500]

const brl = (n: number) =>
    'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Deposito() {
    const { user } = useUserAuth()
    const { caixinha } = useCaixinhaSelect()
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)
    const [uploadingName, setUploadingName] = useState<string | null>(null)
    const [arquivos, setArquivo] = useState<any>([])
    const [pix, setPix] = useState<any>(null)
    const [metodo, setMetodo] = useState('pix')
    const [solicitacao, setSolicitacao] = useState({
        valor: 200,
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
        const pixToast = toast.loading('Carregando informacoes da chave pix')
        getChavesPix(caixinha.id).then(res => {
            if (res) {
                setPix({
                    chave: res.keysPix[0],
                    url: res.urlsQrCodePix[0]
                })
            }
            toast.dismiss(pixToast)
        }).catch(() => {
            toast.dismiss(pixToast)
            toast.error('Não foi possível carregar o PIX')
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
        setUploadingName(resource.name)
        const tid = toast.loading('Enviando arquivo…')
        uploadResource(resource.file).then((fileUrl: string) => {
            toast.success('Upload realizado', { id: tid })
            const novaLista = arquivos.filter((it: { name: any; }) => it.name !== resource.name)
            novaLista.push({ file: resource, name: resource.name, status: 'success' })
            setArquivo(novaLista)
            setSolicitacao({ ...solicitacao, fileUrl })
        }).catch(e => {
            toast.error(e.message, { id: tid })
        }).finally(() => setUploadingName(null))
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

        const uploading = uploadingName === item?.name
        return (
            <Chip 
                key={item.index} 
                label={item?.name} 
                variant="outlined" 
                onDelete={uploading ? undefined : () => { uploadItem(item) }} 
                deleteIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
                disabled={uploading}
                sx={{ m: 0.5 }}
            />
        )
    }

    if (isLoading) return <CenteredCircularProgress />

    return (
        <Layout>
            <Seo title="Deposito" />
            <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
                <Container maxWidth="md">
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="overline"
                            color="text.secondary"
                            sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.5px', lineHeight: 2 }}
                        >
                            Minha caixinha
                        </Typography>
                        <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                            Novo depósito {caixinha?.name ? `em ${caixinha.name}` : ''}
                        </Typography>
                    </Box>

                    <form onSubmit={request}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1.3fr 1fr' },
                                gap: 3,
                                alignItems: 'start',
                            }}
                        >
                            {/* Card esquerdo — formulário */}
                            <Card sx={{ p: 3, borderRadius: 5, boxShadow: '0 5px 22px rgba(0,0,0,0.08)' }}>
                                <Stack spacing={3}>
                                    {/* Valor */}
                                    <Box>
                                        <Typography
                                            variant="overline"
                                            color="text.secondary"
                                            sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.5px' }}
                                        >
                                            Valor do depósito
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                border: '2px solid',
                                                borderColor: 'primary.main',
                                                borderRadius: 2,
                                                px: 2,
                                                py: 1.5,
                                                mt: 1,
                                                boxShadow: (t) => `0 0 0 3px ${t.palette.primary.main}18`,
                                            }}
                                        >
                                            <Typography variant="h5" fontWeight={700} color="text.secondary">
                                                R$
                                            </Typography>
                                            <OutlinedInput
                                                required
                                                name='valor'
                                                type='number'
                                                value={solicitacao.valor}
                                                onChange={handleChange}
                                                sx={{
                                                    border: 'none',
                                                    '& fieldset': { border: 'none' },
                                                    '& input': { fontSize: 28, fontWeight: 700, p: 0 },
                                                    flex: 1,
                                                }}
                                            />
                                        </Box>
                                        {/* Valores rápidos */}
                                        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                                            {QUICKS.map((q) => (
                                                <Button
                                                    key={q}
                                                    size="small"
                                                    variant={solicitacao.valor === q ? 'contained' : 'outlined'}
                                                    onClick={() => setSolicitacao((prev) => ({ ...prev, valor: q }))}
                                                    sx={{ flex: 1, borderRadius: 2.5, fontWeight: 600 }}
                                                >
                                                    +{q}
                                                </Button>
                                            ))}
                                        </Stack>
                                    </Box>

                                    {/* Método de pagamento */}
                                    <Box>
                                        <Typography
                                            variant="overline"
                                            color="text.secondary"
                                            sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.5px' }}
                                        >
                                            Forma de pagamento
                                        </Typography>
                                        <Stack spacing={1} sx={{ mt: 1 }}>
                                            {METODOS.map((m) => {
                                                const ativo = metodo === m.id
                                                return (
                                                    <Box
                                                        key={m.id}
                                                        onClick={() => setMetodo(m.id)}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1.5,
                                                            p: 1.5,
                                                            borderRadius: 3,
                                                            cursor: 'pointer',
                                                            border: '1px solid',
                                                            borderColor: ativo ? 'primary.main' : 'divider',
                                                            bgcolor: ativo ? 'primary.lightest' : 'background.paper',
                                                            transition: 'all 0.15s',
                                                        }}
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                width: 40,
                                                                height: 40,
                                                                bgcolor: ativo ? 'primary.main' : 'neutral.100',
                                                                color: ativo ? '#fff' : 'text.secondary',
                                                            }}
                                                        >
                                                            {m.icon}
                                                        </Avatar>
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography variant="body2" fontWeight={600}>{m.label}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{m.desc}</Typography>
                                                        </Box>
                                                        <Box
                                                            sx={{
                                                                width: 20, height: 20, borderRadius: '50%',
                                                                border: '2px solid', borderColor: ativo ? 'primary.main' : 'divider',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            }}
                                                        >
                                                            {ativo && (
                                                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'primary.main' }} />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                )
                                            })}
                                        </Stack>

                                        {/* QR Code PIX — expande quando Pix está selecionado */}
                                        <Collapse in={metodo === 'pix'}>
                                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                                <Avatar
                                                    src={pix?.url}
                                                    variant="square"
                                                    sx={{ height: 200, width: 200, borderRadius: 2, boxShadow: 2 }}
                                                />
                                                {pix?.chave && (
                                                    <Typography variant="caption" color="text.secondary" align="center">
                                                        Chave PIX: {pix.chave}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Collapse>
                                    </Box>

                                    {/* Comprovante */}
                                    <Box>
                                        <FormLabel sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'text.secondary' }}>
                                            Comprovante de pagamento
                                        </FormLabel>
                                        <Box sx={{ mt: 1, mb: 1 }}>
                                            {arquivos.map((item: { name: string, index: Key }) =>
                                                getChipByItem(item)
                                            )}
                                        </Box>
                                        <Button
                                            onClick={addComprovante}
                                            variant="outlined"
                                            size="small"
                                            startIcon={<CloudUploadIcon />}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Adicionar comprovante
                                        </Button>
                                    </Box>
                                </Stack>
                            </Card>

                            {/* Card direito — resumo */}
                            <Card sx={{ p: 3, borderRadius: 5, boxShadow: '0 5px 22px rgba(0,0,0,0.08)', position: { md: 'sticky' }, top: { md: 88 } }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                    Resumo
                                </Typography>
                                <Stack spacing={0}>
                                    {[
                                        ['Caixinha', caixinha?.name ?? '—'],
                                        ['Valor', brl(solicitacao.valor || 0)],
                                        ['Taxa', 'Grátis'],
                                    ].map(([label, value]) => (
                                        <Box
                                            key={label}
                                            sx={{ display: 'flex', justifyContent: 'space-between', py: 1.25 }}
                                        >
                                            <Typography variant="body2" color="text.secondary">{label}</Typography>
                                            <Typography variant="body2" fontWeight={600} align="right">{value}</Typography>
                                        </Box>
                                    ))}
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', py: 1 }}>
                                        <Typography fontWeight={700}>Total</Typography>
                                        <Typography variant="h5" fontWeight={700} color="primary">{brl(solicitacao.valor || 0)}</Typography>
                                    </Box>
                                </Stack>

                                {/* Badge de proteção */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        bgcolor: 'success.lightest',
                                        borderRadius: 2.5,
                                        px: 1.5,
                                        py: 1.25,
                                        my: 2,
                                    }}
                                >
                                    <VerifiedUserIcon sx={{ fontSize: 18, color: 'success.dark' }} />
                                    <Typography variant="caption" color="success.dark" fontWeight={500}>
                                        Transação protegida e registrada na caixinha.
                                    </Typography>
                                </Box>

                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <FormLabel sx={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'text.secondary', mb: 0.5 }}>
                                        Nome
                                    </FormLabel>
                                    <OutlinedInput
                                        required
                                        name="memberName"
                                        disabled
                                        size="small"
                                        value={solicitacao.memberName}
                                        onChange={handleChange}
                                        sx={{ borderRadius: 2 }}
                                    />
                                </FormControl>

                                <Button
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                    startIcon={<BoltIcon />}
                                    sx={{ borderRadius: 3 }}
                                >
                                    Depositar {brl(solicitacao.valor || 0)}
                                </Button>
                            </Card>
                        </Box>
                    </form>
                </Container>
            </Box>
        </Layout>
    )
}
