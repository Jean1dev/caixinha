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

export interface IUser {
    name: string
    email: string
    photoUrl?: string
    phone?: string
    pix?: string
}

const tabs = [
    { label: 'Geral', value: 'geral' },
];

export default function Perfil() {
    const [currentTab, setCurrentTab] = useState('geral');


    const handleTabsChange = useCallback((event: any, value: any) => {
        setCurrentTab(value);
    }, []);

    return (
        <Layout>
            <Seo title="Dashboard: Account" />
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
                            Detalhes da conta
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
                        <InformacoesGeraisPerfil
                        />
                    )}
                    {currentTab === 'billing' && (
                        <h1>progress</h1>
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
