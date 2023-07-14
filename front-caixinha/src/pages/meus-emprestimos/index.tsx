import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { Filter, PlusOneOutlined } from '@mui/icons-material';
import Layout from '@/components/Layout';
import { EmprestimosFiltros } from '@/components/meus-emprestimos/filtros';
import { MeusEmprestmosListContainer } from '@/components/meus-emprestimos/meu-emprestimos-list-container';
import { MeusEmprestimosListSummary } from '@/components/meus-emprestimos/meus-emprestimos-list-summary';
import { MeuEmprestimosListTable } from '@/components/meus-emprestimos/meus-emprestimos-table';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getMeusEmprestimos } from '../api/api.service';
import { IMeusEmprestimos } from '@/types/types';
import CenteredCircularProgress from '@/components/CenteredCircularProgress';

export default function MeusEmprestimos() {
    const router = useRouter()
    const rootRef = useRef(null);

    const [items, setItems] = useState<any>()
    const [loading, setLoading] = useState(true)
    const { data: session } = useSession()

    const [group, setGroup] = useState(true);

    const lgUp = false
    const [openSidebar, setOpenSidebar] = useState(lgUp);

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
        if (!loading) {
            setLoading(true)
        }

        getMeusEmprestimos({ name: session?.user?.name, email: session?.user?.email }).then((data: IMeusEmprestimos) => {
            setItems(data)
            setLoading(false)
        }).catch(() => router.push('error'))
    }, [session])

    if (loading) {
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
                        filters={{}}
                        group={group}
                        onFiltersChange={() => {}}
                        onClose={handleFiltersClose}
                        onGroupChange={handleGroupChange}
                        open={openSidebar}
                    />
                    <MeusEmprestmosListContainer open={openSidebar} theme={undefined}>
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
                                items={items}
                                onPageChange={() => {}}
                                onRowsPerPageChange={() => {}}
                                page={1}
                                rowsPerPage={10}
                            />
                        </Stack>
                    </MeusEmprestmosListContainer>

                </Box>
            </Box>

        </Layout>
    );
};
