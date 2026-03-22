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
    Chip,
    Skeleton
} from "@mui/material";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import DisplayValorMonetario from "@/components/display-valor-monetario";
import { useTranslation } from "react-i18next";
import { useExtrato } from "@/features/caixinha/hooks/useExtrato";
import type { ExtratoQueryParams } from "@/features/caixinha/api/caixinha.types";

export default function Extrato() {
    const router = useRouter()
    const { data: user } = useSession()
    const { t } = useTranslation()

    const somenteMeuFiltro = router.isReady && router.query.meu === '1'
    const depositosFiltro = !router.isReady || router.query.dep !== '0'
    const emprestimosFiltro = !router.isReady || router.query.emp !== '0'

    const extratoParams = useMemo((): ExtratoQueryParams | null => {
        if (!router.isReady) return null
        const id = router.query.id
        const caixinhaId = typeof id === 'string' ? id : undefined
        return {
            depositos: depositosFiltro,
            emprestimos: emprestimosFiltro,
            somenteMeu: somenteMeuFiltro,
            caixinhaId,
            memberName: user?.user?.name,
        }
    }, [router.isReady, router.query.id, depositosFiltro, emprestimosFiltro, somenteMeuFiltro, user?.user?.name])

    const { linhas, isLoading, error } = useExtrato(extratoParams)

    const patchQuery = (patch: Record<string, string>) => {
        router.replace(
            {
                pathname: '/extrato',
                query: { ...router.query, ...patch },
            },
            undefined,
            { shallow: true }
        )
    }

    useEffect(() => {
        if (error) {
            router.push('/error')
        }
    }, [error, router])

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
                                onClick={() => { patchQuery({ meu: somenteMeuFiltro ? '0' : '1' }) }}
                                onDelete={() => { patchQuery({ emp: emprestimosFiltro ? '0' : '1' }) }}
                                deleteIcon={somenteMeuFiltro ? <FilterAltOffIcon /> : <FilterAltIcon />} />
                            <Chip
                                label={depositosFiltro ? t('extrato_filtros.remover_depositos') : t('extrato_filtros.incluir_depositos')}
                                variant={depositosFiltro ? 'filled' : 'outlined'}
                                color={depositosFiltro ? 'success' : 'default'}
                                onClick={() => { patchQuery({ dep: depositosFiltro ? '0' : '1' }) }}
                                onDelete={() => { patchQuery({ dep: depositosFiltro ? '0' : '1' }) }}
                                deleteIcon={depositosFiltro ? <FilterAltOffIcon /> : <FilterAltIcon />} />
                            <Chip
                                onClick={() => { patchQuery({ emp: emprestimosFiltro ? '0' : '1' }) }}
                                onDelete={() => { patchQuery({ emp: emprestimosFiltro ? '0' : '1' }) }}
                                label={emprestimosFiltro ? t('extrato_filtros.remover_emprestimos') : t('extrato_filtros.incluir_emprestimos')}
                                variant={emprestimosFiltro ? 'filled' : 'outlined'}
                                color={emprestimosFiltro ? 'success' : 'default'}
                                deleteIcon={emprestimosFiltro ? <FilterAltOffIcon /> : <FilterAltIcon />} />
                        </Card>
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
                                        {isLoading
                                            ? Array.from({ length: 8 }).map((_, i) => (
                                                <TableRow key={`sk-${i}`}>
                                                    <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="50%" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="40%" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="45%" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="35%" /></TableCell>
                                                </TableRow>
                                            ))
                                            : linhas.map((order) => (
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
                                            ))}
                                    </TableBody>
                                </Table>
                            </Scrollbar>
                        </Card>
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
