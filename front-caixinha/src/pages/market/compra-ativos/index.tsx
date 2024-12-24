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

    const handleFiltersChange = useCallback((newFilters: any) => { }, [])
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

    useEffect(() => {
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

    return {
        state
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
    const rootRef = useRef(null)
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
        fetch('/api/trpc/ordem-compra-ativo',
            {
                method: 'POST',
                body: JSON.stringify({ ativo: dialog.data })
            })
            .then((res) => res.json())
            .then((data) => console.log(data));
        dialog.handleClose()
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
                        container={rootRef.current}
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