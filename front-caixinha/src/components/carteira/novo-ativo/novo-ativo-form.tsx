import { getTipoAtivos } from "@/pages/api/api.carteira";
import { Button, Card, CardContent, FormControlLabel, MenuItem, Stack, Switch, TextField, Typography } from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2';
import { useState, useCallback, useEffect } from "react"
import { DisplayResumoNota } from "./display-resumo-nota";
import { Diagrama } from "./diagrama";

export const NovoAtivoForm = () => {
    const [state, setState] = useState<any>({})
    const [categoryOptions, setOptions] = useState<any[]>([])

    useEffect(() => {
        getTipoAtivos().then(ativos => {
            setOptions(Object.values(ativos['TipoAtivo']).map((it: any) => ({
                //@ts-ignore
                label: it[Object.keys(it)],
                value: Object.keys(it)[0]
            })))
        })
    }, [])

    const handleSubmit = () => {
        alert('submited')
    }
    
    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setState((prevState: any) => ({
                ...prevState,
                [event.target.name]: event.target.value
            }));
        },
        []
    );

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
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
                                    Classificação do ativo
                                </Typography>
                            </Grid>
                            <Grid
                                xs={12}
                                md={8}
                            >
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Tipo"
                                        name="tipoAtivo"
                                        onChange={handleChange}
                                        select
                                        value={state.tipoAtivo}
                                    >
                                        {categoryOptions.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                {
                    state.tipoAtivo && (
                        <>
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
                                                Informações
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            xs={12}
                                            md={8}
                                        >
                                            <Stack spacing={3}>
                                                <TextField
                                                    fullWidth
                                                    label="Nome"
                                                    name="nome"
                                                    onChange={handleChange}
                                                    value={state.nome}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Quantidade"
                                                    name="quantidade"
                                                    onChange={handleChange}
                                                    type="number"
                                                    value={state.quantidade}
                                                />
                                                <div>
                                                    <FormControlLabel
                                                        control={<Switch defaultChecked />}
                                                        label="Postar automaticamente que estou investindo nesse ativo"
                                                    />
                                                </div>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
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
                                                Diagrama
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            xs={12}
                                            md={8}
                                        >
                                            <Stack spacing={3}>
                                                <TextField
                                                    fullWidth
                                                    label="Nota"
                                                    name="nota"
                                                    onChange={handleChange}
                                                    type="number"
                                                    value={state.nota}
                                                />
                                            </Stack>
                                            <DisplayResumoNota />
                                            <Diagrama/>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                            <Stack
                                alignItems="center"
                                direction="row"
                                justifyContent="flex-end"
                                spacing={1}
                            >
                                <Button color="inherit">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                >
                                    Create
                                </Button>
                            </Stack>
                        </>
                    )
                }
            </Stack>

        </form>
    )
}