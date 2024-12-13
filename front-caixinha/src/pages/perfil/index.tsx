import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { Seo } from '@/components/Seo';
import Layout from '@/components/Layout';
import { InformacoesGeraisPerfil } from '@/components/perfil2/informacoes-gerais-perfil';
import { InformacoesCaixinhas } from '@/components/perfil2/informacoes-caixinhas';
import { useTranslations } from '@/hooks/useTranlations';

export interface IUser {
    name: string
    email: string
    photoUrl?: string
    phone?: string
    pix?: string
}

const tabs = [
    { label: 'Geral', value: 'geral' },
    { label: 'Caixinhas', value: 'caixinhas' },
];

export default function Perfil() {
    const [currentTab, setCurrentTab] = useState('geral');
    const { t } = useTranslations()

    const handleTabsChange = useCallback((_event: any, value: any) => {
        setCurrentTab(value);
    }, []);

    return (
        <Layout>
            <Seo title={t.perfil.seo} />
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
                        sx={{ mb: 3 }}
                    >
                        <Typography variant="h4">
                            {t.perfil.detalhes}
                        </Typography>
                        <div>
                            <Tabs
                                indicatorColor="primary"
                                onChange={handleTabsChange}
                                scrollButtons="auto"
                                textColor="primary"
                                value={currentTab}
                                variant="scrollable"
                            >
                                {tabs.map((tab) => (
                                    <Tab
                                        key={tab.value}
                                        label={tab.label}
                                        value={tab.value}
                                    />
                                ))}
                            </Tabs>
                            <Divider />
                        </div>
                    </Stack>
                    {currentTab === 'geral' && (
                        <InformacoesGeraisPerfil/>
                    )}
                    {currentTab === 'caixinhas' && (
                        <InformacoesCaixinhas/>
                    )}
                    {currentTab === 'team' && (
                        <h1>progress</h1>
                    )}
                    {currentTab === 'notifications' && <h1>progress</h1>}
                    {currentTab === 'security' && (
                        <h1>progress</h1>
                    )}
                </Container>
            </Box>
        </Layout>
    );
};
