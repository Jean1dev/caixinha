import { AppBar, Container, ThemeProvider } from "@mui/material";
import { Header } from "./Header";
import { useAppTheme } from "@/hooks/useAppTheme";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [currentTheme, toggleCurrentTheme] = useAppTheme()

    return (
        <ThemeProvider theme={currentTheme}>
            <AppBar
                position="fixed"
            >
                <Header
                    handleDrawerToggle={() => { }}
                    toggle={toggleCurrentTheme}
                    theme={currentTheme.palette.mode === "dark" ? "dark" : "light"}
                />
            </AppBar>
            <Container maxWidth="lg" sx={{ color: "white", my: 12 }}>
                {children}
            </Container>
        </ThemeProvider>
    )
}