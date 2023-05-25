import Layout from "@/components/Layout";
import { Box, Container, Stack, Typography, Grid } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DetalhesUser } from "../../components/emprestimos/detalhes-user";
import { GestaoEmprestimo } from "../../components/emprestimos/gestao-emprestimo";
import { PagamentoEmprestimo } from "../../components/emprestimos/pagamento-emprestimo";

export default function DetalhesEmprestimo() {
    const [isMeuEmprestimo, setMeuEmprestimo] = useState(false)
    const router = useRouter()
    const { data } = useSession()
    const { query: emprestimo } = router

    useEffect(() => {
        if (data?.user?.name === emprestimo.memberName) {
            setMeuEmprestimo(true)
        } else {
            setMeuEmprestimo(false)
        }
    }, [router, data])

    return (
        <Layout>
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
                                {isMeuEmprestimo ? 'Detalhes do seu emprestimo' : `Detalhes do emprestimo do ${emprestimo.memberName}`}
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
                                    <DetalhesUser user={{
                                        name: emprestimo.memberName
                                    }} />
                                </Grid>
                                <Grid
                                    xs={12}
                                    md={6}
                                    lg={8}
                                >
                                    <GestaoEmprestimo data={{
                                        //@ts-ignore
                                        emprestimo,
                                        meuEmprestimo: isMeuEmprestimo
                                    }} />
                                </Grid>
                            </Grid>

                            {isMeuEmprestimo && (
                                <Grid
                                    container
                                    spacing={3}
                                >
                                    <Grid
                                        xs={12}
                                        md={6}
                                        lg={4}
                                    >
                                    </Grid>
                                    <Grid
                                        xs={12}
                                        md={6}
                                        lg={8}
                                    >
                                        <PagamentoEmprestimo data={{
                                            //@ts-ignore
                                            emprestimo
                                        }} />
                                    </Grid>
                                </Grid>
                            )}

                        </div>
                    </Stack>
                </Container>
            </Box>
        </Layout>
    )
}