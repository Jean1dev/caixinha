import {
    criarAtivo,
    getListaSugestao,
    getMinhasCarteiras,
    getTipoAtivos
} from "@/pages/api/api.carteira";
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
import { publicarPost } from "@/pages/api/api.service";
import { useTranslation } from 'react-i18next';

export const NovoAtivoForm = () => {
    const [state, setState] = useState<any>({
        tipoAtivo: ''
    })
    const { t } = useTranslation()

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
        toast.loading(t('loading'))

        criarAtivo({
            tipoAtivo: state.tipoAtivo,
            nota: state.nota,
            quantidade: state.quantidade,
            nome: state.nome,
            identificacaoCarteira: state.identificacaoCarteira,
            valorAtual: state.valorAtual
        })
            .then(() => {
                toast.success(t('carteira.ativo_add'))
                // if perfil.publicarAoInvestir = true
                publicarPost({
                    message: `Estou investindo em ${state.nome}`,
                    authorName: user?.user?.name as string,
                    authorAvatar: user?.user?.image as string
                })

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

    const updateSugestaoList = useCallback((query: string) => {
        getListaSugestao({
            query,
            crypto: state.tipoAtivo === 'CRYPTO'
        })
            .then(data => setSugestaoList(data))
    }, [state.tipoAtivo])

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setState((prevState: any) => {
                if (event.target.name === 'nome')
                    updateSugestaoList(event.target.value)

                return {
                    ...prevState,
                    [event.target.name]: event.target.value
                }
            });
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
                                            {t('carteira.carteira')}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        xs={12}
                                        md={8}
                                    >
                                        <Stack spacing={3}>
                                            <TextField
                                                fullWidth
                                                label={t('carteira.carteira')}
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
                                    {t('carteira.tipo_ativo')}
                                </Typography>
                            </Grid>
                            <Grid
                                xs={12}
                                md={8}
                            >
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label={t('carteira.tipo_ativo')}
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
                                                {t('carteira.info')}
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
                                                    onChange={(_, value) => setState({ ...state, nome: value })}
                                                    renderInput={(params: any) => (
                                                        <TextField
                                                            {...params}
                                                            fullWidth
                                                            label={t('nome')}
                                                            name="nome"
                                                            onChange={handleChange}
                                                            value={state.nome}
                                                        />
                                                    )}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label={t('quantidade')}
                                                    name="quantidade"
                                                    onChange={handleChange}
                                                    type="number"
                                                    value={state.quantidade}
                                                />
                                                {state.tipoAtivo === 'RENDA_FIXA' && (
                                                    <TextField
                                                        fullWidth
                                                        label={t('valor_atual')}
                                                        name="valorAtual"
                                                        onChange={handleChange}
                                                        type="number"
                                                        value={state.valorAtual}
                                                    />
                                                )}
                                                <div>
                                                    <FormControlLabel
                                                        control={<Switch defaultChecked />}
                                                        label={t('carteira.postar_automaticamente')}
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
                                                {t('carteira.diagrama')}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            xs={12}
                                            md={8}
                                        >
                                            <Stack spacing={3}>
                                                <TextField
                                                    fullWidth
                                                    label={t('carteira.nota')}
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
                                    {t('cancelar')}
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                >
                                    {t('salvar')}
                                </Button>
                            </Stack>
                        </>
                    )
                }
            </Stack>

        </form>
    )
}