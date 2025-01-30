import {
    Visibility,
    VisibilityOff,
    SettingsBrightness as SettingsBrightnessIcon,
    Menu as MenuIcon
} from "@mui/icons-material";

import {
    Box,
    Stack,
    IconButton,
    Tooltip,
    SvgIcon,
    Avatar
} from "@mui/material";

import { AccountPopover } from "./account-popover";
import ApplicationSelectCaixinha from "./application-select.caixinha";
import MiniDrawer from "./Drawer";
import { LanguageSwitch } from "./language-switch";
import { NotificationsButton } from "./notificacoes/notificacaoes-button";
import { usePopover } from "@/hooks/usePopover";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useState } from "react";

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNavLoggedIn = ({ settings }: { settings: any }) => {
    const accountPopover = usePopover()
    const { user } = useUserAuth()

    const [openMenu, setOpenMenu] = useState(false)

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
                            onClick={() => setOpenMenu(!openMenu)}
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}>
                            <MenuIcon
                                sx={{
                                    marginRight: 5,
                                    ...(openMenu && { display: 'none' }),
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
                                    {settings.showValoresMonetarios && <Visibility />}
                                    {!settings.showValoresMonetarios && <VisibilityOff />}
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
                open={openMenu}
                handleDrawerClose={() => setOpenMenu(false)}
            />
        </>
    );
}