import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { CircularProgress } from '@mui/material';
import { getMinhasCaixinhas } from '@/pages/api/api.service';
import { Caixinha } from '@/types/types';
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';
import { useSession } from 'next-auth/react';

export default function ApplicationSelectCaixinha() {
    const { data } = useSession()
    const [nameCaixinhaSelected, setNameCaixinhaSelected] = React.useState('');
    const { caixinha, toggleCaixinha: setCaixinha } = useCaixinhaSelect()
    const [caixinhas, setCaixinhas] = React.useState<Caixinha[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        //@ts-ignore
        getMinhasCaixinhas(data?.user?.name, data?.user?.email).then(caixinhas => {
            setCaixinhas(caixinhas)
            setLoading(false)
        })
    }, [data])

    React.useEffect(() => {
        const caixa = caixinhas.find(i => i.id === caixinha?.id)
        if (caixa) {
            setNameCaixinhaSelected(caixa.id)
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
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Caixinha</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={nameCaixinhaSelected}
                    label="Age"
                    onChange={handleChange}
                >
                    {caixinhas.map((item, index) => (
                        <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}