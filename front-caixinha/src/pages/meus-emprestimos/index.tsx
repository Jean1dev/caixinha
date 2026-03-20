import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Filter, PlusOneOutlined } from '@mui/icons-material';
import Layout from '@/components/Layout';
import { EmprestimosFiltros } from '@/components/meus-emprestimos/filtros';
import { MeusEmprestmosListContainer } from '@/components/meus-emprestimos/meu-emprestimos-list-container';
import { MeusEmprestimosListSummary } from '@/components/meus-emprestimos/meus-emprestimos-list-summary';
import { MeuEmprestimosListTable } from '@/components/meus-emprestimos/meus-emprestimos-table';
import { useRouter } from 'next/router';
import CenteredCircularProgress from '@/components/CenteredCircularProgress';
import { useMeusEmprestimos } from '@/features/caixinha/hooks/useMeusEmprestimos';
import { filterMeusEmprestimos } from '@/features/caixinha/utils/filter-meus-emprestimos';

export default function MeusEmprestimos() {
    const router = useRouter()
    const theme = useTheme()
    const rootRef = useRef(null);
    const { items, isLoading, error } = useMeusEmprestimos()

    const [filters, setFilters] = useState<{ query?: string }>({})
    const filteredItems = useMemo(
        () => filterMeusEmprestimos(items, filters.query ?? ''),
        [items, filters.query]
    )

    const [group, setGroup] = useState(true);

    const lgUp = useMediaQuery(theme.breakpoints.up('lg'))
    const [openSidebar, setOpenSidebar] = useState(false)

    useEffect(() => {
        if (lgUp) {
            setOpenSidebar(true)
        }
    }, [lgUp])

    const handleGroupChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setGroup(event.target.checked);
    }, []);

    const handleFiltersToggle = useCallback(() => {
        setOpenSidebar((prevState) => !prevState);
    }, []);

    const handleFiltersClose = useCallback(() => {
        setOpenSidebar(false);
    }, []);

    useEffect(() => {
        if (error) {
            router.push('/error')
        }
    }, [error, router])

    if (isLoading) {
        return <CenteredCircularProgress/>
    }

    return (
        <Layout>
            <Divider />
            <Box
                component="main"
                sx={{
                    display: 'flex',
                    flex: '1 1 auto',
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                <Box
                    ref={rootRef}
                    sx={{
                        bottom: 0,
                        display: 'flex',
                        left: 0,
                        position: 'absolute',
                        right: 0,
                        top: 0
                    }}
                >

                    <EmprestimosFiltros
                        container={rootRef.current}
                        filters={filters}
                        group={group}
                        onFiltersChange={setFilters}
                        onClose={handleFiltersClose}
                        onGroupChange={handleGroupChange}
                        open={openSidebar}
                    />
                    <MeusEmprestmosListContainer open={openSidebar}>
                        <Stack spacing={4}>
                            <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                            >
                                <div>
                                    <Typography variant="h4">
                                        Meus Emprestimos
                                    </Typography>
                                </div>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={1}
                                >
                                    <Button
                                        color="inherit"
                                        startIcon={(
                                            <SvgIcon>
                                                <Filter />
                                            </SvgIcon>
                                        )}
                                        onClick={handleFiltersToggle}
                                    >
                                        Filtros
                                    </Button>
                                    <Button
                                        onClick={() => router.push('emprestimo')}
                                        startIcon={(
                                            <SvgIcon>
                                                <PlusOneOutlined />
                                            </SvgIcon>
                                        )}
                                        variant="contained"
                                    >
                                        Novo Emprestimo
                                    </Button>
                                </Stack>
                            </Stack>
                            <MeusEmprestimosListSummary data={items}/>
                            <MeuEmprestimosListTable
                                count={0}
                                group={group}
                                items={filteredItems}
                            />
                        </Stack>
                    </MeusEmprestmosListContainer>

                </Box>
            </Box>

        </Layout>
    );
};
