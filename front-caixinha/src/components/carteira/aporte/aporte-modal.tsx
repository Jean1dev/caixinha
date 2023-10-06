import { useCallback, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Portal from '@mui/material/Portal';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Attachment, Close, Image, Maximize, Minimize } from '@mui/icons-material';
import { aportarNoAtivo } from '@/pages/api/api.carteira';
import { LinearProgress } from '@mui/material';

export const AporteModal = (props: any) => {
    const {
        onClose,
        open = false,
        to,
        ativoAportando
    } = props;

    const [state, setState] = useState({
        valorAporte: ativoAportando.recomendacao,
        ativoAportando
    })
    const [loading, setLoading] = useState(false)
    const [maximize, setMaximize] = useState(false)

    const handleValorAporteChange = useCallback((event: any) => {
        setState({ ...state, valorAporte: event.target.value })
    }, [state]);

    const aportar = useCallback(() => {
        setLoading(true)
        aportarNoAtivo({
            id: state.ativoAportando.ativo?.id,
            valorAporte: state.valorAporte
        }).then(() => {
            setLoading(false)
            onClose()
        })
    }, [state])

    if (!open) {
        return null;
    }

    return (
        <Portal>
            <Backdrop open={maximize} />
            <Paper
                sx={{
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    margin: 3,
                    maxHeight: (theme) => `calc(100% - ${theme.spacing(6)})`,
                    maxWidth: (theme) => `calc(100% - ${theme.spacing(6)})`,
                    minHeight: 150,
                    outline: 'none',
                    position: 'fixed',
                    right: 0,
                    width: 600,
                    zIndex: 1400,
                    overflow: 'hidden',
                    ...(maximize && {
                        borderRadius: 0,
                        height: '100%',
                        margin: 0,
                        maxHeight: '100%',
                        maxWidth: '100%',
                        width: '100%'
                    })
                }}
                elevation={12}
            >
                {
                    loading && <LinearProgress />
                }
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        px: 2,
                        py: 1
                    }}
                >

                    <Typography variant="h6">
                        Novo aporte
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    {maximize
                        ? (
                            <IconButton onClick={() => setMaximize(false)}>
                                <SvgIcon>
                                    <Minimize />
                                </SvgIcon>
                            </IconButton>
                        )
                        : (
                            <IconButton onClick={() => setMaximize(true)}>
                                <SvgIcon>
                                    <Maximize />
                                </SvgIcon>
                            </IconButton>
                        )}
                    <IconButton onClick={onClose}>
                        <SvgIcon>
                            <Close />
                        </SvgIcon>
                    </IconButton>
                </Box>
                <Input
                    disableUnderline
                    fullWidth
                    placeholder="To"
                    sx={{
                        p: 1,
                        borderBottom: 1,
                        borderColor: 'divider'
                    }}
                    value={to}
                />
                <Input
                    disableUnderline
                    fullWidth
                    type="number"
                    onChange={handleValorAporteChange}
                    placeholder="Valor do aporte"
                    sx={{
                        p: 1,
                        borderBottom: 1,
                        borderColor: 'divider'
                    }}
                    value={state.valorAporte}
                />
                <Divider />
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                    sx={{ p: 2 }}
                >
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={1}
                    >
                        <Tooltip title="Attach image">
                            <IconButton size="small">
                                <SvgIcon>
                                    <Image />
                                </SvgIcon>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Attach file">
                            <IconButton size="small">
                                <SvgIcon>
                                    <Attachment />
                                </SvgIcon>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <div>
                        <Button disabled={loading} variant="contained" onClick={aportar}>
                            Aportar
                        </Button>
                    </div>
                </Stack>
            </Paper>
        </Portal>
    );
};
