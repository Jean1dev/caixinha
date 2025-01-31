import { ArrowRightAltOutlined } from "@mui/icons-material"
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Divider,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    Radio,
    RadioGroup,
    Stack,
    SvgIcon,
    Typography
} from "@mui/material"
import CenteredCircularProgress from "../CenteredCircularProgress"
import { useCallback, useMemo, useState } from "react"
import { aceitarRenegociacao } from "@/pages/api/api.service"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"

export const PropostaRenegociacao = (props: any) => {
    const { renegociacao } = props
    const [parcelamento, setParcelamento] = useState(1)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { t } = useTranslation()

    const formattedTotalAmount = useMemo(() => {
        return `R$ ${renegociacao.sugestao.newTotalValue.toFixed(2)}`
    }, [renegociacao.sugestao.newTotalValue])

    const assets = [
        {
            amount: renegociacao.sugestao.newInterestRate,
            color: '#6C76C4',
            name: 'Total Juros'
        },
        {
            amount: renegociacao.sugestao.newTotalValue,
            color: '#FF4081',
            name: 'Total'
        }
    ]

    const aceitarProposta = useCallback(() => {
        setLoading(true)
        aceitarRenegociacao({
            renegociacaoId: renegociacao.renegId,
            valorProposta: renegociacao.sugestao.newTotalValue,
            parcelas: parcelamento
        })
        .then(() => router.push('sucesso'))
        .finally(() => setLoading(false))
    }, [parcelamento, renegociacao])

    const propostaPersonalizada = useCallback(() => {
        alert(t('renegociacao.proposta_personalizada'))
    }, [t])

    if (loading) {
        return <CenteredCircularProgress />
    }

    return (
        <Box
            sx={{
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'neutral.800'
                    : 'neutral.100',
                p: 3
            }}
        >
            <Container maxWidth="sm">
                <Card>
                    <CardHeader
                        subheader={(
                            <Typography variant="h4">
                                {formattedTotalAmount}
                            </Typography>
                        )}
                        sx={{ pb: 0 }}
                        title={(
                            <Typography
                                color="text.secondary"
                                variant="overline"
                            >
                                {t('renegociacao.proposta')}
                            </Typography>
                        )}
                    />
                    <CardContent>
                        <Divider sx={{ mb: 2 }} />
                        <Typography
                            color="text.secondary"
                            variant="overline"
                        >
                            {t('renegociacao.resumo')}
                        </Typography>
                        <List
                            disablePadding
                            sx={{ pt: 2 }}
                        >
                            {assets.map((currency) => {
                                const amount = `R$ ${currency.amount}`

                                return (
                                    <ListItem
                                        disableGutters
                                        key={currency.name}
                                        sx={{
                                            pb: 2,
                                            pt: 0
                                        }}
                                    >
                                        <ListItemText
                                            disableTypography
                                            primary={(
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
                                                        <Box
                                                            sx={{
                                                                backgroundColor: currency.color,
                                                                height: 8,
                                                                width: 8,
                                                                borderRadius: '50%'
                                                            }}
                                                        />
                                                        <Typography variant="subtitle2">
                                                            {currency.name}
                                                        </Typography>
                                                    </Stack>
                                                    <Typography
                                                        color="text.secondary"
                                                        variant="subtitle2"
                                                    >
                                                        {amount}
                                                    </Typography>
                                                </Stack>
                                            )}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                        <Divider sx={{ mb: 2 }} />
                        <Typography
                            color="text.secondary"
                            variant="overline"
                        >
                            {t('renegociacao.parcelamento')}
                        </Typography>
                        <div>
                            <RadioGroup
                                name="Parcelamento"
                                onChange={e => setParcelamento(Number(e.target.value))}
                                sx={{ flexDirection: 'row' }}
                                value={parcelamento}
                            >
                                {renegociacao.sugestao.installmentOptions.map((parcela: any) => (
                                    <FormControlLabel
                                        control={<Radio />}
                                        key={parcela}
                                        label={(
                                            <Typography variant="body1">
                                                {parcela}
                                            </Typography>
                                        )}
                                        value={parcela}
                                    />
                                ))}
                            </RadioGroup>
                        </div>
                        <Divider />
                        <Stack
                            alignItems="flex-start"
                            spacing={1}
                            sx={{ mt: 2 }}
                        >
                            <Button
                                color="inherit"
                                onClick={aceitarProposta}
                                endIcon={(
                                    <SvgIcon>
                                        <ArrowRightAltOutlined />
                                    </SvgIcon>
                                )}
                            >
                                {t('renegociacao.aceitar')}
                            </Button>
                            <Button
                                color="inherit"
                                onClick={propostaPersonalizada}
                                endIcon={(
                                    <SvgIcon>
                                        <ArrowRightAltOutlined />
                                    </SvgIcon>
                                )}
                            >
                                {t('renegociacao.proposta_personalizada')}
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}