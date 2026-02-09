import {
    Button,
    Card,
    CardActions,
    CardContent,
    Stack,
    Typography
} from '@mui/material';
import { LoansForApprove } from '@/types/types';

interface ResumoAprovadorProps {
    emprestimo: LoansForApprove;
    dataLimite: string | undefined;
    blockButtons: boolean;
    onAprovar: () => void;
    onReprovar: () => void;
}

export function ResumoAprovador({
    emprestimo,
    dataLimite,
    blockButtons,
    onAprovar,
    onReprovar
}: ResumoAprovadorProps) {
    return (
        <Card elevation={3}>
            <CardContent>
                <Stack spacing={3}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={3}
                        justifyContent="space-between"
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                    >
                        <Stack spacing={2} flex={1}>
                            <Stack spacing={0.5}>
                                <Typography variant="body2" color="text.secondary">
                                    Valor total
                                </Typography>
                                <Typography variant="h4">
                                    R$ {Number(emprestimo.totalValue ?? emprestimo.valueRequested).toFixed(2)}
                                </Typography>
                            </Stack>
                            <Stack spacing={0.5}>
                                <Typography variant="body2" color="text.secondary">
                                    Pagamento até
                                </Typography>
                                <Typography variant="h6">
                                    {dataLimite ?? '–'}
                                </Typography>
                            </Stack>
                        </Stack>
                        <CardActions sx={{
                            flexDirection: { xs: 'column-reverse', sm: 'row' },
                            justifyContent: 'flex-end',
                            p: 0,
                            gap: 1,
                            '& .MuiButton-root': { width: { xs: '100%', sm: 'auto' } }
                        }}>
                            <Button
                                onClick={onAprovar}
                                disabled={blockButtons}
                                variant="contained"
                                color="success"
                            >
                                Aprovar
                            </Button>
                            <Button
                                onClick={onReprovar}
                                disabled={blockButtons}
                                variant="contained"
                                color="error"
                            >
                                Reprovar
                            </Button>
                        </CardActions>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
