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
    Typography 
} from "@mui/material";
import { useEffect, useState } from "react";
import { GestaoEmprestimo } from "../../components/emprestimos/gestao-emprestimo";
import { PagamentoEmprestimo } from "../../components/emprestimos/pagamento-emprestimo";
import Grid from '@mui/material/Unstable_Grid2';
import { RouterLink } from "@/components/RouterLink";
import { Seo } from "@/components/Seo";
import { ArrowBackIos } from "@mui/icons-material";
import { LoansForApprove } from "@/types/types";
import { EmprestimoPdf } from "@/components/emprestimos/emprestimo-pdsf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { getEmprestimo } from "../api/api.service";
import { useRouter } from "next/router";
import CenteredCircularProgress from "@/components/CenteredCircularProgress";
import { getInitials } from "@/utils/utils";
import { useUserAuth } from "@/hooks/useUserAuth";

export default function DetalhesEmprestimo() {
    const [emprestimo, setEmprestimo] = useState<LoansForApprove | null>(null)
    const [isMeuEmprestimo, setMeuEmprestimo] = useState(false)
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
        
        getEmprestimo(uid as string).then(res => setEmprestimo(res))
    }, [router])

    if (!emprestimo){
        return <CenteredCircularProgress/>
    }

    return (
        <Layout>
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
                        </Stack>
                    </Container>
                </Box>
            </>
        </Layout>
    )
}

// export async function getServerSideProps(context: any) {
//     const  = context.query;

//     return {
//         props: {
//             data: uid
//         }
//     };
// }