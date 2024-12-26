//@ts-nocheck
import {
    Box,
    MenuItem,
    FormControl,
    FormHelperText,
    Select,
    IconButton,
    Stack,
    SvgIcon,
    Tooltip,
    Typography,
    Avatar
} from "@mui/material";
import {
    useWallet,
    Wallet as SolanaWallet,
} from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { AlertNav } from "../alert-nav";
import { CopyAllOutlined, LogoutOutlined } from "@mui/icons-material";

const TOP_NAV_HEIGHT = 64;

const truncatedPublicKey = (publicKey: string, length?: number) => {
    if (!publicKey) return;
    if (!length) {
        length = 5;
    }
    return publicKey.replace(publicKey.slice(length, 44 - length), '...');
};

const WalletSelect = () => {
    const { wallets, select, connected, publicKey, wallet, connect } = useWallet();

    const copyPublicKey = () => {
        navigator.clipboard.writeText(publicKey?.toBase58() || '');
        toast.success('Copied Address')
    };

    const onConnectWallet = async (wallet: SolanaWallet) => {
        try {
            select(wallet.adapter.name);
            await connect();
        } catch (e) {
            console.log("Wallet Error: ", e);
        }
    };

    const disconnect = async () => {
        if (wallet) {
            await wallet.adapter.disconnect();
        }
    }

    if (!connected && wallets) {
        return (
            <Box sx={{ minWidth: 220 }}>
                <FormControl fullWidth>
                    <Select
                        value={wallet}
                        onChange={onConnectWallet}
                    >
                        {wallets.map((wallet: SolanaWallet, index) => {
                            return (
                                <MenuItem
                                    key={index}
                                    onClick={async () => {
                                        try {
                                            onConnectWallet(wallet)
                                        } catch (e: any) {
                                            console.log(e)
                                        }
                                    }}
                                >
                                    <Box>
                                        <img
                                            width={50}
                                            loading="lazy"
                                            src={
                                                wallet.adapter.icon
                                            }
                                            alt={`${wallet.adapter.name} Icon`}
                                        />
                                        <span>{wallet.adapter.name}</span>
                                    </Box>
                                </MenuItem>
                            );
                        })}

                    </Select>
                    <FormHelperText>
                        <AlertNav />
                    </FormHelperText>
                </FormControl>
            </Box>
        )
    }

    return (
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
                    <IconButton onClick={copyPublicKey}>
                        <SvgIcon fontSize="small">
                            <CopyAllOutlined />
                        </SvgIcon>
                    </IconButton>
                </Tooltip>
                <IconButton
                    onClick={copyPublicKey}
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}>
                    <Typography variant="overline">
                        Copy Public Key
                    </Typography>
                </IconButton>

                <Tooltip title="Tema">
                    <IconButton onClick={() => { }}>
                        <SvgIcon fontSize="small">
                            <LogoutOutlined />
                        </SvgIcon>
                    </IconButton>
                </Tooltip>
                <IconButton
                    onClick={disconnect}
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}>
                    <Typography variant="overline">
                        Disconnect
                    </Typography>

                </IconButton>
                <Avatar
                    sx={{
                        cursor: 'pointer',
                        height: 40,
                        width: 40
                    }}
                    src={wallet?.adapter.icon}
                />
                <Typography variant="overline">
                    {truncatedPublicKey(publicKey!.toString(), 4)}
                </Typography>
            </Stack>
        </Stack>
    )
}

export default WalletSelect