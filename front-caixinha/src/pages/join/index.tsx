import Layout from "@/components/Layout";
import { Box, Button, FormControl, Grid, Paper, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCaixinhas, joinABox } from "../api/api.service";
import { Caixinha } from "@/types/types";

export default function Join() {
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
        id: ""
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

    if (loading)
        return <h1>Carregando</h1>

    const handleSubmit = () => {
        const payload = {
            nick: formData.nick,
            email: formData.email,
            boxId: box.id
        }

        setLoading(true)
        joinABox(payload).then(() => {
            alert('Agora voce é um membro dessa caixinha')
            router.back()
        }).catch(err => {
            alert('houve um problema cheque o log no console')
            console.log(err)
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
            <Box>
                <Paper>
                    <Box p={2}>
                        <Box mb={2}>
                            <Typography variant="h4">Join a box - {box.id}</Typography>
                        </Box>
                    </Box>

                    <Box p={2}>


                        <Grid item xs={12} md={6} sx={{ "& .MuiTextField-root": { my: 2 } }}>
                            <Box mt={2} mb={2}>
                                <p>Total de membros dessa caixinha {box.members.length}</p>
                                <p>Valor atual R${box.currentBalance.value}</p>
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
                                    Back
                                </Button>

                                <Button
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                >
                                    Join
                                </Button>
                            </Box>
                        </form>
                    </Box>

                </Paper>
            </Box>
        </Layout>
    )
}