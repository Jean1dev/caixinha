import { Divider, ThemeProvider, styled } from "@mui/material";
import { useAppTheme } from "@/hooks/useAppTheme";
import { TopNav } from "./top-nav";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { useEffect } from 'react';
import Hotjar from '@hotjar/browser';
import { AlertNav } from "./alert-nav";

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

const siteId = process.env.NEXT_PUBLIC_HOTJAR_ID
const hotjarVersion = 6

export default function Layout({ children }: { children: React.ReactNode }) {
    const [currentTheme] = useAppTheme()

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
        <ThemeProvider theme={currentTheme}>
            <TopNav />
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
    );
}