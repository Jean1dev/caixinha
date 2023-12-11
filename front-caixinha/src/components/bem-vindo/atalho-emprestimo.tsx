import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useUserAuth } from '@/hooks/useUserAuth';
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';
import { pagarEmprestimo } from '@/pages/api/api.service';
import toast from 'react-hot-toast';
import { Stack } from '@mui/material';
import Image from 'next/image';

const Ok = () => (
    <Card>
        <Stack
            alignItems="center"
            spacing={2}
            sx={{ p: 3 }}
        >
            <Box
                sx={{
                    width: 100,
                    '& img': {
                        width: '100%'
                    }
                }}
            >
                <Image alt='ok' src="/assets/iconly/iconly-glass-tick.svg" />
            </Box>
            <Typography
                align="center"
                variant="h6"
            >
                Emprestimo Quitado.
            </Typography>
        </Stack>
    </Card>
)

export const AtalhoEmprestimo = (props: any) => {
    const { emprestimo } = props
    const [valorPago, setValorPago] = useState(emprestimo?.totalValue.value)
    const [ok, setOk] = useState(false)
    const { user } = useUserAuth()
    const { caixinha } = useCaixinhaSelect()

    const handleClick = useCallback(() => {
        const resposta = confirm(`Voce confirma o pagamento de R$${valorPago}`)
        if (resposta) {
            pagarEmprestimo({
                name: user.name,
                email: user.email,
                caixinhaId: caixinha?.id,
                emprestimoUid: emprestimo.uid,
                valor: valorPago,
                comprovante: null
            }).then(() => {
                toast.success('Pagamento efetuado')
                setOk(true)
            }).catch(e => {
                toast.error(e.message)
            })
        }
    }, [valorPago, user, caixinha]);

    if (ok) {
        return <Ok/>
    }

    return (
        <Card {...props}>
            <CardHeader
                title="Seu Ultimo Emprestimo"
            />
            <CardContent sx={{ pt: 0 }}>
                <TextField
                    label="Origem"
                    fullWidth
                    disabled
                    InputProps={{
                        startAdornment: (
                            <Box
                                sx={{
                                    mr: 1,
                                    mt: 2.5,
                                }}
                            >
                                <Box />
                            </Box>
                        ),
                    }}
                    value={`${emprestimo.date} - ${emprestimo.description}`}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        my: 1,
                    }}
                >
                </Box>
                <TextField
                    label="Valor a ser pago"
                    fullWidth
                    type="number"
                    onChange={(e: any) => setValorPago(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <Box
                                sx={{
                                    mr: 1,
                                    mt: 2.5,
                                }}
                            >
                                <Box />
                            </Box>
                        ),
                    }}
                    value={valorPago}
                />
                <Typography
                    color="text.secondary"
                    sx={{ mt: 2 }}
                    variant="body2"
                >
                    Total = (ValorSolicitado: {emprestimo.valueRequested.value} + Taxas: {emprestimo.fees.value}) *  Juros: {emprestimo.interest.value}
                </Typography>
                <Button
                    onClick={handleClick}
                    fullWidth
                    size="large"
                    sx={{ mt: 2 }}
                    variant="contained"
                >
                    Pagar
                </Button>
            </CardContent>
        </Card>
    );
};