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
    Unstable_Grid2 as Grid
} from "@mui/material";
import { useEffect, useState } from "react";
import { GestaoEmprestimo } from "@/components/emprestimos/gestao-emprestimo";
import { PagamentoEmprestimo } from "@/components/emprestimos/pagamento-emprestimo";
import { RouterLink } from "@/components/RouterLink";
import { Seo } from "@/components/Seo";
import { ArrowBackIos } from "@mui/icons-material";
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
                    py: 8
                }}
            >
                <Container maxWidth="lg">

                    <Stack
                        divider={<Divider />}
                        spacing={4}
                    >
                        <Stack spacing={4}>
                            <div>
                                <Link
                                    color="text.primary"
                                    component={RouterLink}
                                    href={'meus-emprestimos'}
                                    sx={{
                                        alignItems: 'center',
                                        display: 'inline-flex'
                                    }}
                                    underline="hover"
                                >
                                    <SvgIcon sx={{ mr: 1 }}>
                                        <ArrowBackIos />
                                    </SvgIcon>
                                    <Typography variant="subtitle2">
                                        Seus emprestimos
                                    </Typography>
                                </Link>
                            </div>
                            <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={4}
                            >

                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={2}
                                >
                                    <Avatar
                                        sx={{
                                            height: 42,
                                            width: 42
                                        }}
                                    >
                                        {getInitials(`${emprestimo.memberName}`)}
                                    </Avatar>
                                    <div>
                                        <Typography variant="h4">
                                            EMP659-7
                                        </Typography>
                                        <Typography
                                            color="text.secondary"
                                            variant="body2"
                                        >
                                            {emprestimo.memberName}
                                        </Typography>
                                    </div>
                                </Stack>

                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={2}
                                >

                                    <PDFDownloadLink
                                        document={<EmprestimoPdf emprestimo={emprestimo} />}
                                        fileName="invoice"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Button
                                            color="primary"
                                            variant="contained"
                                        >
                                            Download
                                        </Button>
                                    </PDFDownloadLink>
                                </Stack>
                            </Stack>
                        </Stack>
                        {isMeuEmprestimo && (
                            <Grid spacing={3}>
                                <Grid
                                    xs={12}
                                    md={6}
                                    lg={4}
                                >
                                </Grid>
                                <Grid
                                    xs={12}
                                    md={6}
                                    lg={8}
                                >
                                    <PagamentoEmprestimo data={{
                                        //@ts-ignore
                                        emprestimo
                                    }} />
                                </Grid>
                            </Grid>
                        )}
                        <GestaoEmprestimo data={{
                            emprestimo: emprestimo as unknown as LoansForApprove,
                            meuEmprestimo: isMeuEmprestimo
                        }} />
                        {
                            isMeuEmprestimo && (
                                <Stack spacing={4}>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                    >
                                        <Typography
                                            color="textSecondary"
                                            variant="h6"
                                        >
                                            Histórico de pagamentos
                                        </Typography>
                                        <Typography
                                            color="textSecondary"
                                            variant="h6"
                                        >
                                            Total pago: R$ {totalPagamentos.toFixed(2)}
                                        </Typography>
                                    </Stack>
                                    <Stack
                                        divider={<Divider />}
                                        spacing={2}
                                    >
                                        {meusPagamentos.map((pagamento: any, index) => (
                                            <Stack
                                                alignItems="center"
                                                direction="row"
                                                justifyContent="space-between"
                                                spacing={2}
                                                key={index}
                                            >
                                                <Typography
                                                    color="textSecondary"
                                                    variant="body2"
                                                >
                                                    {pagamento.date}
                                                </Typography>
                                                <Typography
                                                    color="textSecondary"
                                                    variant="body2"
                                                >
                                                    R$ {pagamento.value.toFixed(2)}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Stack>
                            )
                        }
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