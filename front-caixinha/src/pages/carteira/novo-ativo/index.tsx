import Layout from "@/components/Layout";
import { RouterLink } from "@/components/RouterLink";
import { Seo } from "@/components/Seo";
import { NovoAtivoForm } from "@/components/carteira/novo-ativo/novo-ativo-form";
import { Box, Container, Stack, Typography, Breadcrumbs, Link } from "@mui/material";

export default function NovoAtivo() {
    return (
        <Layout>
            <Seo title="Novo Ativo" />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack spacing={1}>
                            <Typography variant="h4">
                                Adicionar novo ativo
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
                                    href={'/'}
                                    variant="subtitle2"
                                >
                                    Dashboard
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
                        <NovoAtivoForm/>
                    </Stack>
                </Container>
            </Box>
        </Layout>
    );
}