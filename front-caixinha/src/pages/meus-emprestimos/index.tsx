import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { getMeusEmprestimos } from "../api/api.service";
import { IMeusEmprestimos } from "@/types/types";
import EmprestimoList from "./emprestimos.list";
import { Box, Button, Divider } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function MeusEmprestimos() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<IMeusEmprestimos | null>(null)
    const { data: session } = useSession()

    useEffect(() => {
        getMeusEmprestimos({ name: session?.user?.name, email: session?.user?.email }).then((data: IMeusEmprestimos) => {
            if (!data.caixinhas.length) {
                setData({
                    caixinhas: [{
                        currentBalance: 54,
                        loansForApprove: [],
                        myLoans: []
                    }]
                })
            } else {
                setData(data)
            }
            setLoading(false)
        })
    }, [])

    return (
        <Layout>
            <Box maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginBottom: "1rem" }}
                        onClick={() => router.push('emprestimo')}
                    >
                        Solicitar novo emprestimo
                    </Button>
                </Box>
                <EmprestimoList loading={loading} data={data?.caixinhas[0].myLoans} />
                <Divider />
                <EmprestimoList loading={loading} data={data?.caixinhas[0].loansForApprove} />
            </Box>


        </Layout>
    )
}