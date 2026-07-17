import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import {
    AttachMoney,
    ListAltSharp,
    Home,
    ShowChartOutlined,
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
    Dashboard,
} from '@mui/icons-material';
import { Avatar, Box, Chip, Divider, Link, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';

const drawerWidth = 320;

const routes = [
    { text: 'Caixinhas', path: '/caixinhas-disponiveis', icon: <Savings /> },
    { text: 'Novo emprestimo', path: '/emprestimo', icon: <FiberNew /> },
    { text: 'Meus emprestimos', path: '/meus-emprestimos', icon: <AssuredWorkload /> },
    { text: 'Novo Deposito', path: '/deposito', icon: <AttachMoney /> },
    { text: 'Extrato', path: '/extrato', icon: <ListAltSharp /> },
]

const carteiraRoutes = [
    { text: 'Carteira', path: '/carteira', icon: <ShowChartOutlined /> },
    { text: 'Meus ativos', path: '/carteira/meus-ativos', icon: <AccountBalanceWallet /> },
    { text: 'Novo aporte', path: '/carteira/aporte', icon: <SavingsOutlined />, newFeature: true, beta: true },
    { text: 'Alt-Coins', path: '/token-market', icon: <CurrencyBitcoin />, newFeature: true, beta: true },
    { text: 'NFT', path: '/web3/meus-nft', icon: <EmojiEvents />, newFeature: true, beta: false },
]

const socialRoutes = [
    { text: 'Feed', path: 'feed', icon: <Reddit />, newFeature: true, beta: false },
    { text: 'Chat', path: 'chat', icon: <ChatBubble />, newFeature: true, beta: true },
]

const CustomChips = ({ it }: { it: any }) => (
    <>
        {it.newFeature && <Chip color="primary" label="New" size="small" />}
        {it?.beta && <Chip color="warning" label="Beta" size="small" />}
    </>
)

const normalize = (p: string) => (p.startsWith('/') ? p : `/${p}`)

interface NavItemProps {
    text: string
    path: string
    icon: React.ReactNode
    active: boolean
    onClick?: () => void
    it?: any
}

const NavItem = ({ text, path, icon, active, onClick, it }: NavItemProps) => (
    <Link
        href={normalize(path)}
        onClick={onClick}
        underline="none"
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2.25,
            px: 2.5,
            py: 1.4,
            mx: 1.5,
            my: '2px',
            borderRadius: 3,
            cursor: 'pointer',
            fontSize: 15,
            fontWeight: active ? 600 : 500,
            color: active ? 'primary.dark' : 'text.primary',
            bgcolor: active ? 'primary.light' : 'transparent',
            transition: 'background .15s, color .15s',
            '&:hover': { bgcolor: active ? 'primary.light' : 'rgba(0,0,0,.04)' },
            '& .nav-icon': {
                display: 'flex',
                color: active ? 'primary.dark' : 'text.secondary',
                fontSize: 22,
            },
        }}
    >
        <Box className="nav-icon">{icon}</Box>
        <Box component="span" sx={{ flex: 1 }}>{text}</Box>
        {it && (it.newFeature || it.beta) && (
            <Stack direction="row" spacing={0.75} sx={{ ml: 'auto' }}>
                <CustomChips it={it} />
            </Stack>
        )}
    </Link>
)

export default function MiniDrawer(props: any) {
    const { open, handleDrawerClose } = props
    const router = useRouter()
    const { caixinha } = useCaixinhaSelect()

    const isActive = (path: string) => {
        const p = normalize(path)
        return router.pathname === p || router.pathname.startsWith(`${p}/`)
    }

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={handleDrawerClose}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    borderRight: 'none',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                },
            }}
        >
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: '20px 20px 12px' }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.light' }}>
                    <Box
                        component="img"
                        src="/assets/crypto/images/capicoin.png"
                        alt=""
                        sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                </Avatar>
                <Typography sx={{ fontWeight: 800, fontSize: 22, color: 'primary.main', flex: 1 }}>
                    Caixinha
                </Typography>
                <IconButton onClick={handleDrawerClose} size="small" sx={{ color: 'text.secondary' }}>
                    <ChevronLeft />
                </IconButton>
            </Stack>
            <Divider sx={{ borderColor: 'divider' }} />

            {/* Group 1 — caixinha */}
            <Box sx={{ py: 1 }}>
                {caixinha?.id && (
                    <NavItem
                        text="Minha caixinha"
                        path={`/caixinha/${caixinha.id}`}
                        icon={<Dashboard />}
                        active={router.pathname.startsWith('/caixinha/')}
                        onClick={handleDrawerClose}
                    />
                )}
                {routes.map((it) => (
                    <NavItem
                        key={it.path}
                        text={it.text}
                        path={it.path}
                        icon={it.icon}
                        active={isActive(it.path)}
                        onClick={handleDrawerClose}
                        it={it}
                    />
                ))}
            </Box>
            <Divider sx={{ borderColor: 'divider' }} />

            {/* Group 2 — carteira */}
            <Box sx={{ py: 1 }}>
                {carteiraRoutes.map((it) => (
                    <NavItem
                        key={it.path}
                        text={it.text}
                        path={it.path}
                        icon={it.icon}
                        active={isActive(it.path)}
                        onClick={handleDrawerClose}
                        it={it}
                    />
                ))}
            </Box>
            <Divider sx={{ borderColor: 'divider' }} />

            {/* Group 3 — social */}
            <Box sx={{ py: 1 }}>
                {socialRoutes.map((it) => (
                    <NavItem
                        key={it.path}
                        text={it.text}
                        path={it.path}
                        icon={it.icon}
                        active={isActive(it.path)}
                        onClick={handleDrawerClose}
                        it={it}
                    />
                ))}
            </Box>
            <Divider sx={{ borderColor: 'divider' }} />

            {/* Home */}
            <Box sx={{ py: 1 }}>
                <NavItem
                    text="Home"
                    path="/"
                    icon={<Home />}
                    active={router.pathname === '/'}
                    onClick={handleDrawerClose}
                />
            </Box>
        </Drawer>
    );
}
