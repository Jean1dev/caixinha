import {
    Avatar,
    Card,
    CardContent,
    Chip,
    Unstable_Grid2 as Grid,
    Stack,
    Typography
} from '@mui/material';
import { Business, Email, LocationOn, Phone } from '@mui/icons-material';
import { LoansForApprove } from '@/types/types';

interface CardEmpresaProps {
    emprestimo: LoansForApprove;
}

export function CardEmpresa({ emprestimo }: CardEmpresaProps) {
    return (
        <Card elevation={3}>
            <CardContent>
                <Stack spacing={3}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                                src="https://pbs.twimg.com/profile_images/1294819965632163840/zL35EMhv_400x400.jpg"
                                sx={{ height: 64, width: 64 }}
                            />
                            <Stack spacing={0.5}>
                                <Typography variant="h6">
                                    Caixinha Financeira
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    https://caixinha-gilt.vercel.app/
                                </Typography>
                            </Stack>
                        </Stack>
                        <Chip
                            label={emprestimo.isPaidOff ? 'Pago' : 'Pendente'}
                            color={emprestimo.isPaidOff ? 'success' : 'warning'}
                            sx={{ height: 32, fontSize: '1rem', fontWeight: 600 }}
                        />
                    </Stack>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={4}>
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Business color="primary" />
                                    <Typography variant="subtitle2">Empresa</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    Caixinha financeira LTDA. 4675933
                                    <br />
                                    CNPJ. 45.848.563/0001-72
                                    <br />
                                    razão social Jeanlucafp Consultoria de Ti Ltda
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid xs={12} md={4}>
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LocationOn color="primary" />
                                    <Typography variant="subtitle2">Endereço</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    Alameda Jau, 1177,
                                    <br />
                                    Andar 4 - Jardim Paulista
                                    <br />
                                    Sao Paulo - SP | CEP: 01.420-903
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid xs={12} md={4}>
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Email color="primary" />
                                    <Typography variant="subtitle2">Contato</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    emprestimos@caixinha.com.br
                                    <br />
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Phone fontSize="small" />
                                        (+40) 652 3456 23
                                    </Stack>
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            </CardContent>
        </Card>
    );
}
