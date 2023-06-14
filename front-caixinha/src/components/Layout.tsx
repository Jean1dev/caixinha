import { CssBaseline, Divider, ThemeProvider, styled } from "@mui/material";
import { TopNav } from "./top-nav";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { useEffect } from 'react';
import Hotjar from '@hotjar/browser';
import { AlertNav } from "./alert-nav";
import { SettingsConsumer, SettingsProvider } from "@/contexts/settings";
import { createTheme } from "@/theme/theme";
import { Head } from "next/document";
import { SettingsDrawer } from "./tema-configuracoes";

const SIDE_NAV_WIDTH = 100;

const LayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    [theme.breakpoints.up('lg')]: {
        paddingLeft: SIDE_NAV_WIDTH,
        paddingRight: SIDE_NAV_WIDTH
    },
    backgroundColor: theme.palette.background.default
}));

const LayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%',
});

const siteId = process.env.NEXT_PUBLIC_HOTJAR_ID
const hotjarVersion = 6

export default function Layout({ children }: { children: React.ReactNode }) {

    useEffect(() => {
        if (siteId) {
            let res = Hotjar.init(3503957, hotjarVersion);
            console.log('HOTJAR IS OK?', res)
            if (res) {
                res = Hotjar.event('Novo Acesso')
            }
        }
    }, [])

    return (
        <SettingsProvider>
            <SettingsConsumer>
                {(settings) => {
                    if (!settings.isInitialized) {
                        return <h1>Falha no carregamento</h1>
                    }

                    const theme = createTheme({
                        colorPreset: settings.colorPreset,
                        contrast: settings.contrast,
                        direction: settings.direction,
                        paletteMode: settings.paletteMode,
                        responsiveFontSizes: settings.responsiveFontSizes
                    });

                    return (
                        <ThemeProvider theme={theme}>
                            {/* <Head>
                                <meta
                                    name="color-scheme"
                                    content={settings.paletteMode}
                                />
                                <meta
                                    name="theme-color"
                                    content={theme.palette.neutral[900]}
                                />
                            </Head> */}
                            <CssBaseline />
                            <TopNav changeTheme={settings.handleDrawerOpen} />
                            <SettingsDrawer
                                canReset={settings.isCustom}
                                onClose={settings.handleDrawerClose}
                                onReset={settings.handleReset}
                                onUpdate={settings.handleUpdate}
                                open={settings.openDrawer}
                                values={{
                                    colorPreset: settings.colorPreset,
                                    contrast: settings.contrast,
                                    direction: settings.direction,
                                    paletteMode: settings.paletteMode,
                                    responsiveFontSizes: settings.responsiveFontSizes,
                                    stretch: settings.stretch,
                                    layout: settings.layout,
                                    navColor: settings.navColor
                                }}
                            />
                            <Divider />
                            <AlertNav />
                            <LayoutRoot>
                                <>
                                    <LayoutContainer>
                                        {children}
                                    </LayoutContainer>
                                    <ToastContainer />
                                </>
                            </LayoutRoot>
                        </ThemeProvider>
                    )
                }}
            </SettingsConsumer>
        </SettingsProvider>
    );
}