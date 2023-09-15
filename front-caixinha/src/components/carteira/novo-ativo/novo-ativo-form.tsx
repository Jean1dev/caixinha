import { criarAtivo, getListaSugestao, getMinhasCarteiras, getTipoAtivos } from "@/pages/api/api.carteira";
import {
    Button,
    Card,
    CardContent,
    FormControlLabel,
    MenuItem,
    Stack,
    Switch,
    TextField,
    Typography,
    Autocomplete
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2';
import { useState, useCallback, useEffect } from "react"
import { DisplayResumoNota } from "./display-resumo-nota";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export const NovoAtivoForm = () => {
    const [state, setState] = useState<any>({
        tipoAtivo: ''
    })
    const [sugestaoList, setSugestaoList] = useState<string[]>([])
    const [categoryOptions, setOptions] = useState<any[]>([])
    const [carteiras, setCarteiras] = useState<any[] | null>(null)
    const { data: user } = useSession()

    useEffect(() => {
        getTipoAtivos().then(ativos => {
            setOptions(Object.values(ativos['TipoAtivo']).map((it: any) => ({
                //@ts-ignore
                label: it[Object.keys(it)],
                value: Object.keys(it)[0]
            })))
        })
    }, [])

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
                        identificacaoCarteira: response[0]['id']
                    }))
                }
            })
    }, [user])

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        toast.loading('Enviando dados')
        criarAtivo({
            tipoAtivo: state.tipoAtivo,
            nota: state.nota,
            quantidade: state.quantidade,
            nome: state.nome,
            identificacaoCarteira: state.identificacaoCarteira,
            valorAtual: state.valorAtual
        })
            .then(() => {
                toast.success('Ativo adicionado')
                setState({
                    identificacaoCarteira: state.identificacaoCarteira,
                    tipoAtivo: ''
                })
            })
            .catch((e: Error) => {
                toast.error(e.message)
            })
    }

    const cancel = () => {
        setState({
            identificacaoCarteira: state.identificacaoCarteira,
            tipoAtivo: ''
        })
    }

    const updateSugestaoList = (query: string) => {
        getListaSugestao(query).then(data => setSugestaoList(data))
    }

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.name === 'nome')
                updateSugestaoList(event.target.value)

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
                                                name="identificacaoCarteira"
                                                onChange={handleChange}
                                                select
                                                value={state.identificacaoCarteira}
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
                                                <Autocomplete
                                                    freeSolo={true}
                                                    options={sugestaoList.map((i: string) => (i))}

                                                    renderInput={(params: any) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            label="Nome"
                                                            name="nome"
                                                            onChange={handleChange}
                                                            value={state.nome}
                                                        />
                                                    )}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Quantidade"
                                                    name="quantidade"
                                                    onChange={handleChange}
                                                    type="number"
                                                    value={state.quantidade}
                                                />
                                                {state.tipoAtivo === 'RENDA_FIXA' && (
                                                    <TextField
                                                        fullWidth
                                                        label="Valor atual"
                                                        name="valorAtual"
                                                        onChange={handleChange}
                                                        type="number"
                                                        value={state.valorAtual}
                                                    />
                                                )}
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
                                            <DisplayResumoNota tipoAtivo={state.tipoAtivo} changeNota={handleChange} />
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
                                <Button color="inherit" onClick={cancel}>
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