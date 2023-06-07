import Layout from "@/components/Layout";
import { FormPerfil } from "@/components/perfil/form-perfil";
import { PerfilDaConta } from "@/components/perfil/perfil-conta";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Box, Container, Stack, Typography, Grid } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { updatePerfil } from "../api/api.service";

export interface IUser {
    name: string
    email: string
    photoUrl?: string
    phone?: string
    pix?: string
}

export default function Perfil() {
    const [user, setUser] = useLocalStorage<IUser | null>("caixinha-user1", null)
    const { data } = useSession()

    useEffect(() => {
        if (!user && data) {
            setUser({
                name: data?.user?.name || '',
                email: data?.user?.email || ''
            })
        }
    }, [user, data])

    const updateProfile = (props: any) => {
        updatePerfil({
            memberName: user?.name,
            email: user?.email,
            user: {
                phone: user?.phone,
                pix: user?.pix
            }
        }).then(() => {
            setUser({
                name: props.firstName,
                email: props.email,
                phone: props.phone,
                pix: props.pix
            })
            setTimeout(() => toast('Perfil atualizado', { hideProgressBar: true, autoClose: 4000, type: 'success', position: 'bottom-right' }), 50)
        }).catch(e => {
            setTimeout(() => toast(e.message, { hideProgressBar: true, autoClose: 4000, type: 'error', position: 'bottom-right' }), 50)
        })
    }

    return (
        <Layout>
            <>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        py: 8
                    }}
                >
                    <Container maxWidth="lg">
                        <Stack spacing={3}>
                            <div>
                                <Typography variant="h4">
                                    Sua conta
                                </Typography>
                            </div>
                            <div>
                                <Grid
                                    container
                                    spacing={3}
                                >
                                    <Grid
                                        xs={12}
                                        md={6}
                                        lg={4}
                                    >
                                        <PerfilDaConta user={user} />
                                    </Grid>
                                    <Grid
                                        xs={12}
                                        md={6}
                                        lg={8}
                                    >
                                        <FormPerfil updateProfile={updateProfile} user={user} />
                                    </Grid>
                                </Grid>
                            </div>
                        </Stack>
                    </Container>
                </Box>
            </>
        </Layout>
    )
}