import {
    Box,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import React from 'react';
import { signIn, useSession } from 'next-auth/react';
import { LanguageSwitch } from './language-switch';
import { TopNavLoggedIn } from './top-nav-logged-in';

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = ({ settings }: { settings: any }) => {
    const { status } = useSession()
    const handleSignIn = async () => await signIn()

    if (status === 'authenticated') {
        return <TopNavLoggedIn settings={settings} />
    }

    return (
        <>
            <Box
                component="header"
                sx={{
                    backdropFilter: 'blur(6px)',
                    backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
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
                    >
                        <LanguageSwitch />
                        <IconButton
                            onClick={handleSignIn}
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}>
                            <Typography variant="overline">
                                Login
                            </Typography>

                        </IconButton>
                    </Stack>
                </Stack>
            </Box>
        </>
    );
};
