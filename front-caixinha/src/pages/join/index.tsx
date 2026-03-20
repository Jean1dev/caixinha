import Layout from "@/components/Layout";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    FormControl,
    Grid,
    Stack,
    TextField,
    Typography,
    Avatar,
    CircularProgress
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { joinABox } from "../api/api.service";
import { Caixinha } from "@/types/types";
import { signIn, useSession } from "next-auth/react";
import CenteredCircularProgress from "@/components/CenteredCircularProgress";
import { toast } from "react-hot-toast";
import DisplayValorMonetario from "@/components/display-valor-monetario";
import { Seo } from "@/components/Seo";
import { useCaixinhasCatalog } from "@/features/caixinha/hooks/useCaixinhasCatalog";
import { caixinhaCatalogKey, invalidateMinhasCaixinhas } from "@/features/caixinha/api/swr-keys";
import { mutate } from "swr";
import GroupIcon from '@mui/icons-material/Group';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useTheme } from '@mui/material/styles';

export default function Join() {
    const theme = useTheme();
    const { status, data } = useSession()
    const [formData, setFormData] = useState({
        nick: '',
        email: ''
    })
    const [box, setBox] = useState<Caixinha | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const router = useRouter()
    const { catalog, isLoading: catalogLoading } = useCaixinhasCatalog()

    useEffect(() => {
        if (catalogLoading || !router.isReady) return
        const id = router.query.id
        if (typeof id !== 'string') {
            setBox(null)
            return
        }
        const found = catalog.find((c) => c.id === id)
        setBox(found ?? null)
    }, [catalog, catalogLoading, router.isReady, router.query.id])

    useEffect(() => {
        if (status === 'authenticated' && data?.user) {
            setFormData({
                nick: data.user?.name as string,
                email: data.user?.email as string
            })
        }
    }, [status, data])

    if (catalogLoading || !router.isReady)
        return <CenteredCircularProgress />

    if (!box)
        return (
            <Layout>
                <Seo title="Participar da caixinha" />
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography>Caixinha não encontrada.</Typography>
                    <Button sx={{ mt: 2 }} variant="contained" onClick={() => router.back()}>Voltar</Button>
                </Box>
            </Layout>
        )

    if (status === 'loading')
        return (
            <Layout>
                <CenteredCircularProgress />
            </Layout>
        )

    if (status === 'unauthenticated')
        return (
            <Layout>
                <Seo title="Participar da caixinha" />
                <Box
                    sx={{
                        flexGrow: 1,
                        minHeight: '70vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2,
                    }}
                >
                    <Card sx={{ maxWidth: 480, width: '100%', p: 2, borderRadius: 4, boxShadow: 6 }}>
                        <CardContent>
                            <Stack spacing={2} alignItems="center" textAlign="center">
                                <Typography variant="h6">
                                    Faça login na plataforma para participar desta caixinha.
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                    {box.name}
                                </Typography>
                                <Stack direction="row" spacing={2} justifyContent="center" sx={{ pt: 1 }}>
                                    <Button variant="outlined" onClick={() => router.back()}>
                                        Voltar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => void signIn(undefined, { callbackUrl: router.asPath })}
                                    >
                                        Entrar
                                    </Button>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Layout>
        )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const payload = {
            nick: formData.nick,
            email: formData.email,
            boxId: box.id
        }
        setSubmitting(true)
        joinABox(payload).then(() => {
            invalidateMinhasCaixinhas()
            mutate(caixinhaCatalogKey())
            toast.success('Você é um membro dessa caixinha agora')
            router.push(`/caixinha/${box.id}`)
        }).catch(err => {
            toast.error(err.message)
            setSubmitting(false)
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const back = () => {
        router.back()
    }

    const saldoExibicao =
        typeof box.currentBalance === 'object' && box.currentBalance !== null && 'value' in box.currentBalance
            ? (box.currentBalance as { value: number }).value
            : box.currentBalance

    return (
        <Layout>
            <Seo title="Participar da caixinha" />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
                }}
            >
                <Container maxWidth="sm">
                    <Card sx={{ p: 3, borderRadius: 4, boxShadow: 6 }}>
                        <CardContent>
                            <Stack spacing={3} alignItems="center" mb={2}>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                    <GroupIcon fontSize="large" />
                                </Avatar>
                                <Typography variant="h4" fontWeight={700} align="center">
                                    Participar da caixinha
                                </Typography>
                            </Stack>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" mb={3}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <GroupIcon color="action" />
                                    <Typography variant="subtitle1">
                                        {(box.members ?? []).length} membros
                                    </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <MonetizationOnIcon color="action" />
                                    <Typography variant="subtitle1">
                                        <DisplayValorMonetario>
                                            {saldoExibicao as number}
                                        </DisplayValorMonetario>
                                    </Typography>
                                </Stack>
                            </Stack>
                            <form onSubmit={handleSubmit} autoComplete="off">
                                <Stack spacing={2}>
                                    <FormControl fullWidth>
                                        <TextField
                                            name="nick"
                                            label="Nick"
                                            value={formData.nick}
                                            onChange={handleChange}
                                            required
                                            autoFocus
                                        />
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <TextField
                                            name="email"
                                            label="Email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormControl>
                                </Stack>
                                <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
                                    <Button variant="outlined" color="secondary" onClick={back} disabled={submitting}>
                                        Voltar
                                    </Button>
                                    <Button
                                        type="submit"
                                        color="primary"
                                        variant="contained"
                                        disabled={submitting}
                                        startIcon={submitting && <CircularProgress size={20} color="inherit" />}
                                    >
                                        {submitting ? 'Entrando...' : 'Entrar'}
                                    </Button>
                                </Stack>
                            </form>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </Layout>
    )
}