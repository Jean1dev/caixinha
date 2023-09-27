import {
    Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';

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
        <Alert onClose={() => { setShow(false) }} severity="error" variant='filled' sx={{


            backgroundColor: 'red',
            position: 'absolute',
            top: 65,


            zIndex: (theme) => theme.zIndex.appBar + 2
        }}>
            <strong>ATENÇÃO</strong> Você precisa <strong>selecionar</strong> uma caixinha!
        </Alert>
    )
};
