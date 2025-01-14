import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
    AttachMoney,
    ListAltSharp,
    Home,
    ShowChartOutlined,
    ChevronRight,
    ChevronLeft,
    CurrencyBitcoin,
    SavingsOutlined,
    Reddit,
    AssuredWorkload,
    FiberNew,
    Savings,
    AccountBalanceWallet,
    EmojiEvents
} from '@mui/icons-material';
import { Chip, Link } from '@mui/material';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const routes = [
    {
        text: 'Caixinhas',
        path: '/caixinhas-disponiveis',
        icon: <Savings />
    },
    {
        text: 'Novo emprestimo',
        path: '/emprestimo',
        icon: <FiberNew />
    },
    {
        text: 'Meus emprestimos',
        path: '/meus-emprestimos',
        icon: <AssuredWorkload />
    },
    {
        text: 'Novo Deposito',
        path: '/deposito',
        icon: <AttachMoney />
    },
    {
        text: 'Extrato',
        path: '/extrato',
        icon: <ListAltSharp />
    }
]

const carteiraRoutes = [
    {
        text: 'Carteira',
        path: '/carteira',
        icon: <ShowChartOutlined />
    },
    {
        text: 'Meus ativos',
        path: '/carteira/meus-ativos',
        icon: <AccountBalanceWallet />
    },
    {
        text: 'Novo aporte',
        path: '/carteira/aporte',
        icon: <SavingsOutlined />,
        newFeature: true
    },
    {
        text: 'Alt-Coins',
        path: '/token-market',
        icon: <CurrencyBitcoin />,
        newFeature: true
    },
    {
        text: 'NFT',
        path: '/web3/meus-nft',
        icon: <EmojiEvents />,
        newFeature: true
    }
]

const socialRoutes = [
    {
        text: 'Feed',
        path: 'feed',
        icon: <Reddit />,
        newFeature: true
    }
]

export default function MiniDrawer({ open, handleDrawerClose }: any) {
    const theme = useTheme()

    if (!open) {
        return <></>
    }

    return (
        <Drawer variant="permanent" open={open}>
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {routes.map((it, index) => (
                    <ListItem key={it.text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            LinkComponent={Link}
                            href={it.path}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                {it.icon}
                            </ListItemIcon>
                            <ListItemText primary={it.text} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {carteiraRoutes.map((it, index) => (
                    <ListItem key={it.text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            LinkComponent={Link}
                            href={it.path}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                {it.icon}
                            </ListItemIcon>
                            <ListItemText primary={it.text} sx={{ opacity: open ? 1 : 0 }} />
                            {it.newFeature && (
                                <Chip
                                    color="primary"
                                    label="New"
                                    size="small"
                                />
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {socialRoutes.map((it, index) => (
                    <ListItem key={it.text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            LinkComponent={Link}
                            href={it.path}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                {it.icon}
                            </ListItemIcon>
                            <ListItemText primary={it.text} sx={{ opacity: open ? 1 : 0 }} />
                            {it.newFeature && (
                                <Chip
                                    color="primary"
                                    label="New"
                                    size="small"
                                />
                            )}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['Home'].map((text, _index) => (
                    <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            LinkComponent={Link}
                            href="/"
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <Home />
                            </ListItemIcon>
                            <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}