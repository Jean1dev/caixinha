import { CssBaseline, Divider, ThemeProvider } from "@mui/material";
import { TopNav } from "./top-nav";
import { useEffect } from 'react';
import Hotjar from '@hotjar/browser';
import { AlertNav } from "./alert-nav";
import { SettingsConsumer, SettingsProvider } from "@/contexts/settings";
import { createTheme } from "@/theme/theme";
import { SettingsDrawer } from "./tema-configuracoes";
import { Toaster } from "./Toaster";

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
                            <TopNav settings={settings} />
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
                            <>
                                {children}
                                <Toaster />
                            </>
                        </ThemeProvider>
                    )
                }}
            </SettingsConsumer>
        </SettingsProvider>
    );
}