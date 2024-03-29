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
    Typography
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

export default function Join() {
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
    }, [status])

    if (loading)
        return <CenteredCircularProgress />

    const handleSubmit = () => {
        const payload = {
            nick: formData.nick,
            email: formData.email,
            boxId: box.id
        }

        setLoading(true)
        joinABox(payload).then(() => {
            alert('Você é um membro dessa caixinha agora')
            router.back()
        }).catch(err => {
            toast.error(err.message)
            setLoading(false)
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
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack
                        spacing={3}
                        sx={{ mb: 3 }} >
                        <Typography variant="h4">
                            Participar da caixinha
                        </Typography>
                    </Stack>

                    <Stack spacing={4}>
                        <Card>
                            <CardContent>

                                <Grid item xs={12} md={6} sx={{ "& .MuiTextField-root": { my: 2 } }}>
                                    <Box mt={2} mb={2}>
                                        <p>Total de membros dessa caixinha {box.members.length}</p>
                                        <p>Valor atual
                                            <DisplayValorMonetario>
                                                {box.currentBalance.value}
                                            </DisplayValorMonetario>
                                        </p>
                                    </Box>
                                </Grid>

                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} md={6} sx={{ "& .MuiTextField-root": { my: 2 } }}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    name="nick"
                                                    label="Nick"
                                                    value={formData.nick}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                            <FormControl fullWidth>
                                                <TextField
                                                    name="email"
                                                    label="Email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    <Box display="flex" sx={{ my: 2 }} gap={2}>
                                        <Button variant="contained" color="secondary" onClick={back}>
                                            Voltar
                                        </Button>

                                        <Button
                                            type="submit"
                                            color="primary"
                                            variant="contained"
                                        >
                                            Entrar
                                        </Button>
                                    </Box>
                                </form>
                            </CardContent>
                        </Card>
                    </Stack>
                </Container>

            </Box>
        </Layout>
    )
}