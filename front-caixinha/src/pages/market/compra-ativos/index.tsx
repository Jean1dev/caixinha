import Layout from "@/components/Layout";
import { AtivosListTable } from "@/components/market/ativos-list-table";
import { CompraAtivoDrawer } from "@/components/market/compra-ativo-drawer";
import { ContainerListagem } from "@/components/market/container-listagem";
import { ListagemSearch } from "@/components/market/listagem-search";
import { Seo } from "@/components/Seo";
import { useDialog } from "@/hooks/use-dialog";
import { useMounted } from "@/hooks/use-mounted";
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CompraApi from '@/pages/api/marketplace/api.compra'
import { getSession } from "next-auth/react";
import toast from "react-hot-toast";

interface AtivoStoreState {
    data: any[];
    dataCount: number;
}

interface AtivosSearchState {
    filters: {
        query?: string;
        status?: string;
    };
    page: number;
    rowsPerPage: number;
    sortBy: string;
    sortDir: string;
}

const useAtivosSearch = () => {
    const [state, setState] = useState<AtivosSearchState>({
        filters: {
            query: undefined,
            status: undefined
        },
        page: 0,
        rowsPerPage: 5,
        sortBy: 'createdAt',
        sortDir: 'desc'
    })

    const handleFiltersChange = useCallback((newFilters: any) => {
        setState((prevState) => ({
            ...prevState,
            filters: {
                ...prevState.filters,
                ...newFilters
            }
        }))
    }, [])

    const handleSortChange = useCallback((newSortBy: any) => { }, [])

    return {
        handleFiltersChange,
        handleSortChange,
        state
    }
}

const useAtivoStore = (searchState: AtivosSearchState) => {
    const isMounted = useMounted()
    const [state, setState] = useState<AtivoStoreState>({
        data: [],
        dataCount: 0,
    })

    const applyLocalFilters = useCallback((filterText: string) => {
        setState((prevState) => {
            const newData = prevState.data.filter((item) => item.nome.toLowerCase().includes(filterText.toLowerCase()))
            return {
                data: newData,
                dataCount: newData.length
            }
        })
    }, [])

    useEffect(() => {
        if (searchState.filters.query) {
            applyLocalFilters(searchState.filters.query)
            return
        }

        const fetchData = async () => {
            const data = await CompraApi.getListagemAtivos({})
            if (isMounted()) {
                setState({
                    data: data.map((item) => ({
                        ...item,
                        id: item.codigo
                    })),
                    dataCount: data.length
                })
            }
        }

        fetchData()
    }, [searchState])

    const removeByKey = useCallback((key: string) => {
        setState((prevState) => ({
            data: prevState.data.filter((item) => item.id !== key),
            dataCount: prevState.dataCount - 1
        }))
    }, [])

    return {
        state,
        removeByKey
    }
}

const useCurrentData = (data: any[], dataId: any) => {
    return useMemo(() => {
        if (!dataId) {
            return undefined
        }

        return data.find((item) => item.id === dataId)
    }, [data, dataId])
}

export default function ListagemAtivosCompraPage() {
    const rootRef = useRef<HTMLDivElement>(null);
    const ativosSearch = useAtivosSearch()
    const ativoStore = useAtivoStore(ativosSearch.state)
    const dialog = useDialog()
    const currentData = useCurrentData(ativoStore.state.data, dialog.data)

    const handleDataOpen = useCallback((dataId: string) => {
        if (dialog.open && dialog.data === dataId) {
            dialog.handleClose()
            return
        }

        dialog.handleOpen(dataId)
    }, [dialog])

    const onBuy = useCallback(async () => {
        const session = await getSession();
        const ticker = dialog.data
        fetch('/api/trpc/ordem-compra-ativo',
            {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ ativo: ticker }),
                headers: {
                    'Content-Type': 'application/json',
                    'email': session?.user?.email || '',
                    'user': session?.user?.name || '',
                },
            })
            .then((res) => res.json())
            .then(() => {
                toast.success('Ativo comprado com sucesso!')
                if (ticker) {
                    ativoStore.removeByKey(ticker);
                }
                dialog.handleClose()
            })
            .catch((error) => {
                console.error('Error buying ativo:', error);
                toast.error('Erro ao comprar ativo. Tente novamente mais tarde.');
            });
    }, [dialog])

    return (
        <Layout>
            <Seo title="Listagem de ativos para compra" />
            <Divider />
            <Box
                component="main"
                ref={rootRef}
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
                    <ContainerListagem open={dialog.open}>
                        <Box sx={{ p: 3 }}>
                            <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={4}
                            >
                                <div>
                                    <Typography variant="h4">
                                        Ativos para compra
                                    </Typography>
                                </div>
                            </Stack>
                        </Box>
                        <Divider />
                        <ListagemSearch
                            onFiltersChange={ativosSearch.handleFiltersChange}
                            onSortChange={ativosSearch.handleSortChange}
                            sortBy={ativosSearch.state.sortBy}
                            sortDir={ativosSearch.state.sortDir}
                        />
                        <Divider />
                        <AtivosListTable
                            count={ativoStore.state.dataCount}
                            items={ativoStore.state.data}
                            onPageChange={() => { }}
                            onRowsPerPageChange={() => { }}
                            onSelect={handleDataOpen}
                            page={ativosSearch.state.page}
                            rowsPerPage={ativosSearch.state.rowsPerPage}
                        />
                    </ContainerListagem>
                    <CompraAtivoDrawer
                        container={rootRef.current || undefined}
                        onClose={dialog.handleClose}
                        open={dialog.open}
                        data={currentData}
                        onApprove={onBuy}
                    />
                </Box>
            </Box>
        </Layout>
    )
}