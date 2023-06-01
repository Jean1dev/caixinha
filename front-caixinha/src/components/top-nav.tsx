import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from '@mui/icons-material/Menu';
import {
    Avatar,
    Badge,
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
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import MiniDrawer from './Drawer';
import ApplicationSelectCaixinha from './application-select.caixinha';
import { useAppTheme } from '@/hooks/useAppTheme';

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = () => {
    const accountPopover = usePopover()
    const [open, setOpen] = useState(false)
    const { status } = useSession()
    const [theme, toggleTheme] = useAppTheme()
    const handleSignIn = async () => await signIn()

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

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
                                onClick={handleDrawerOpen}
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}>
                                <MenuIcon
                                    sx={{
                                        marginRight: 5,
                                        ...(open && { display: 'none' }),
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
                            <Tooltip title="Notifications">
                                <IconButton>
                                    <Badge
                                        badgeContent={0}
                                        color="success"
                                        variant="dot"
                                    >
                                        <SvgIcon fontSize="small">
                                            <NotificationsNoneIcon />
                                        </SvgIcon>
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Tema">
                                <IconButton onClick={toggleTheme}>
                                    <SvgIcon fontSize="small">
                                        {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
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
                                src="https://avatars.githubusercontent.com/u/11442261?v=4"
                            />
                        </Stack>
                    </Stack>
                </Box>
                <AccountPopover
                    anchorEl={accountPopover.anchorRef.current}
                    open={accountPopover.open}
                    onClose={accountPopover.handleClose}
                />
                <MiniDrawer open={open} handleDrawerClose={handleDrawerClose} />
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
                        <Tooltip title="Tema">
                            <IconButton onClick={toggleTheme}>
                                <SvgIcon fontSize="small">
                                    {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                                </SvgIcon>
                            </IconButton>
                        </Tooltip>
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
