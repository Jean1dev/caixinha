import * as React from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CssBaseline,
    Stack,
    ThemeProvider,
    Typography,
} from '@mui/material';
import Savings from '@mui/icons-material/Savings';
import AccountBalance from '@mui/icons-material/AccountBalance';
import ShowChart from '@mui/icons-material/ShowChart';
import { signIn } from 'next-auth/react';
import { createTheme } from '@/theme/theme';
import { Seo } from '@/components/Seo';

const FEATURES = [
    {
        icon: Savings,
        title: 'Caixinhas coletivas',
        desc: 'Junte dinheiro com amigos e acompanhe a meta de cada grupo.',
    },
    {
        icon: AccountBalance,
        title: 'Empréstimos da galera',
        desc: 'Peça e pague empréstimos financiados pela própria comunidade.',
    },
    {
        icon: ShowChart,
        title: 'Carteira e CapiCoin',
        desc: 'Invista, acompanhe seus ativos e a nova moeda da Caixinha.',
    },
]

// Standalone welcome screen shown to logged-out users (rendered outside Layout,
// so it carries its own indigo theme). CTAs kick off the next-auth sign-in flow.
export const Onboarding = () => {
    const theme = createTheme({
        colorPreset: 'indigo',
        contrast: 'normal',
        direction: 'ltr',
        paletteMode: 'light',
        responsiveFontSizes: true,
    })

    const handleStart = () => signIn()

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Seo title="Bem-vindo" />
            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: 'primary.lightest',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 3, md: 7 },
                }}
            >
                <Card
                    sx={{
                        width: '100%',
                        maxWidth: 880,
                        borderRadius: 5,
                        boxShadow: '0 5px 22px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    }}
                >
                    {/* Left — illustration panel */}
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2.25,
                            p: '40px 36px',
                            background: 'linear-gradient(160deg,#EBEEFE,#F5F7FF)',
                        }}
                    >
                        <Box
                            component="img"
                            src="/assets/person-standing.png"
                            alt=""
                            sx={{ width: 168 }}
                        />
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.25}
                            sx={{
                                bgcolor: '#fff',
                                borderRadius: 999,
                                px: 2,
                                py: 1,
                                boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                            }}
                        >
                            <Box
                                component="img"
                                src="/assets/crypto/images/capicoin.png"
                                alt=""
                                sx={{ width: 26, height: 26, objectFit: 'contain' }}
                            />
                            <Typography
                                sx={{ fontWeight: 700, fontSize: 15, color: 'primary.main' }}
                            >
                                CapiCoin chegou
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Right — copy + CTAs */}
                    <Box sx={{ p: { xs: '32px 24px', md: '44px 40px' }, display: 'flex', flexDirection: 'column' }}>
                        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 2.25 }}>
                            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.light' }}>
                                <Box
                                    component="img"
                                    src="/assets/crypto/images/capicoin.png"
                                    alt=""
                                    sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </Avatar>
                            <Typography sx={{ fontWeight: 800, fontSize: 20, color: 'primary.main' }}>
                                Caixinha
                            </Typography>
                        </Stack>

                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 700, fontSize: 32, lineHeight: 1.15, mb: 1.25 }}
                        >
                            Bem-vindo à Caixinha!
                        </Typography>
                        <Typography sx={{ fontSize: 15, color: 'text.secondary', mb: 3.25, lineHeight: 1.5 }}>
                            Sua poupança entre amigos com mais transparência, segurança e praticidade.
                        </Typography>

                        <Stack spacing={2.25} sx={{ mb: 3.75 }}>
                            {FEATURES.map((f) => {
                                const Icon = f.icon
                                return (
                                    <Stack key={f.title} direction="row" spacing={1.75} alignItems="flex-start">
                                        <Avatar sx={{ width: 42, height: 42, bgcolor: 'primary.light' }}>
                                            <Icon sx={{ fontSize: 22, color: 'primary.main' }} />
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                                                {f.title}
                                            </Typography>
                                            <Typography sx={{ fontSize: 13.5, color: 'text.secondary', mt: 0.25, lineHeight: 1.45 }}>
                                                {f.desc}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                )
                            })}
                        </Stack>

                        <Stack spacing={1.5} sx={{ mt: 'auto' }}>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={handleStart}
                                sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
                            >
                                Começar agora
                            </Button>
                            <Button
                                variant="text"
                                fullWidth
                                onClick={handleStart}
                                sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
                            >
                                Já tenho conta
                            </Button>
                        </Stack>
                    </Box>
                </Card>
            </Box>
        </ThemeProvider>
    );
};
