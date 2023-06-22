import Layout from "@/components/Layout";
import { FormPerfil } from "@/components/perfil/form-perfil";
import { PerfilDaConta } from "@/components/perfil/perfil-conta";
import { Box, Container, Stack, Typography, Grid } from "@mui/material";
import { updatePerfil, uploadResource } from "../api/api.service";
import { useUserAuth } from "@/hooks/useUserAuth";
import { toast } from "react-hot-toast";

export interface IUser {
    name: string
    email: string
    photoUrl?: string
    phone?: string
    pix?: string
}

export default function Perfil() {
    const { user, updateUser } = useUserAuth()

    const updateProfile = (props: any) => {
        updatePerfil({
            memberName: user?.name,
            email: user?.email,
            user: {
                phone: user?.phone,
                pix: user?.pix,
                photoUrl: user?.photoUrl
            }
        }).then(() => {
            updateUser({
                name: props.firstName,
                email: props.email,
                phone: props.phone,
                pix: props.pix,
                photoUrl: user?.photoUrl
            })
            toast.success('Perfil atualizado')
        }).catch(e => {
            toast.error(e.message)
        })
    }

    const updatePhoto = () => {
        let input = document.createElement('input');
        input.type = 'file';

        input.addEventListener('change', function (event: any) {
            let arquivo = event.target.files[0];

            console.log('Arquivo selecionado:', arquivo);
            uploadResource(arquivo).then((fileUrl: string) => {
                //@ts-ignore
                updateUser({
                    ...user,
                    photoUrl: fileUrl
                })
                toast.success('Upload realizado')
            }).catch(e => toast.error(e.message))
        });

        input.click()
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
                                        <PerfilDaConta user={user} updatePhoto={updatePhoto} />
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