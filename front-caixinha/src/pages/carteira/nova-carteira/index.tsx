import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { Seo } from '@/components/Seo';
import Layout from '@/components/Layout';
import { ArrowLeft } from '@mui/icons-material';
import { RouterLink } from '@/components/RouterLink';
import { NovaCarteiraResumo } from '@/components/carteira/nova-carteira-resumo';
import { NOvaCarteiraForm } from '@/components/carteira/nova-carteira-form';
import { useCallback, useState } from 'react';

export default function NovaCarteira() {
    const [activeChapter, setActiveChapter] = useState(0)
    const [carteira, setCarteira] = useState<any>({
        chapters: [
            {
                title: 'Informações basicas',
                description: 'Personalize sua carteira',
                step: 1
            },
            {
                title: 'Metas (Opcional)',
                description: 'Personalize suas metas',
                step: 2
            },
            {
                title: 'Ativos (Opcional)',
                description: 'Adicione seus ativos',
                step: 3
            }
        ],
        description: 'Crie uma nova carteira completa gerenciada',
        duration: '15 min',
        progress: 0,
        title: 'Nova Carteira'
    })

    const chapter = carteira.chapters[activeChapter];

    const changeChapter = useCallback((param: number) => {
        setActiveChapter(param)
        const progressoAtual = param > activeChapter
            ? carteira.progress + 33
            : carteira.progress - 33
        
        setCarteira({
            ...carteira,
            progress: progressoAtual
        })
    }, [carteira, activeChapter])

    return (
        <Layout>
            <Seo title="Nova Carteira" />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 3
                }}
            >
                <Container maxWidth="xl">
                    <Grid
                        container
                        spacing={4}
                    >
                        <Grid
                            xs={12}
                            md={4}
                        >
                            <Stack spacing={3}>
                                <div>
                                    <Link
                                        color="text.primary"
                                        component={RouterLink}
                                        href="/carteira"
                                        sx={{
                                            alignItems: 'center',
                                            display: 'inline-flex'
                                        }}
                                        underline="hover"
                                    >
                                        <SvgIcon sx={{ mr: 1 }}>
                                            <ArrowLeft />
                                        </SvgIcon>
                                        <Typography variant="subtitle2">
                                            Voltar
                                        </Typography>
                                    </Link>
                                </div>
                                <NovaCarteiraResumo
                                    activeChapter={activeChapter}
                                    course={carteira}
                                />
                            </Stack>
                        </Grid>
                        <Grid
                            xs={12}
                            md={8}
                        >
                            {chapter && <NOvaCarteiraForm chapter={chapter} setActiveChapter={changeChapter} />}
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};
