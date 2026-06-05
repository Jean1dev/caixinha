import Layout from "@/components/Layout";
import { Scrollbar } from "@/components/scrollbar";
import {
    Avatar,
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
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
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

    const isDeposito = (tipo: string) =>
        tipo?.toUpperCase().includes('DEPOSITO') || tipo?.toUpperCase().includes('DEPÓSITO')

    const statusColor = (s: string): 'warning' | 'success' | 'primary' | 'default' => {
        const lower = s?.toLowerCase()
        if (lower === 'pending' || lower === 'pendente') return 'warning'
        if (lower === 'completed' || lower === 'concluido' || lower === 'concluído') return 'success'
        if (lower === 'quitado') return 'primary'
        return 'default'
    }

    const statusLabel = (s: string) => {
        const lower = s?.toLowerCase()
        if (lower === 'completed') return 'Concluído'
        if (lower === 'pending') return 'Pendente'
        return s
    }

    const headerSx = {
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.5px',
        textTransform: 'uppercase' as const,
        color: 'text.secondary',
    }

    return (
        <Layout>
            <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        {/* Header */}
                        <Box>
                            <Typography
                                variant="overline"
                                color="text.secondary"
                                sx={{ letterSpacing: '0.5px', lineHeight: 2 }}
                            >
                                {t('extrato_filtros.movimentacoes') || 'Movimentações'}
                            </Typography>
                            <Typography variant="h4" fontWeight={700}>
                                {t('extrato')}
                            </Typography>
                        </Box>

                        {/* Filtros */}
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip
                                size="small"
                                label={somenteMeuFiltro ? t('extrato_filtros.todo_mundo') : t('extrato_filtros.somente_meu')}
                                variant={somenteMeuFiltro ? 'filled' : 'outlined'}
                                color={somenteMeuFiltro ? 'success' : 'default'}
                                onClick={() => { patchQuery({ meu: somenteMeuFiltro ? '0' : '1' }) }}
                                onDelete={() => { patchQuery({ meu: somenteMeuFiltro ? '0' : '1' }) }}
                                deleteIcon={somenteMeuFiltro ? <FilterAltOffIcon fontSize="small" /> : <FilterAltIcon fontSize="small" />}
                            />
                            <Chip
                                size="small"
                                label={depositosFiltro ? t('extrato_filtros.remover_depositos') : t('extrato_filtros.incluir_depositos')}
                                variant={depositosFiltro ? 'filled' : 'outlined'}
                                color={depositosFiltro ? 'success' : 'default'}
                                onClick={() => { patchQuery({ dep: depositosFiltro ? '0' : '1' }) }}
                                onDelete={() => { patchQuery({ dep: depositosFiltro ? '0' : '1' }) }}
                                deleteIcon={depositosFiltro ? <FilterAltOffIcon fontSize="small" /> : <FilterAltIcon fontSize="small" />}
                            />
                            <Chip
                                size="small"
                                label={emprestimosFiltro ? t('extrato_filtros.remover_emprestimos') : t('extrato_filtros.incluir_emprestimos')}
                                variant={emprestimosFiltro ? 'filled' : 'outlined'}
                                color={emprestimosFiltro ? 'success' : 'default'}
                                onClick={() => { patchQuery({ emp: emprestimosFiltro ? '0' : '1' }) }}
                                onDelete={() => { patchQuery({ emp: emprestimosFiltro ? '0' : '1' }) }}
                                deleteIcon={emprestimosFiltro ? <FilterAltOffIcon fontSize="small" /> : <FilterAltIcon fontSize="small" />}
                            />
                        </Stack>

                        {/* Tabela */}
                        <Card sx={{ width: '100%', borderRadius: 3, boxShadow: '0 5px 22px rgba(0,0,0,0.08)' }}>
                            <Scrollbar sx={{ flexGrow: 1 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={headerSx}>{t('operacao')}</TableCell>
                                            <TableCell sx={headerSx}>{t('membro')}</TableCell>
                                            <TableCell sx={headerSx} sortDirection="desc">{t('data')}</TableCell>
                                            <TableCell sx={{ ...headerSx, textAlign: 'right' }}>{t('value')}</TableCell>
                                            <TableCell sx={headerSx}>{t('status')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {isLoading
                                            ? Array.from({ length: 8 }).map((_, i) => (
                                                <TableRow key={`sk-${i}`}>
                                                    <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="50%" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="45%" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="40%" /></TableCell>
                                                    <TableCell><Skeleton variant="text" width="35%" /></TableCell>
                                                </TableRow>
                                            ))
                                            : linhas.map((order) => {
                                                const entrada = isDeposito(order.tipo)
                                                return (
                                                    <TableRow hover key={order.id}>
                                                        <TableCell>
                                                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                                                <Avatar
                                                                    sx={{
                                                                        width: 32,
                                                                        height: 32,
                                                                        bgcolor: entrada ? 'success.lightest' : 'warning.lightest',
                                                                    }}
                                                                >
                                                                    {entrada
                                                                        ? <ArrowDownwardIcon sx={{ fontSize: 18, color: 'success.dark' }} />
                                                                        : <ArrowUpwardIcon sx={{ fontSize: 18, color: 'warning.dark' }} />
                                                                    }
                                                                </Avatar>
                                                                <Typography variant="body2" fontWeight={600}>
                                                                    {order.tipo}
                                                                </Typography>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {order.nick}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {order.date}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.25 }}>
                                                                <Typography
                                                                    variant="body2"
                                                                    fontWeight={600}
                                                                    color={entrada ? 'success.dark' : 'text.primary'}
                                                                >
                                                                    {entrada ? '+' : '−'}
                                                                </Typography>
                                                                <DisplayValorMonetario
                                                                    variant="body2"
                                                                    fontWeight={600}
                                                                    color={entrada ? 'success.dark' : 'text.primary'}
                                                                >
                                                                    {order.valor}
                                                                </DisplayValorMonetario>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={statusLabel(order.status)}
                                                                size="small"
                                                                color={statusColor(order.status)}
                                                                variant="filled"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                    </TableBody>
                                </Table>
                            </Scrollbar>
                        </Card>

                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Pagination count={1} size="small" color="primary" shape="rounded" />
                        </Box>
                    </Stack>
                </Container>
            </Box>
        </Layout>
    )
}
