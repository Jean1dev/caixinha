import {
    Box,
    Stack,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';
import { ArrowUpward } from '@mui/icons-material';

const TOP_NAV_HEIGHT = 34;

export const AlertNav = () => {
    const { status } = useSession()
    const { caixinha } = useCaixinhaSelect()
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (status != 'authenticated')
            return

        if (!caixinha)
            setShow(true)
        else
            setShow(false)

    }, [status, caixinha])

    if (!show) {
        return <></>
    }

    return (
        <>
            <Box
                component="header"
                sx={{
                    backdropFilter: 'blur(6px)',
                    backgroundColor: 'red',
                    position: 'sticky',
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
                        <Typography> Atenção você precisa selecionar uma caixinha para fazer as operações</Typography>
                    </Stack>
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                    >
                        <ArrowUpward />
                        <ArrowUpward />
                        <ArrowUpward />
                        <ArrowUpward />
                        <ArrowUpward />
                        <ArrowUpward />
                        <ArrowUpward />
                        <ArrowUpward />
                        <ArrowUpward />
                    </Stack>
                </Stack>
            </Box>
        </>
    )
};
