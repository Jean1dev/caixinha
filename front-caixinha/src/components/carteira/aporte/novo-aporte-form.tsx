import { calcularAporte, getMinhasCarteiras } from "@/pages/api/api.carteira";
import { Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2';
import { useState, useCallback, useEffect } from "react"
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export const NovoAporteForm = () => {
    const [state, setState] = useState<any>({ valor: 0 })
    const [carteiras, setCarteiras] = useState<any[] | null>(null)
    const { data: user } = useSession()

    useEffect(() => {
        if (!user?.user)
            return
        //@ts-ignore
        getMinhasCarteiras(user?.user?.name, user?.user?.email)
            .then(response => {
                setCarteiras(response)
                if (response.length > 0) {
                    setState((prevSate: any) => ({
                        ...prevSate,
                        carteira: response[0]['id']
                    }))
                }
            })
    }, [user])

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setState((prevState: any) => ({
                ...prevState,
                [event.target.name]: event.target.value
            }));
        },
        []
    );

    const calcular = useCallback(() => {
        toast.loading('Calculando')
        calcularAporte(state.carteira, state.valor)
            .then((response) => console.log(response))
    }, [state])

    return (
        <Stack spacing={4}>
            {
                carteiras != null && (
                    <Card>
                        <CardContent>

                            <Grid
                                container
                                spacing={3}
                            >
                                <Grid
                                    xs={12}
                                    md={4}
                                >
                                    <Typography variant="h6">
                                        Carteira
                                    </Typography>
                                </Grid>
                                <Grid
                                    xs={12}
                                    md={8}
                                >
                                    <Stack spacing={3}>
                                        <TextField
                                            fullWidth
                                            label="Carteira"
                                            name="carteira"
                                            onChange={handleChange}
                                            select
                                            value={state.carteira}
                                        >
                                            {carteiras.map((option) => (
                                                <MenuItem
                                                    key={option.id}
                                                    value={option.id}
                                                >
                                                    {option.nome}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                )
            }
            <Card>
                <CardContent>

                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            xs={12}
                            md={4}
                        >
                            <Typography variant="h6">
                                Quanto você vai investir? Coloque aqui seu aporte deste mês.
                            </Typography>
                        </Grid>
                        <Grid
                            xs={12}
                            md={8}
                        >
                            <Stack spacing={3}>
                                <TextField
                                    type="number"
                                    label="Valor"
                                    name="valor"
                                    onChange={handleChange}
                                    value={state.valor}
                                />
                                <Button
                                    onClick={calcular}
                                    type="button"
                                    variant="contained"
                                >
                                    Calcular
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

        </Stack>
    )
}