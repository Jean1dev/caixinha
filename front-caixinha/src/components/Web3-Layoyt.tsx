import { WalletContextProvider } from "@/contexts/web3/wallet-context";
import Layout from "./Layout";
import { Box, Divider, Stack } from "@mui/material";
import dynamic from "next/dynamic";
const WalletSelect = dynamic(() => import("./web3/wallet-select"), { ssr: false });

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

const Nav = () => (
    <Box
        component="header"
        sx={{
            backdropFilter: 'blur(6px)',
            backgroundColor: (theme) => theme.palette.background.default,//alpha(theme.palette.background.default, 0.2),
            position: 'sticky',
            left: {
                lg: `${SIDE_NAV_WIDTH}px`
            },
            top: 0,
            zIndex: (theme) => theme.zIndex.appBar
        }}
    >
        <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            spacing={2}
            sx={{
                minHeight: TOP_NAV_HEIGHT,
                px: 2
            }}
        >

            <Stack
                alignItems="center"
                direction="row"
                spacing={2}
            />
            <Stack
                alignItems="center"
                direction="row"
                spacing={2}
            >
                <WalletSelect />
            </Stack>

        </Stack>
    </Box>
)

export default function Web3Layout({ children }: { children: React.ReactNode }) {
    return (
        <Layout>
            <WalletContextProvider>
                <>
                    <Nav />
                    <Divider />
                    {children}
                </>
            </WalletContextProvider>
        </Layout>
    )
}