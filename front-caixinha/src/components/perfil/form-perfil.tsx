import { FormEvent, useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    TextField,
    Unstable_Grid2 as Grid
} from '@mui/material';
import { IUser } from '@/pages/perfil';

const states = [
    {
        value: 'CPF',
        label: 'CPF'
    },
    {
        value: 'Telefone',
        label: 'Telefone'
    },
    {
        value: 'Chave aleatoria',
        label: 'Chave aleatoria'
    },
    {
        value: 'CNPJ',
        label: 'CNPJ'
    }
];

export const FormPerfil = ({ user, updateProfile }: { user: IUser | null, updateProfile: Function }) => {
    const [values, setValues] = useState({
        firstName: '',
        lastName: 'Visser',
        email: '',
        phone: 'user?.phone',
        pix: '',
        state: 'CPF'
    });

    useEffect(() => {
        setValues({
            firstName: user?.name || '',
            lastName: 'Visser',
            email: user?.email || '',
            phone: user?.phone || '',
            pix: user?.pix || '',
            state: 'CPF'
        })
    }, [user])

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues((prevState) => ({
                ...prevState,
                [event.target.name]: event.target.value
            }));
        },
        []
    );

    const handleSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            updateProfile(values)
        },
        [values]
    );

    return (
        <form
            autoComplete="off"
            noValidate
            onSubmit={handleSubmit}
        >
            <Card>
                <CardHeader
                    subheader="A informação pode ser editada"
                    title="Perfil"
                />
                <CardContent sx={{ pt: 0 }}>
                    <Box sx={{ m: -1.5 }}>
                        <Grid
                            container
                            spacing={3}
                        >
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <TextField
                                    fullWidth
                                    helperText="Please specify the first name"
                                    label="Nome"
                                    name="firstName"
                                    disabled={true}
                                    onChange={handleChange}
                                    required
                                    value={values.firstName}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <TextField
                                    fullWidth
                                    label="Ultimo nome"
                                    name="lastName"
                                    onChange={handleChange}
                                    required
                                    value={values.lastName}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    disabled
                                    onChange={handleChange}
                                    required
                                    value={values.email}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <TextField
                                    fullWidth
                                    label="Telefone"
                                    name="phone"
                                    onChange={handleChange}
                                    type="number"
                                    value={values.phone}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <TextField
                                    fullWidth
                                    label="pix"
                                    name="pix"
                                    onChange={handleChange}
                                    required
                                    value={values.pix}
                                />
                            </Grid>
                            <Grid
                                xs={12}
                                md={6}
                            >
                                <TextField
                                    fullWidth
                                    label="Tipo de chave"
                                    name="state"
                                    onChange={handleChange}
                                    required
                                    select
                                    SelectProps={{ native: true }}
                                    value={values.state}
                                >
                                    {states.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button variant="contained" type="submit">
                        Salvar
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
};
