import Layout from "@/components/Layout";
import {
    Avatar,
    Box,
    Button,
    Container,
    Divider,
    Link,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid,
    Card,
    CardContent,
    useTheme
} from "@mui/material";
import { useEffect, useState } from "react";
import { GestaoEmprestimo } from "@/components/emprestimos/gestao-emprestimo";
import { PagamentoEmprestimo } from "@/components/emprestimos/pagamento-emprestimo";
import { Seo } from "@/components/Seo";
import { ArrowBackIos, Download, Payment, History } from "@mui/icons-material";
import { LoansForApprove } from "@/types/types";
import { EmprestimoPdf } from "@/components/emprestimos/emprestimo-pdsf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { getEmprestimo, getMeusPagamentos } from "../api/api.service";
import { useRouter } from "next/router";
import CenteredCircularProgress from "@/components/CenteredCircularProgress";
import { getInitials } from "@/utils/utils";
import { useUserAuth } from "@/hooks/useUserAuth";

const DetalhesEmprestimo = () => {
    const [emprestimo, setEmprestimo] = useState<LoansForApprove | null>(null)
    const [isMeuEmprestimo, setMeuEmprestimo] = useState(false)
    const [meusPagamentos, setMeusPagamentos] = useState([])
    const [totalPagamentos, setTotalPagamentos] = useState(0)
    const { user } = useUserAuth()
    const router = useRouter()
    const theme = useTheme()

    useEffect(() => {
        if (user.name === emprestimo?.memberName) {
            setMeuEmprestimo(true)
        } else {
            setMeuEmprestimo(false)
        }
    }, [user, emprestimo])

    useEffect(() => {
        const { uid } = router.query
        if (!uid)
            return

        getEmprestimo(uid as string)
            .then(res => setEmprestimo(res))
            .catch(() => router.push('error'))
    }, [router])

    useEffect(() => {
        const { uid } = router.query
        if (!uid)
            return

        if (isMeuEmprestimo) {
            getMeusPagamentos(uid as string)
                .then(res => {
                    setMeusPagamentos(res)
                    setTotalPagamentos(res.reduce((acc: number, curr: any) => acc + curr.value, 0))
                })
                .catch(() => console.log('error'))
        }

    }, [isMeuEmprestimo, router])

    if (!emprestimo) {
        return <CenteredCircularProgress />
    }

    return (
        <>
            <Seo title="Detalhes emprestimo" />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                    backgroundColor: theme.palette.background.default
                }}
            >
                <Container maxWidth="lg">
                    <Stack spacing={4}>
                        <Link
                            color="text.primary"
                            component="a"
                            href={'meus-emprestimos'}
                            sx={{
                                alignItems: 'center',
                                display: 'inline-flex',
                                width: 'fit-content',
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                    borderRadius: 1
                                }
                            }}
                            underline="hover"
                        >
                            <SvgIcon sx={{ mr: 1 }}>
                                <ArrowBackIos />
                            </SvgIcon>
                            <Typography variant="subtitle2">
                                Voltar para seus empréstimos
                            </Typography>
                        </Link>

                        <Card elevation={3}>
                            <CardContent>
                                <Stack spacing={3}>
                                    <Stack
                                        alignItems="center"
                                        direction="row"
                                        justifyContent="space-between"
                                        spacing={2}
                                    >
                                        <Stack
                                            alignItems="center"
                                            direction="row"
                                            spacing={2}
                                        >
                                            <Avatar
                                                sx={{
                                                    height: 56,
                                                    width: 56,
                                                    bgcolor: theme.palette.primary.main
                                                }}
                                            >
                                                {getInitials(`${emprestimo.memberName}`)}
                                            </Avatar>
                                            <div>
                                                <Typography variant="h4" gutterBottom>
                                                    EMP659-7
                                                </Typography>
                                                <Typography
                                                    color="text.secondary"
                                                    variant="body1"
                                                >
                                                    {emprestimo.memberName}
                                                </Typography>
                                            </div>
                                        </Stack>

                                        <PDFDownloadLink
                                            document={<EmprestimoPdf emprestimo={emprestimo} />}
                                            fileName="invoice"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                startIcon={<Download />}
                                            >
                                                Baixar PDF
                                            </Button>
                                        </PDFDownloadLink>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>

                        {isMeuEmprestimo && (
                            <Grid container spacing={3}>
                                <Grid xs={12} md={6} lg={4}>
                                    <Card elevation={3}>
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <Typography variant="h6" color="primary">
                                                    Resumo do Empréstimo
                                                </Typography>
                                                <Stack spacing={1}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Valor Total
                                                    </Typography>
                                                    <Typography variant="h5">
                                                        R$ {Number(emprestimo.valueRequested).toFixed(2)}
                                                    </Typography>
                                                </Stack>
                                                <Stack spacing={1}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Total Pago
                                                    </Typography>
                                                    <Typography variant="h5" color="success.main">
                                                        R$ {totalPagamentos.toFixed(2)}
                                                    </Typography>
                                                </Stack>
                                                <Stack spacing={1}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Saldo Restante
                                                    </Typography>
                                                    <Typography variant="h5" color="error.main">
                                                        R$ {(Number(emprestimo.valueRequested) - totalPagamentos).toFixed(2)}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid xs={12} md={6} lg={8}>
                                    <Card elevation={3}>
                                        <CardContent>
                                            <Stack spacing={3}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Payment color="primary" />
                                                    <Typography variant="h6">
                                                        Realizar Pagamento
                                                    </Typography>
                                                </Stack>
                                                <PagamentoEmprestimo data={{
                                                    //@ts-ignore
                                                    emprestimo
                                                }} />
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}

                        <Card elevation={3}>
                            <CardContent>
                                <GestaoEmprestimo data={{
                                    emprestimo: emprestimo as unknown as LoansForApprove,
                                    meuEmprestimo: isMeuEmprestimo
                                }} />
                            </CardContent>
                        </Card>

                        {isMeuEmprestimo && (
                            <Card elevation={3}>
                                <CardContent>
                                    <Stack spacing={3}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <History color="primary" />
                                            <Typography variant="h6">
                                                Histórico de Pagamentos
                                            </Typography>
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{
                                                p: 2,
                                                backgroundColor: theme.palette.background.paper,
                                                borderRadius: 1
                                            }}
                                        >
                                            <Typography variant="subtitle1">
                                                Total Pago
                                            </Typography>
                                            <Typography variant="h6" color="success.main">
                                                R$ {totalPagamentos.toFixed(2)}
                                            </Typography>
                                        </Stack>
                                        <Stack
                                            divider={<Divider />}
                                            spacing={2}
                                        >
                                            {meusPagamentos.map((pagamento: any, index) => (
                                                <Stack
                                                    key={index}
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                    sx={{
                                                        p: 2,
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.action.hover,
                                                            borderRadius: 1
                                                        }
                                                    }}
                                                >
                                                    <Stack spacing={0.5}>
                                                        <Typography variant="subtitle2">
                                                            Pagamento #{index + 1}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {pagamento.date}
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant="h6" color="success.main">
                                                        R$ {pagamento.value.toFixed(2)}
                                                    </Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        )}
                    </Stack>
                </Container>
            </Box>
        </>
    )
}

export default function Page() {
    return (
        <Layout>
            <DetalhesEmprestimo />
        </Layout>
    )
}