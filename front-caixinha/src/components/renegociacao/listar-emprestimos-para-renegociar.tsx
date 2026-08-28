import { useEffect, useMemo, useState } from 'react'
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    CircularProgress,
    Stack,
    Typography,
} from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import DescriptionIcon from '@mui/icons-material/Description'
import ScheduleIcon from '@mui/icons-material/Schedule'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { useTranslation } from 'react-i18next'
import { useMeusEmprestimos } from '@/features/caixinha/hooks/useMeusEmprestimos'
import {
    brl,
    flattenEmprestimos,
    type EmprestimoView,
} from '@/features/caixinha/utils/flatten-emprestimos'

interface Props {
    emprestimoUidInicial?: string | null
    verProposta: (emprestimo: EmprestimoView) => void
    solicitando?: boolean
}

export const ListarEmprestimosParaRenegociar = ({
    emprestimoUidInicial,
    verProposta,
    solicitando = false,
}: Props) => {
    const { t } = useTranslation()
    const { items, isLoading, error } = useMeusEmprestimos()
    const [selectedUid, setSelectedUid] = useState<string | null>(null)

    const elegiveis = useMemo(
        () => flattenEmprestimos(items).filter((emprestimo) =>
            emprestimo.status === 'Atrasado' &&
            emprestimo.raw.approved &&
            !emprestimo.raw.isPaidOff &&
            Boolean(emprestimo.caixinhaId)
        ),
        [items]
    )

    useEffect(() => {
        if (
            selectedUid === null &&
            emprestimoUidInicial &&
            elegiveis.some((item) => item.uid === emprestimoUidInicial)
        ) {
            setSelectedUid(emprestimoUidInicial)
        }
    }, [emprestimoUidInicial, elegiveis, selectedUid])

    const selected = elegiveis.find((item) => item.uid === selectedUid) ?? null

    if (isLoading) {
        return (
            <Stack alignItems="center" spacing={2} sx={{ py: 6 }}>
                <CircularProgress size={32} />
                <Typography color="text.secondary">
                    {t('renegociacao.carregando_emprestimo')}
                </Typography>
            </Stack>
        )
    }

    if (error) {
        return (
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Typography color="error">
                        {t('renegociacao.erro_carregar_emprestimos')}
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    if (!elegiveis.length) {
        return (
            <Card variant="outlined" sx={{ borderRadius: 3, textAlign: 'center', py: 4 }}>
                <CardContent>
                    <AccountBalanceWalletIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        {t('renegociacao.nenhum_emprestimo_pendente')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('renegociacao.nenhum_emprestimo_descricao')}
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <Stack spacing={2.5}>
            <Typography color="text.secondary">
                {t('renegociacao.selecione_emprestimo_descricao')}
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                    gap: 2,
                }}
            >
                {elegiveis.map((emprestimo) => {
                    const active = emprestimo.uid === selectedUid
                    return (
                        <Card
                            key={emprestimo.uid}
                            variant="outlined"
                            sx={{
                                borderRadius: 3,
                                borderWidth: 2,
                                borderColor: active ? 'primary.main' : 'divider',
                                bgcolor: active ? 'primary.lightest' : 'background.paper',
                            }}
                        >
                            <CardActionArea
                                onClick={() => setSelectedUid(emprestimo.uid)}
                                aria-pressed={active}
                                sx={{ height: '100%', p: 0.5 }}
                            >
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Stack direction="row" justifyContent="space-between" spacing={2}>
                                            <Stack direction="row" spacing={1.5} minWidth={0}>
                                                <DescriptionIcon color="primary" />
                                                <Box minWidth={0}>
                                                    <Typography fontWeight={700} noWrap>
                                                        {emprestimo.raw.description || t('renegociacao.id_emprestimo')}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" noWrap>
                                                        {emprestimo.caixinha}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            <Chip size="small" color="error" label={t('renegociacao.atrasado')} />
                                        </Stack>

                                        <Stack direction="row" justifyContent="space-between" spacing={2}>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    {t('valor_solicitado')}
                                                </Typography>
                                                <Typography fontWeight={700}>{brl(emprestimo.valor)}</Typography>
                                            </Box>
                                            <Box textAlign="right">
                                                <Typography variant="caption" color="text.secondary">
                                                    {t('renegociacao.vencimento')}
                                                </Typography>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <ScheduleIcon sx={{ fontSize: 16, color: 'error.main' }} />
                                                    <Typography fontWeight={600}>{emprestimo.proxima || '—'}</Typography>
                                                </Stack>
                                            </Box>
                                        </Stack>

                                        <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                                            {t('renegociacao.id_emprestimo')}: {emprestimo.uid}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    )
                })}
            </Box>

            <Button
                variant="contained"
                size="large"
                disabled={!selected || solicitando}
                startIcon={solicitando ? <CircularProgress size={18} color="inherit" /> : <TrendingUpIcon />}
                onClick={() => selected && verProposta(selected)}
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-end' }, borderRadius: 2, textTransform: 'none' }}
            >
                {t('renegociacao.ver_proposta')}
            </Button>
        </Stack>
    )
}
