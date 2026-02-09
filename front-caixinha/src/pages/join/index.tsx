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
import { useSession } from "next-auth/react";
import CenteredCircularProgress from "@/components/CenteredCircularProgress";
import { toast } from "react-hot-toast";
import DisplayValorMonetario from "@/components/display-valor-monetario";
import { getCaixinhas } from "../api/caixinhas";
import { Seo } from "@/components/Seo";
import GroupIcon from '@mui/icons-material/Group';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useTheme } from '@mui/material/styles';

export default function Join() {
    const theme = useTheme();
    const { status, data } = useSession()
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        nick: '',
        email: ''
    })
    const [box, setBox] = useState<Caixinha>({
        members: [],
        currentBalance: 0,
        deposits: [],
        loans: [],
        id: ''
    })
    const [submitting, setSubmitting] = useState(false)

    const router = useRouter()

    useEffect(() => {
        getCaixinhas().then(caixinhas => {
            const box = caixinhas.find(c => c.id == router.query.id)
            if (box) {
                setBox(box)
                setLoading(false)
            }
        })
    }, [router.query.id])

    useEffect(() => {
        if (status === 'authenticated') {
            setFormData({
                nick: data.user?.name as string,
                email: data.user?.email as string
            })
        }
    }, [status, data.user?.email, data.user?.name])

    if (loading)
        return <CenteredCircularProgress />

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const payload = {
            nick: formData.nick,
            email: formData.email,
            boxId: box.id
        }
        setSubmitting(true)
        joinABox(payload).then(() => {
            alert('Você é um membro dessa caixinha agora')
            router.back()
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
        setLoading(true)
        router.back()
    }

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
                                        {box.members.length} membros
                                    </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <MonetizationOnIcon color="action" />
                                    <Typography variant="subtitle1">
                                        <DisplayValorMonetario>
                                            {box.currentBalance.value}
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