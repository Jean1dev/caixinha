import Layout from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { RouterLink } from "@/components/RouterLink";
import { Link, Box, Container, Stack, Typography, Breadcrumbs } from "@mui/material";
import { NovoAporteForm } from "@/components/carteira/aporte/novo-aporte-form";

export default function Aporte() {
    return (
        <Layout>
            <Seo title="Novo Aporte" />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}>
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack spacing={1}>
                            <Typography variant="h4">
                                Novo aporte
                            </Typography>
                            <Breadcrumbs separator={<Box
                                sx={{
                                    backgroundColor: 'neutral.500',
                                    borderRadius: '50%',
                                    height: 4,
                                    width: 4
                                }}
                            />}>
                                <Link
                                    color="text.primary"
                                    component={RouterLink}
                                    href={'/carteira'}
                                    variant="subtitle2"
                                >
                                    Carteira
                                </Link>
                                <Link
                                    color="text.primary"
                                    component={RouterLink}
                                    href={'/carteira/meus-ativos'}
                                    variant="subtitle2"
                                >
                                    Meus ativos
                                </Link>
                                <Typography
                                    color="text.secondary"
                                    variant="subtitle2"
                                >
                                    Novo
                                </Typography>
                            </Breadcrumbs>
                        </Stack>
                        <NovoAporteForm />
                    </Stack>
                </Container>
            </Box>
        </Layout>
    )
}