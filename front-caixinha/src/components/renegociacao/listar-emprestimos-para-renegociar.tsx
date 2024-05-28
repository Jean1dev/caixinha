import { useUserAuth } from "@/hooks/useUserAuth"
import { getUltimoEmprestimoPendente } from "@/pages/api/api.service"
import {
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    Stack,
    Typography
} from "@mui/material"
import { useState, useEffect } from "react"

function extractData(data: string[] | null) {
    if (data) {
        const last = data[data.length - 1]
        const newDate = new Date(last)
        return `${newDate.getDate()}/${newDate.getMonth()}/${newDate.getFullYear()}`
    }

    return ''
}

export const ListarEmprestimosParaRenegociar = ({ verProposta }: any) => {
    const [ultimoEmprestimoAtalho, setUltimoEmprestimoAtalho] = useState<any | null>(null)
    const { user } = useUserAuth()

    useEffect(() => {
        if (user.name === '' || !user) {
            return
        }

        getUltimoEmprestimoPendente(user.name, user.email)
            .then((response) => {
                setUltimoEmprestimoAtalho(response)
            })
    }, [user])

    return (
        <Card>
            <CardContent>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <Typography variant="h6">
                            {ultimoEmprestimoAtalho?.data?.uid}
                        </Typography>
                    </Grid>
                    <Grid
                        xs={12}
                        sm={12}
                        md={8}
                    >
                        <Stack
                            divider={<Divider />}
                            spacing={3}
                        >
                            <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                            >
                                <Stack spacing={1}>
                                    <Typography variant="subtitle1">
                                        {ultimoEmprestimoAtalho?.data?.description}
                                    </Typography>
                                    <Typography
                                        color="text.secondary"
                                        variant="body2"
                                    >
                                        Valor solicitado R$ {ultimoEmprestimoAtalho?.data?.valueRequested.value}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack
                                alignItems="flex-start"
                                direction="row"
                                justifyContent="space-between"
                                spacing={3}
                            >
                                <Stack spacing={1}>
                                    <Typography variant="subtitle1">
                                        A ultima data de pagamento esperado era {extractData(ultimoEmprestimoAtalho?.data?.billingDates)}
                                    </Typography>
                                    <Typography
                                        color="text.secondary"
                                        variant="body2"
                                    >
                                        Temos uma proposta personalizada para  você.
                                    </Typography>
                                </Stack>
                                <Button
                                    color="info"
                                    variant="outlined"
                                    onClick={() => verProposta(ultimoEmprestimoAtalho?.data?.uid)}
                                >
                                    Ver proposta
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}