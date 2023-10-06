import { calcularAporte, getMinhasCarteiras } from "@/pages/api/api.carteira";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2';
import { useState, useCallback, useEffect } from "react"
import toast from "react-hot-toast";
import { Scrollbar } from "@/components/scrollbar";
import { INovoAporte, MetaComValorRecomendado, RecomendacaoAporteList } from "@/types/types";
import { useUserAuth } from "@/hooks/useUserAuth";
import { AporteModal } from "./aporte-modal";

interface INovoAporteState {
    valor: number
    carteira: string
    aporte: INovoAporte | null
}

export const NovoAporteForm = () => {
    const [state, setState] = useState<INovoAporteState>({ valor: 0, carteira: '', aporte: null })
    const [carteiras, setCarteiras] = useState<any[] | null>(null)
    const { user } = useUserAuth()
    const [openAporteModal, setOpenAporteModal] = useState(false)
    const [ativoSelecionado, setativoSelecionado] = useState<any>({})

    useEffect(() => {
        const name = user.name
        const email = user.email
        if (!name)
            return

        getMinhasCarteiras(name, email)
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
            if (event.target.name === 'carteira') {
                setOpenAporteModal(false)
            }
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
            .then((aporte: INovoAporte) => setState({ ...state, aporte }))
    }, [state])

    const aportar = useCallback((item: RecomendacaoAporteList) => {
        setOpenAporteModal(true)
        setativoSelecionado({
            ...item,
            text: `Aportando em ${item.ativo.ticker}`
        })
    }, [])

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
            {
                state.aporte && (
                    <>
                        <Card>
                            <CardHeader title="Sugestao de acordo com as metas" />
                            <Divider />
                            <Scrollbar>
                                <Table sx={{ minWidth: 700 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Tipo Ativo
                                            </TableCell>
                                            <TableCell>
                                                Percentual atual
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {state.aporte.metaComValorRecomendados.map((item: MetaComValorRecomendado, index: any) => {

                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Typography variant="subtitle2">
                                                            {item.tipoAtivo}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.valorRecomendado.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Scrollbar>
                        </Card>
                        <Divider />
                        <Card>
                            <CardHeader title="Sugestao de ativos" />
                            <Divider />
                            <Scrollbar>
                                <Table sx={{ minWidth: 700 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Ativo
                                            </TableCell>
                                            <TableCell>
                                                Percentual atual
                                            </TableCell>
                                            <TableCell>
                                                Sugestao
                                            </TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {state.aporte.recomendacaoAporteList.map((item: RecomendacaoAporteList, index: any) => {

                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Typography variant="subtitle2">
                                                            {item.ativo.ticker}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.ativo.percentualTotal.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.recomendacao.toFixed(2)}
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <Button onClick={() => aportar(item)}>
                                                            Aportar
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Scrollbar>
                        </Card>
                    </>
                )
            }
            <AporteModal
                onClose={() => setOpenAporteModal(false)}
                open={openAporteModal}
                to={ativoSelecionado.text}
                ativoAportando={ativoSelecionado}
            />
        </Stack>
    )
}