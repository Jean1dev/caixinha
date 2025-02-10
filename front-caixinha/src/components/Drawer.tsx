import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
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
    EmojiEvents,
    ChatBubble,
} from '@mui/icons-material';
import { Chip, Link } from '@mui/material';

const drawerWidth = 340;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

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
        newFeature: true,
        beta: true,
    },
    {
        text: 'Alt-Coins',
        path: '/token-market',
        icon: <CurrencyBitcoin />,
        newFeature: true,
        beta: true,
    },
    {
        text: 'NFT',
        path: '/web3/meus-nft',
        icon: <EmojiEvents />,
        newFeature: true,
        beta: false,
    }
]

const socialRoutes = [
    {
        text: 'Feed',
        path: 'feed',
        icon: <Reddit />,
        newFeature: true,
        beta: false,
    },
    {
        text: 'Chat',
        path: 'chat',
        icon: <ChatBubble />,
        newFeature: true,
        beta: true
    }
]

const CustomChips = ({ it }: { it: any }) => (
    <>
        {it.newFeature && (
            <Chip
                color="primary"
                label="New"
                size="small"
            />
        )}
        {it?.beta && (
            <Chip
                color="warning"
                label="Beta"
                size="small"
            />
        )}
    </>
)

export default function MiniDrawer(props: any) {
    const {
        open,
        handleDrawerClose,
    } = props
    const theme = useTheme()

    return (
        <Drawer
            anchor={'left'}
            open={open}
            onClose={handleDrawerClose}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {routes.map((it, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
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
                            <CustomChips it={it} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {carteiraRoutes.map((it, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
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
                            <CustomChips it={it} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {socialRoutes.map((it, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
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
                            <CustomChips it={it} />
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