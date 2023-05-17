import { AlertColor } from '@mui/material';
import { useCallback, useState } from 'react';

export function useToastMessage() {

    const [type, setType]= useState<AlertColor>('success')
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)

    const toastError = useCallback((message: string) => {
        setMessage(message)
        setType('error')
        setOpen(true)
    }, [])

    const closeToast = useCallback(() => {
        setOpen(false)
    }, [])

    return [
        toastError,
        closeToast,
        open,
        message,
        type
    ] as const
}
