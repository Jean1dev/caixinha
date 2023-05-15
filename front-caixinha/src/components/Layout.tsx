import { ThemeProvider, styled } from "@mui/material";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useState } from "react";
import { TopNav } from "./top-nav";

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    [theme.breakpoints.up('lg')]: {
        paddingLeft: SIDE_NAV_WIDTH
    }
}));

const LayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%'
});

export default function Layout({ children }: { children: React.ReactNode }) {
    const [currentTheme, toggleCurrentTheme] = useAppTheme()
    const [openNav, setOpenNav] = useState(false);

    return (
        <ThemeProvider theme={currentTheme}>
            <TopNav onNavOpen={() => setOpenNav(true)} />
            {/* <SideNav
                onClose={() => setOpenNav(false)}
                open={openNav}
            /> */}
            <LayoutRoot>
                <LayoutContainer>
                    {children}
                </LayoutContainer>
            </LayoutRoot>
        </ThemeProvider>
    );

    // return (
    //     <ThemeProvider theme={currentTheme}>
    //         <AppBar
    //             position="fixed"
    //         >
    //             <Header
    //                 handleDrawerToggle={() => { }}
    //                 toggle={toggleCurrentTheme}
    //                 theme={currentTheme.palette.mode === "dark" ? "dark" : "light"}
    //             />
    //         </AppBar>
    //         <Container maxWidth="lg" sx={{ color: "white", my: 12 }}>
    //             {children}
    //         </Container>
    //     </ThemeProvider>
    // )
}