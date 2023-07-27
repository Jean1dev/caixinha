import { Fragment, useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { Scrollbar } from '@/components/scrollbar';
import { ChevronLeftOutlined, ChevronRight, Image, QueryStats } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import { AtivoCarteira } from '@/types/types';
import { DisplayTipoAtivo } from '../display-tipo-ativo';
import { atualizarAtivo, removerAtivo } from '@/pages/api/api.carteira';

export const AtivosTable = (props: any) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => { },
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0
    } = props;
    const [currentProduct, setCurrentProduct] = useState<any>(null);
    const [state, setState] = useState<any>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    }

    const detalhes = useCallback((ativo: any) => {
        const url = `https://br.tradingview.com/chart/?symbol=${ativo.localAlocado}`
        window.open(url, "_blank")
    }, [])

    const handleProductToggle = useCallback((productId: any) => {
        setCurrentProduct((prevProductId: any) => {
            if (prevProductId === productId) {
                return null;
            }

            return productId;
        });
    }, []);

    const handleProductClose = useCallback(() => {
        setCurrentProduct(null);
    }, []);

    const handleProductUpdate = useCallback(() => {
        atualizarAtivo({
            identificacao: currentProduct,
            nota: state.nota,
            quantidade: state.quantidade
        }).then(() => toast.success('Ativo atualizado'))
        setCurrentProduct(null);

    }, [currentProduct, state]);

    const handleProductDelete = useCallback(() => {
        removerAtivo(currentProduct)
            .then(() => toast.success('Ativo removido'))
            .catch((e: any) => {
                console.log(e)
                toast.error('Ocorreu um erro ao tentar remover esse ativo');
            })
        setCurrentProduct(null);

    }, [currentProduct]);

    return (
        <div>
            <Scrollbar>
                <Table sx={{ minWidth: 1200 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell width="25%">
                                Ticker
                            </TableCell>
                            <TableCell width="25%">
                                Nota
                            </TableCell>
                            <TableCell>
                                Tipo
                            </TableCell>
                            <TableCell>
                                Quantidade
                            </TableCell>
                            <TableCell align="right">
                                Ações
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((ativo: AtivoCarteira) => {
                            const isCurrent = ativo.id === currentProduct;
                            const notaColor = ativo.nota > 6
                                ? 'success'
                                : ativo.nota > 4
                                    ? 'info'
                                    : 'error'

                            return (
                                <Fragment key={ativo.id}>
                                    <TableRow
                                        hover
                                        key={ativo.id}
                                    >
                                        <TableCell
                                            padding="checkbox"
                                            sx={{
                                                ...(isCurrent && {
                                                    position: 'relative',
                                                    '&:after': {
                                                        position: 'absolute',
                                                        content: '" "',
                                                        top: 0,
                                                        left: 0,
                                                        backgroundColor: 'primary.main',
                                                        width: 3,
                                                        height: 'calc(100% + 1px)'
                                                    }
                                                })
                                            }}
                                            width="25%"
                                        >
                                            <IconButton onClick={() => handleProductToggle(ativo.id)}>
                                                <SvgIcon>
                                                    {isCurrent ? <ChevronLeftOutlined /> : <ChevronRight />}
                                                </SvgIcon>
                                            </IconButton>
                                        </TableCell>
                                        <TableCell width="25%">
                                            <Box
                                                sx={{
                                                    alignItems: 'center',
                                                    display: 'flex'
                                                }}
                                            >
                                                {ativo.image
                                                    ? (
                                                        <Box
                                                            sx={{
                                                                alignItems: 'center',
                                                                backgroundColor: 'neutral.50',
                                                                backgroundImage: `url(${ativo.image})`,
                                                                backgroundPosition: 'center',
                                                                backgroundSize: 'cover',
                                                                borderRadius: 1,
                                                                display: 'flex',
                                                                height: 80,
                                                                justifyContent: 'center',
                                                                overflow: 'hidden',
                                                                width: 80
                                                            }}
                                                        />
                                                    )
                                                    : (
                                                        <Box
                                                            sx={{
                                                                alignItems: 'center',
                                                                backgroundColor: 'neutral.50',
                                                                borderRadius: 1,
                                                                display: 'flex',
                                                                height: 80,
                                                                justifyContent: 'center',
                                                                width: 80
                                                            }}
                                                        >
                                                            <SvgIcon>
                                                                <Image />
                                                            </SvgIcon>
                                                        </Box>
                                                    )}
                                                <Box
                                                    sx={{
                                                        cursor: 'pointer',
                                                        ml: 2
                                                    }}
                                                >
                                                    <Typography variant="subtitle2">
                                                        {ativo.ticker}
                                                    </Typography>
                                                    <Typography
                                                        color="text.secondary"
                                                        variant="body2"
                                                    >
                                                        R${ativo.valorAtual}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell width="25%">
                                            <LinearProgress
                                                value={ativo.nota * 10}
                                                variant="determinate"
                                                color={notaColor}
                                                sx={{
                                                    height: 8,
                                                    width: 36
                                                }}
                                            />
                                            <Typography
                                                color="text.secondary"
                                                variant="body2"
                                            >
                                                {ativo.nota}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <DisplayTipoAtivo tipo={ativo.tipoAtivo} />
                                        </TableCell>
                                        <TableCell>
                                            {ativo.quantidade}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() => detalhes(ativo)}
                                            >
                                                <SvgIcon>
                                                    <QueryStats />
                                                </SvgIcon>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    {isCurrent && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                sx={{
                                                    p: 0,
                                                    position: 'relative',
                                                    '&:after': {
                                                        position: 'absolute',
                                                        content: '" "',
                                                        top: 0,
                                                        left: 0,
                                                        backgroundColor: 'primary.main',
                                                        width: 3,
                                                        height: 'calc(100% + 1px)'
                                                    }
                                                }}
                                            >
                                                <CardContent>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                    >
                                                        <Grid
                                                            item
                                                            md={6}
                                                            xs={12}
                                                        >
                                                            <Typography variant="h6">
                                                                Detalhes
                                                            </Typography>
                                                            <Divider sx={{ my: 2 }} />
                                                            <Grid
                                                                container
                                                                spacing={3}
                                                            >
                                                                <Grid
                                                                    item
                                                                    md={6}
                                                                    xs={12}
                                                                >
                                                                    <TextField
                                                                        defaultValue={ativo.ticker}
                                                                        fullWidth
                                                                        disabled
                                                                        label="Ticker"
                                                                        name="name"
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            md={6}
                                                            xs={12}
                                                        >
                                                            <Typography variant="h6">
                                                                informações editaveis
                                                            </Typography>
                                                            <Divider sx={{ my: 2 }} />
                                                            <Grid
                                                                container
                                                                spacing={3}
                                                            >
                                                                <Grid
                                                                    item
                                                                    md={6}
                                                                    xs={12}
                                                                >
                                                                    <TextField
                                                                        defaultValue={ativo.nota}
                                                                        value={state.nota}
                                                                        onChange={handleChange}
                                                                        fullWidth
                                                                        label="Nota"
                                                                        name="nota"
                                                                        type="number"
                                                                    />
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    md={6}
                                                                    xs={12}
                                                                >
                                                                    <TextField
                                                                        defaultValue={ativo.quantidade}
                                                                        fullWidth
                                                                        value={state.quantidade}
                                                                        onChange={handleChange}
                                                                        label="Quantidade"
                                                                        name="quantidade"
                                                                        InputProps={{
                                                                            startAdornment: (
                                                                                <InputAdornment position="start">

                                                                                </InputAdornment>
                                                                            )
                                                                        }}
                                                                        type="number"
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                                <Divider />
                                                <Stack
                                                    alignItems="center"
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    sx={{ p: 2 }}
                                                >
                                                    <Stack
                                                        alignItems="center"
                                                        direction="row"
                                                        spacing={2}
                                                    >
                                                        <Button
                                                            onClick={handleProductUpdate}
                                                            type="submit"
                                                            variant="contained"
                                                        >
                                                            Atualizar
                                                        </Button>
                                                        <Button
                                                            color="inherit"
                                                            onClick={handleProductClose}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </Stack>
                                                    <div>
                                                        <Button
                                                            onClick={handleProductDelete}
                                                            color="error"
                                                        >
                                                            Remover
                                                        </Button>
                                                    </div>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </Scrollbar>
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </div>
    );
};
