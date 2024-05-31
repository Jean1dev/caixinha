import Layout from "@/components/Layout";
import { Seo } from "@/components/Seo";
import {
    Box,
    Container,
    Stack,
    Typography
} from "@mui/material";
import { ListarEmprestimosParaRenegociar } from "@/components/renegociacao/listar-emprestimos-para-renegociar";
import { useCallback, useState } from "react";
import { PropostaRenegociacao } from "@/components/renegociacao/proposta-renegociacao";
import { useCaixinhaSelect } from "@/hooks/useCaixinhaSelect";
import { solicitarRenegociacao } from "../api/api.service";
import toast from "react-hot-toast";

export default function Renegociacao() {
    const [renegociacao, setRenegociacao] = useState<any | null>(null)
    const { caixinha } = useCaixinhaSelect()

    const verProposta = useCallback((uid: string) => {
        toast.success('Solicitando proposta')
        solicitarRenegociacao({
            caixinhaId: caixinha?.id,
            emprestimoUid: uid
        }).then(res => {
            setRenegociacao(res)
        })
        
    }, [caixinha])

    return (
        <Layout>
            <Seo title="Renegociacao" />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack
                        spacing={3}
                        sx={{ mb: 3 }}
                    >
                        <Typography variant="h4">
                            Ultimo Emprestimo Renegociavel
                        </Typography>
                    </Stack>

                    <Stack spacing={4}>
                        <ListarEmprestimosParaRenegociar verProposta={verProposta} />
                        {renegociacao && (<PropostaRenegociacao renegociacao={renegociacao} />)}
                    </Stack>
                </Container>
            </Box>
        </Layout>
    )
}