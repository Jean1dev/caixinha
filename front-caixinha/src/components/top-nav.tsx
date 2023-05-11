//import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import MenuIcon from '@mui/icons-material/Menu';
import {
    Avatar,
    Box,
    IconButton,
    Stack,
    SvgIcon,
    Typography,
    useMediaQuery
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AccountPopover } from './account-popover';
import { usePopover } from '@/hooks/usePopover';
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import MiniDrawer from './Drawer';

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = (props: any) => {
    const { onNavOpen } = props;
    const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
    const accountPopover = usePopover();
    const [open, setOpen] = useState(false);
    const { status } = useSession()
    const handleSignIn = async () => await signIn('keycloak')

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    if (status === 'authenticated') {
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
                            {!lgUp && (
                                <IconButton onClick={onNavOpen}>
                                    <SvgIcon fontSize="small">
                                        <HorizontalSplitIcon />
                                    </SvgIcon>
                                </IconButton>
                            )}
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
                            {/* <Tooltip title="Notifications">
                                <IconButton>
                                    <Badge
                                        badgeContent={4}
                                        color="success"
                                        variant="dot"
                                    >
                                        <SvgIcon fontSize="small">
                                            <NotificationsActiveIcon />
                                        </SvgIcon>
                                    </Badge>
                                </IconButton>
                            </Tooltip> */}
                            <Avatar
                                onClick={accountPopover.handleOpen}
                                ref={accountPopover.anchorRef}
                                sx={{
                                    cursor: 'pointer',
                                    height: 40,
                                    width: 40
                                }}
                                src="/assets/avatars/avatar-anika-visser.png"
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
