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
import { useTranslation } from "react-i18next";

export default function Renegociacao() {
    const [renegociacao, setRenegociacao] = useState<any | null>(null)
    const { caixinha } = useCaixinhaSelect()
    const { t } = useTranslation()

    const verProposta = useCallback((uid: string) => {
        toast.success(t('renegociacao.solicitando_renegociacao'))
        solicitarRenegociacao({
            caixinhaId: caixinha?.id,
            emprestimoUid: uid
        }).then(res => {
            setRenegociacao(res)
        })
        
    }, [caixinha, t])

    return (
        <Layout>
            <Seo title={t('renegociacao.title')} />
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
                            {t('renegociacao.ultimo_emprestimo')}
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