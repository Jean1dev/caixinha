import {
    Card,
    CardContent,
    Chip,
    Unstable_Grid2 as Grid,
    Stack,
    Typography
} from '@mui/material';
import { AttachMoney, Person, Receipt, Schedule } from '@mui/icons-material';
import { LoansForApprove } from '@/types/types';
import { useTheme } from '@mui/material/styles';

interface CardDatasEmprestimoProps {
    emprestimo: LoansForApprove;
    dataLimite: string | undefined;
}

export function CardDatasEmprestimo({ emprestimo, dataLimite }: CardDatasEmprestimoProps) {
    const theme = useTheme();

    return (
        <Card elevation={3}>
            <CardContent>
                <Stack spacing={3}>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={4}>
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Schedule color="primary" />
                                    <Typography variant="subtitle2">Data solicitação</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    {emprestimo.date}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid xs={12} md={4}>
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Receipt color="primary" />
                                    <Typography variant="subtitle2">
                                        Data limite
                                        {emprestimo.parcelas > 0 && (
                                            <Chip
                                                label={`${emprestimo.parcelas}x`}
                                                size="small"
                                                color="primary"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    {dataLimite ?? '–'}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid xs={12} md={4}>
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Person color="primary" />
                                    <Typography variant="subtitle2">Favorecido</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    {emprestimo.memberName}
                                    <br />
                                    endereço não fornecido
                                    <br />
                                    <Chip
                                        label={`Juros ${emprestimo.interest}%`}
                                        size="small"
                                        color="info"
                                        sx={{ mt: 1 }}
                                    />
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                    {emprestimo.billingDates.length > 1 && (
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                                p: 2,
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: 1
                            }}
                        >
                            <AttachMoney color="primary" />
                            <Typography variant="subtitle2">
                                Emprestimo parcelado em {emprestimo.billingDates.length}x
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                valor da parcela R$ {emprestimo.billingDates[0].valor}
                            </Typography>
                        </Stack>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
