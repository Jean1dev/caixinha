import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Container,
    InputAdornment,
    OutlinedInput,
    Stack,
    Typography,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import AccountBalance from '@mui/icons-material/AccountBalance';
import HourglassTop from '@mui/icons-material/HourglassTop';
import PendingActions from '@mui/icons-material/PendingActions';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { Seo } from '@/components/Seo';
import CenteredCircularProgress from '@/components/CenteredCircularProgress';
import { useMeusEmprestimos } from '@/features/caixinha/hooks/useMeusEmprestimos';
import { filterMeusEmprestimos } from '@/features/caixinha/utils/filter-meus-emprestimos';
import { flattenEmprestimos, brl } from '@/features/caixinha/utils/flatten-emprestimos';
import { StatCard } from '@/components/meus-emprestimos/stat-card';
import { EmprestimoListItem } from '@/components/meus-emprestimos/emprestimo-list-item';
import { EmprestimoDetail } from '@/components/meus-emprestimos/emprestimo-detail';

const Page = () => {
    const router = useRouter()
    const theme = useTheme()
    const lgUp = useMediaQuery(theme.breakpoints.up('lg'))

    const { items, isLoading, error } = useMeusEmprestimos()
    const [query, setQuery] = useState('')
    const [selected, setSelected] = useState<string | null>(null)

    const allLoans = useMemo(() => flattenEmprestimos(items), [items])
    const filteredLoans = useMemo(
        () => flattenEmprestimos(filterMeusEmprestimos(items, query)),
        [items, query]
    )

    // keep a valid selection whenever the filtered list changes
    useEffect(() => {
        if (!filteredLoans.length) {
            setSelected(null)
            return
        }
        if (!selected || !filteredLoans.some((l) => l.uid === selected)) {
            setSelected(filteredLoans[0].uid)
        }
    }, [filteredLoans, selected])

    useEffect(() => {
        if (error) {
            router.push('/error')
        }
    }, [error, router])

    if (isLoading) {
        return <CenteredCircularProgress />
    }

    const emAberto = allLoans.filter((l) => l.status !== 'Quitado').length
    const selectedLoan = filteredLoans.find((l) => l.uid === selected) ?? filteredLoans[0] ?? null

    const goToDetalhes = (uid: string) => router.push(`/detalhes-emprestimo/${uid}`)
    const goToRenegociar = (_uid: string) => router.push('/renegociacao')
    const onItemClick = (uid: string) => {
        if (lgUp) {
            setSelected(uid)
        } else {
            goToDetalhes(uid)
        }
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, minHeight: '100vh', py: 5 }}>
            <Container maxWidth="lg">
                <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: '.5px' }}>
                    Empréstimos
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, mb: 3 }}>
                    Meus empréstimos
                </Typography>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: 2.5,
                        mb: 3,
                    }}
                >
                    <StatCard over="Total emprestado" value={brl(items.totalGeral)} Icon={AccountBalance} />
                    <StatCard over="Empréstimos em aberto" value={String(emAberto)} Icon={HourglassTop} />
                    <StatCard over="Pendente aprovação" value={brl(items.totalPendente)} Icon={PendingActions} />
                </Box>

                {allLoans.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                            color: 'text.secondary',
                        }}
                    >
                        <Typography sx={{ mb: 2 }}>Você ainda não tem empréstimos.</Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddCircleOutline />}
                            onClick={() => router.push('/emprestimo')}
                            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
                        >
                            Pedir empréstimo
                        </Button>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', lg: '360px minmax(0, 1fr)' },
                            gap: 3,
                            alignItems: 'start',
                        }}
                    >
                        <Stack spacing={1.5}>
                            <OutlinedInput
                                fullWidth
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar empréstimo..."
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                }
                                sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
                            />
                            {filteredLoans.map((e) => (
                                <EmprestimoListItem
                                    key={e.uid}
                                    e={e}
                                    active={lgUp && e.uid === selectedLoan?.uid}
                                    onClick={onItemClick}
                                />
                            ))}
                            {filteredLoans.length === 0 && (
                                <Typography sx={{ color: 'text.secondary', fontSize: 14, py: 2, textAlign: 'center' }}>
                                    Nenhum empréstimo encontrado.
                                </Typography>
                            )}
                            <Button
                                variant="text"
                                startIcon={<AddCircleOutline />}
                                onClick={() => router.push('/emprestimo')}
                                sx={{ textTransform: 'none', fontWeight: 600, justifyContent: 'flex-start' }}
                            >
                                Pedir novo empréstimo
                            </Button>
                        </Stack>

                        {lgUp && selectedLoan && (
                            <EmprestimoDetail
                                e={selectedLoan}
                                onDetails={goToDetalhes}
                                onRenegociar={goToRenegociar}
                            />
                        )}
                    </Box>
                )}
            </Container>
        </Box>
    )
}

export default function MeusEmprestimos() {
    return (
        <Layout>
            <Seo title="Meus empréstimos" />
            <Page />
        </Layout>
    );
};
