import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { getMeusEmprestimos } from "../api/api.service";
import { IMeusEmprestimos } from "@/types/types";
import EmprestimoList from "./emprestimos.list";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import CenteredCircularProgress from "@/components/CenteredCircularProgress";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function MeusEmprestimos() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [myLoans, setmyLoans] = useState([])
    const [loansForApprove, setloansForApprove] = useState([])
    const { data: session } = useSession()
    const [value, setValue] = useState(0)

    const mapData = (data: IMeusEmprestimos) => {
        const allMyLoans: any = [];
        const allLoansForApprove: any = [];

        data?.caixinhas.forEach((caixinha: any) => {
            allMyLoans.push(...caixinha.myLoans);
            allLoansForApprove.push(...caixinha.loansForApprove);
        });

        setmyLoans(allMyLoans)
        setloansForApprove(allLoansForApprove)
    }

    const fetchAPi = () => {
        if (!loading) {
            setLoading(true)
        }

        getMeusEmprestimos({ name: session?.user?.name, email: session?.user?.email }).then((data: IMeusEmprestimos) => {
            mapData(data)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchAPi()
    }, [session])

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Layout>
            <Box maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box display="flex" justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        color="info"
                        style={{ marginBottom: "1rem" }}
                        onClick={fetchAPi}
                    >
                        Atualizar lista
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginBottom: "1rem" }}
                        onClick={() => router.push('emprestimo')}
                    >
                        Solicitar novo emprestimo
                    </Button>
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Meus emprestimos" {...a11yProps(0)} />
                        <Tab label="Emprestimos para aprovar" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                {
                    loading && (<CenteredCircularProgress />)
                }
                {
                    !loading && (
                        <>
                            <TabPanel value={value} index={0}>
                                <EmprestimoList data={myLoans} />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <EmprestimoList data={loansForApprove} />
                            </TabPanel>
                        </>
                    )
                }
            </Box>
        </Layout>
    )
}