import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import MenuIcon from '@mui/icons-material/Menu';
import {
    Avatar,
    Box,
    IconButton,
    Stack,
    SvgIcon,
    Tooltip,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AccountPopover } from './account-popover';
import { usePopover } from '@/hooks/usePopover';
import React, { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import MiniDrawer from './Drawer';
import ApplicationSelectCaixinha from './application-select.caixinha';
import { useUserAuth } from '@/hooks/useUserAuth';
import { NotificationsButton } from './notificacoes/notificacaoes-button';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LanguageSwitch } from './language-switch';

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = ({ settings }: { settings: any }) => {
    
    const menuPopover = usePopover()
    const accountPopover = usePopover()
    const { status } = useSession()
    const { user } = useUserAuth()
    const handleSignIn = async () => await signIn()

    if (status === 'authenticated') {
        return (
            <>
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
                        // width: {
                        //     lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`
                        // },
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
                            <IconButton
                                onClick={menuPopover.handleOpen}
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}>
                                <MenuIcon
                                    sx={{
                                        marginRight: 5,
                                        ...(menuPopover.open && { display: 'none' }),
                                    }}
                                />
                            </IconButton>
                        </Stack>
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={2}
                        >
                            <ApplicationSelectCaixinha />
                            <LanguageSwitch />
                            <NotificationsButton />
                            <Tooltip title="Tema">
                                <IconButton onClick={settings.handleDrawerOpen}>
                                    <SvgIcon fontSize="small">
                                        <SettingsBrightnessIcon />
                                    </SvgIcon>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Mostrar valores" >
                                <IconButton onClick={settings.handleShowValoresMonetarios}>
                                    <SvgIcon fontSize="small">
                                        { settings.showValoresMonetarios && <Visibility/>}
                                        { !settings.showValoresMonetarios && <VisibilityOff/>}
                                    </SvgIcon>
                                </IconButton>
                            </Tooltip>
                            <Avatar
                                onClick={accountPopover.handleOpen}
                                ref={accountPopover.anchorRef}
                                sx={{
                                    cursor: 'pointer',
                                    height: 40,
                                    width: 40
                                }}
                                src={user?.photoUrl || "https://avatars.githubusercontent.com/u/11442261?v=4"}
                            />
                        </Stack>
                    </Stack>
                </Box>
                <AccountPopover
                    anchorEl={accountPopover.anchorRef.current}
                    open={accountPopover.open}
                    onClose={accountPopover.handleClose}
                />
                <MiniDrawer 
                    anchorEl={menuPopover.anchorRef.current}
                    keepMounted
                    open={menuPopover.open} 
                    handleDrawerClose={menuPopover.handleClose} 
                    />
            </>
        );
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
                    //   width: {
                    //     lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`
                    //   },
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
