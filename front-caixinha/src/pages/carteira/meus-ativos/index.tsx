import CenteredCircularProgress from "@/components/CenteredCircularProgress";
import Layout from "@/components/Layout";
import { RouterLink } from "@/components/RouterLink";
import { Seo } from "@/components/Seo";
import { AtivosTable } from "@/components/carteira/meus-ativos/ativos-table";
import { MeusAtivosSearch } from "@/components/carteira/meus-ativos/meus-ativos-search";
import { useUserAuth } from "@/hooks/useUserAuth";
import { AtivoDto, MeusAtivosRequestFilter, SpringPage, getMeusAtivos, getMinhasCarteiras } from "@/pages/api/api.carteira";
import { AtivoCarteira } from "@/types/types";
import { PlusOneOutlined } from "@mui/icons-material";
import {
    Box,
    Container,
    Stack,
    Typography,
    Breadcrumbs,
    Button,
    SvgIcon,
    Card
} from "@mui/material";
import Link from '@mui/material/Link';
import { useCallback, useEffect, useState } from "react";

interface MeusAtivoStateType {
    ativos: AtivoCarteira[]
    page: number
    count: number
    rowsPerPage: number
}

export default function MeusAtivos() {
    const [state, setstate] = useState<MeusAtivoStateType>({
        ativos: [],
        page: 0,
        count: 10,
        rowsPerPage: 5
    })
    const [loading, setLoading] = useState(true)
    const [carteiras, setCarteiras] = useState<any>([])
    const [userFilters, setUserFilters] = useState({
        carteira: [],
        search: null,
        tipo: []
    })
    const { user } = useUserAuth()

    useEffect(() => {
        getMinhasCarteiras(user.name, user.email)
            .then((carteiras: any) => {
                if (carteiras.length > 0) {
                    getMeusAtivos({ page: 0, size: 5, carteiras: [carteiras[0]['id']], tipos: null })
                        .then((page: SpringPage<AtivoDto>) => {
                            setstate({
                                ativos: page.content,
                                page: page.pageable.pageNumber,
                                count: page.totalElements,
                                rowsPerPage: page.size
                            })

                            setCarteiras(carteiras)
                            setLoading(false)
                        })
                } else {
                    setLoading(false)
                }
            })
    }, [user])

    const reloadData = useCallback((params: MeusAtivosRequestFilter) => {
        getMeusAtivos(params)
            .then((page: SpringPage<AtivoDto>) => {
                setstate({
                    ativos: page.content,
                    page: page.pageable.pageNumber,
                    count: page.totalElements,
                    rowsPerPage: page.size
                })
            })
    }, [])

    const onFiltersChange = useCallback((filters: any) => {
        console.log(filters, new Date().toString())
        setUserFilters(filters)
        reloadData({ page: state.page, size: state.rowsPerPage, carteiras: filters.carteira, tipos: filters.tipo })
    }, [state])

    const onPageChange = (params: any) => {
        alert('onPageChange')
        console.log('onPageChange', params)
    }

    const onRowsPerPageChange = (params: any) => {
        const rows = params.target.value
        reloadData({ page: state.page, size: rows, carteiras: userFilters.carteira, tipos: userFilters.tipo })
    }

    if (loading) {
        return <CenteredCircularProgress />
    }

    return (
        <Layout>
            <Seo title="Meus ativos" />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={4}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={4}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    Meus Ativos
                                </Typography>
                                <Breadcrumbs separator={<Box
                                    sx={{
                                        backgroundColor: 'neutral.500',
                                        borderRadius: '50%',
                                        height: 4,
                                        width: 4
                                    }}
                                />}>
                                    <Link
                                        color="text.primary"
                                        component={RouterLink}
                                        href={'/'}
                                        variant="subtitle2"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        color="text.primary"
                                        component={RouterLink}
                                        href={'/carteira'}
                                        variant="subtitle2"
                                    >
                                        Carteira
                                    </Link>
                                    <Typography
                                        color="text.secondary"
                                        variant="subtitle2"
                                    >
                                        Ativos
                                    </Typography>
                                </Breadcrumbs>
                            </Stack>
                            <Stack
                                alignItems="center"
                                direction="row"
                                spacing={3}
                            >
                                <Button
                                    component={RouterLink}
                                    href={'/carteira/novo-ativo'}
                                    startIcon={(
                                        <SvgIcon>
                                            <PlusOneOutlined />
                                        </SvgIcon>
                                    )}
                                    variant="contained"
                                >
                                    Adicionar novo
                                </Button>
                            </Stack>
                        </Stack>
                        <Card>
                            <MeusAtivosSearch onFiltersChange={onFiltersChange} carteiras={carteiras} />
                            <AtivosTable
                                onPageChange={onPageChange}
                                onRowsPerPageChange={onRowsPerPageChange}
                                page={state.page}
                                items={state.ativos}
                                count={state.count}
                                rowsPerPage={state.rowsPerPage}
                            />
                        </Card>
                    </Stack>
                </Container>
            </Box>
        </Layout>
    );
}