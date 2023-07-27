import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Button, Container, SvgIcon, Typography } from '@mui/material';
import { ArrowLeftOutlined } from '@mui/icons-material';

export default function ErrorPage() {
    return (
        <>
            <Head>
                <title>
                    404 | Caixinha
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexGrow: 1,
                    minHeight: '100%'
                }}
            >
                <Container maxWidth="md">
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Box
                            sx={{
                                mb: 3,
                                textAlign: 'center'
                            }}
                        >
                            <img
                                alt="Under development"
                                src="/assets/error-404.png"
                                style={{
                                    display: 'inline-block',
                                    maxWidth: '100%',
                                    width: 300
                                }}
                            />
                        </Box>
                        <Typography
                            align="center"
                            sx={{ mb: 3 }}
                            variant="h3"
                        >
                            404: Essa pagina não existe ou esta com algum problema
                        </Typography>
                        <Typography
                            align="center"
                            color="text.secondary"
                            variant="body1"
                        >
                            Você tentou alguma rota desconhecido ou veio aqui por engano.
                            Seja qual for, tente usar a navegação
                        </Typography>
                        <Button
                            component={NextLink}
                            href="/"
                            startIcon={(
                                <SvgIcon fontSize="small">
                                    <ArrowLeftOutlined />
                                </SvgIcon>
                            )}
                            sx={{ mt: 3 }}
                            variant="contained"
                        >
                            Voltar
                        </Button>
                    </Box>
                </Container>
            </Box>
        </>
    );

}