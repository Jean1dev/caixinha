import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { CircularProgress, FormHelperText, InputLabel } from '@mui/material';

const SELECT_ID = 'nav-caixinha-select'
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';
import { useSession } from 'next-auth/react';
import { AlertNav } from './alert-nav';
import { useMinhasCaixinhas } from '@/features/caixinha/hooks/useMinhasCaixinhas';

export default function ApplicationSelectCaixinha() {
    const { data } = useSession()
    const [nameCaixinhaSelected, setNameCaixinhaSelected] = React.useState('');
    const { caixinha, toggleCaixinha: setCaixinha } = useCaixinhaSelect()
    const { caixinhas, isLoading } = useMinhasCaixinhas()
    const [errorStyle, setErrorStyle] = React.useState(true)

    React.useEffect(() => {
        const caixa = caixinhas.find(i => i.id === caixinha?.id)
        if (caixa) {
            setNameCaixinhaSelected(caixa.id)
            setErrorStyle(false);
        }

    }, [caixinha, caixinhas])

    const handleChange = (event: SelectChangeEvent) => {
        const id = event.target.value as string
        setNameCaixinhaSelected(id)
        const next = caixinhas.find((i) => i.id === id)
        if (next) {
            setCaixinha(next)
        }
    };

    if (!data?.user?.name) {
        return null
    }

    if (isLoading) {
        return <CircularProgress />
    }

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth error={errorStyle}>
                <InputLabel id={`${SELECT_ID}-label`}>Caixinha</InputLabel>
                <Select
                    labelId={`${SELECT_ID}-label`}
                    id={SELECT_ID}
                    label="Caixinha"
                    value={nameCaixinhaSelected}
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Selecionar caixinha ativa' }}
                >
                    {caixinhas.map((item) => (
                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                    ))}

                </Select>
                <FormHelperText>
                    <AlertNav />
                </FormHelperText>
            </FormControl>
        </Box>
    );
}
