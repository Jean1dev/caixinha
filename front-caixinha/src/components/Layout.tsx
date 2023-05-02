import { AppBar, Container, ThemeProvider } from "@mui/material";
import { Header } from "./Header";
import { useAppTheme } from "@/hooks/useAppTheme";

//const drawerWidth = 240

export default function Layout({ children }: { children: React.ReactNode }) {
    const [currentTheme, toggleCurrentTheme] = useAppTheme()

    return (
        <ThemeProvider theme={currentTheme}>
            <AppBar
                position="fixed"
            // sx={{
            //     width: { sm: `calc(100% - ${drawerWidth}px)` },
            //     ml: { sm: `${drawerWidth}px` },
            // }}
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