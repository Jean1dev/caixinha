import { CssBaseline, Divider, ThemeProvider } from "@mui/material";
import { TopNav } from "./top-nav";
import { SettingsConsumer, SettingsProvider } from "@/contexts/settings";
import { createTheme } from "@/theme/theme";
import { SettingsDrawer } from "./tema-configuracoes";
import { Toaster } from "./Toaster";
import CenteredCircularProgress from "./CenteredCircularProgress";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SettingsProvider>
            <SettingsConsumer>
                {(settings) => {
                    if (!settings.isInitialized) {
                        return <CenteredCircularProgress />
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