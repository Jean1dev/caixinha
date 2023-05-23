import { Divider, ThemeProvider, styled } from "@mui/material";
import { useAppTheme } from "@/hooks/useAppTheme";
import { TopNav } from "./top-nav";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { useEffect } from 'react';
import { hotjar } from 'react-hotjar'

const SIDE_NAV_WIDTH = 100;

const LayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    [theme.breakpoints.up('lg')]: {
        paddingLeft: SIDE_NAV_WIDTH,
        paddingRight: SIDE_NAV_WIDTH
    }
}));

const LayoutContainer = styled('div')({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%'
});

const HJID = process.env.HOTJAR_ID
const HJSV = 6

export default function Layout({ children }: { children: React.ReactNode }) {
    const [currentTheme] = useAppTheme()

    useEffect(() => {
        if (HJID) {
            //@ts-ignore
            hotjar.initialize(HJID, HJSV)
            console.log('HOTJAR IS OK')
        }
    }, [])

    return (
        <ThemeProvider theme={currentTheme}>
            <TopNav />
            <Divider />
            {/* <SideNav
                onClose={() => setOpenNav(false)}
                open={openNav}
            /> */}
            <LayoutRoot>
                <>
                    <LayoutContainer>
                        {children}
                    </LayoutContainer>
                    <ToastContainer />
                </>
            </LayoutRoot>
        </ThemeProvider>
    );
}