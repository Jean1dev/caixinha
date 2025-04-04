import Layout from "@/components/Layout";
import { Scrollbar } from "@/components/scrollbar";
import {
    Box,
    Container,
    Stack,
    Typography,
    Pagination,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip
} from "@mui/material";
import { useEffect, useState } from "react";
import { getExtrato } from "../api/api.service";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import CenteredCircularProgress from "@/components/CenteredCircularProgress";
import DisplayValorMonetario from "@/components/display-valor-monetario";
import { useTranslation } from "react-i18next";

export default function Extrato() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [somenteMeuFiltro, setSomenteMeuFiltro] = useState(false)
    const [depositosFiltro, setDepositosFiltro] = useState(true)
    const [emprestimosFiltro, setEmprestimosFiltro] = useState(true)
    const router = useRouter()
    const { data: user } = useSession()
    const { t } = useTranslation()

    useEffect(() => {
        setLoading(true)
        let params = {}
        if (router.query.id && !somenteMeuFiltro) {
            params = {
                depositos: depositosFiltro,
                emprestimos: emprestimosFiltro,
                caixinhaId: router.query.id
            }
        } else {
            params = {
                meuExtrato: somenteMeuFiltro,
                depositos: depositosFiltro,
                emprestimos: emprestimosFiltro,
                memberName: user?.user?.name
            }
        }

        getExtrato(params)
            .then(res => {
                setLoading(false)
                setData(res)
            })
            .catch(() => router.push('error'))
    }, [router, emprestimosFiltro, depositosFiltro, somenteMeuFiltro])

    return (
        <Layout>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    {t('extrato')}
                                </Typography>

                            </Stack>

                        </Stack>
                        <Card sx={{ p: 2, width: '100%' }}>
                            <Typography> {t('filtros')}</Typography>
                            <Chip
                                label={somenteMeuFiltro ? t('extrato_filtros.todo_mundo') : t('extrato_filtros.somente_meu')}
                                variant={somenteMeuFiltro ? 'filled' : 'outlined'}
                                color={somenteMeuFiltro ? 'success' : 'default'}
                                onClick={() => { setSomenteMeuFiltro(!somenteMeuFiltro) }}
                                onDelete={() => { setEmprestimosFiltro(!emprestimosFiltro) }}
                                deleteIcon={somenteMeuFiltro ? <FilterAltOffIcon /> : <FilterAltIcon />} />
                            <Chip
                                label={depositosFiltro ? t('extrato_filtros.remover_depositos') : t('extrato_filtros.incluir_depositos')}
                                variant={depositosFiltro ? 'filled' : 'outlined'}
                                color={depositosFiltro ? 'success' : 'default'}
                                onClick={() => { setDepositosFiltro(!depositosFiltro) }}
                                onDelete={() => { setDepositosFiltro(!depositosFiltro) }}
                                deleteIcon={depositosFiltro ? <FilterAltOffIcon /> : <FilterAltIcon />} />
                            <Chip
                                onClick={() => { setEmprestimosFiltro(!emprestimosFiltro) }}
                                onDelete={() => { setEmprestimosFiltro(!emprestimosFiltro) }}
                                label={emprestimosFiltro ? t('extrato_filtros.remover_emprestimos') : t('extrato_filtros.incluir_emprestimos')}
                                variant={emprestimosFiltro ? 'filled' : 'outlined'}
                                color={emprestimosFiltro ? 'success' : 'default'}
                                deleteIcon={emprestimosFiltro ? <FilterAltOffIcon /> : <FilterAltIcon />} />
                        </Card>
                        {
                            loading && <CenteredCircularProgress />
                        }
                        {
                            !loading && (
                                <Card sx={{ width: '100%' }}>
                                    <Scrollbar sx={{ flexGrow: 1 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        {t('operacao')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {t('membro')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {t('value')}
                                                    </TableCell>
                                                    <TableCell sortDirection="desc">
                                                        {t('data')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {t('status')}
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data.map((order: any) => {
                                                    return (
                                                        <TableRow
                                                            hover
                                                            key={order.id}
                                                        >
                                                            <TableCell>
                                                                {order.tipo}
                                                            </TableCell>
                                                            <TableCell>
                                                                {order.nick}
                                                            </TableCell>
                                                            <TableCell>
                                                                <DisplayValorMonetario>
                                                                    {order.valor}
                                                                </DisplayValorMonetario>
                                                            </TableCell>
                                                            <TableCell>
                                                                {order.date}
                                                            </TableCell>
                                                            <TableCell>
                                                                {order.status}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </Scrollbar>
                                </Card>
                            )
                        }
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <Pagination
                                count={1}
                                size="small"
                            />
                        </Box>
                    </Stack>
                </Container>
            </Box>
        </Layout>
    )
}