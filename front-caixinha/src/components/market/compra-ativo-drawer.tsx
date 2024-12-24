import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Close } from '@mui/icons-material';
import { CompraAtivoDrawerDetails } from './compra-ativo-drawer-details';

export const CompraAtivoDrawer = (props) => {
    const { container, onClose, onApprove, open, data } = props;
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

    let content = null;

    if (data) {
        content = (
            <div>
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                        px: 3,
                        py: 2
                    }}
                >
                    <Typography
                        color="inherit"
                        variant="h6"
                    >
                        {data.codigo}
                    </Typography>
                    <IconButton
                        color="inherit"
                        onClick={onClose}
                    >
                        <SvgIcon>
                            <Close />
                        </SvgIcon>
                    </IconButton>
                </Stack>
                <Box
                    sx={{
                        px: 3,
                        py: 4
                    }}
                >
                    <CompraAtivoDrawerDetails
                        onApprove={onApprove}
                        onSave={() => {}}
                        onReject={onClose}
                        data={data}
                    />
                </Box>
            </div>
        );
    }

    if (lgUp) {
        return (
            <Drawer
                anchor="right"
                open={open}
                PaperProps={{
                    sx: {
                        position: 'relative',
                        width: 500
                    }
                }}
                SlideProps={{ container }}
                variant="persistent"
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            anchor="left"
            hideBackdrop
            ModalProps={{
                container,
                sx: {
                    pointerEvents: 'none',
                    position: 'absolute'
                }
            }}
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    maxWidth: '100%',
                    width: 400,
                    pointerEvents: 'auto',
                    position: 'absolute'
                }
            }}
            SlideProps={{ container }}
            variant="temporary"
        >
            {content}
        </Drawer>
    );
};