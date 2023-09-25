import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { CircularProgress, FormHelperText } from '@mui/material';
import { Caixinha } from '@/types/types';
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';
import { useSession } from 'next-auth/react';
import { AlertNav } from './alert-nav';
import { getMinhasCaixinhas } from '@/pages/api/caixinhas-disponiveis';

export default function ApplicationSelectCaixinha() {
    const { data } = useSession()
    const [nameCaixinhaSelected, setNameCaixinhaSelected] = React.useState('');
    const { caixinha, toggleCaixinha: setCaixinha } = useCaixinhaSelect()
    const [caixinhas, setCaixinhas] = React.useState<Caixinha[]>([])
    const [loading, setLoading] = React.useState(true)
    const [errorStyle, setErrorStyle] = React.useState(true)


    React.useEffect(() => {
        if (!data?.user?.name || !data?.user?.email) {
            return
        }

        const name = data.user.name
        const email = data.user.email

        getMinhasCaixinhas(name, email as string).then(caixinhas => {
            setCaixinhas(caixinhas)
            setLoading(false)
        })
    }, [data])


    React.useEffect(() => {
        const caixa = caixinhas.find(i => i.id === caixinha?.id)
        if (caixa) {
            setNameCaixinhaSelected(caixa.id)
            setErrorStyle(false);
        }

    }, [caixinha, caixinhas])

    const handleChange = (event: SelectChangeEvent) => {
        setNameCaixinhaSelected(event.target.value as string);
        setCaixinha(caixinhas.find(i => i.id === event.target.value))

    };

    if (loading) {
        return <CircularProgress />
    }

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth error={errorStyle}>
                <Select
                    value={nameCaixinhaSelected}
                    onChange={handleChange}
                >
                    {caixinhas.map((item, index) => (
                        <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                    ))}

                </Select>
                <FormHelperText>
                    <AlertNav />
                </FormHelperText>
            </FormControl>
        </Box>
    );
}