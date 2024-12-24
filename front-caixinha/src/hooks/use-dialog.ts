import { useCallback, useState } from 'react';

type HandleOpen<T = any> = (data: T) => void;

export function useDialog() {
    const [state, setState] = useState({
        open: false,
        data: undefined
    });

    const handleOpen: HandleOpen = useCallback((data) => {
        setState({
            open: true,
            data
        });
    }, []);

    const handleClose = useCallback(() => {
        setState({
            open: false,
            data: undefined
        });
    }, []);

    return {
        data: state.data,
        handleClose,
        handleOpen,
        open: state.open
    };
}
