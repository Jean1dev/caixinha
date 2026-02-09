import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { Description } from '@mui/icons-material';
import { LoansForApprove } from '@/types/types';

interface ItemDetalhe {
    quantidade: number;
    total: number | undefined;
    solicitado: number;
    descricao: string;
}

interface CardDetalhesEmprestimoProps {
    emprestimo: LoansForApprove;
    items: ItemDetalhe[];
    meuEmprestimo: boolean;
    blockButtons: boolean;
    onRemover?: () => void;
}

export function CardDetalhesEmprestimo({
    emprestimo,
    items,
    meuEmprestimo,
    blockButtons,
    onRemover
}: CardDetalhesEmprestimoProps) {
    return (
        <Card elevation={3}>
            <CardContent>
                <Stack spacing={3}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Description color="primary" />
                        <Typography variant="h6">Detalhes do Empréstimo</Typography>
                    </Stack>
                    <Box sx={{ overflowX: 'auto', width: '100%' }}>
                        <Table sx={{ minWidth: 320 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Descrição</TableCell>
                                    <TableCell>Qtd</TableCell>
                                    <TableCell>Valor solicitado</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.descricao}</TableCell>
                                        <TableCell>{item.quantidade}</TableCell>
                                        <TableCell>R${item.solicitado}</TableCell>
                                        <TableCell align="right">R${(item.total ?? item.solicitado)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3} sx={{ borderBottom: 'none' }} />
                                    <TableCell sx={{ borderBottom: 'none' }}>
                                        <Typography variant="subtitle1">Subtotal</Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ borderBottom: 'none' }}>
                                        <Typography variant="subtitle2">
                                            R${emprestimo.valueRequested}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3} sx={{ borderBottom: 'none' }} />
                                    <TableCell sx={{ borderBottom: 'none' }}>
                                        <Typography variant="subtitle1">Impostos</Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ borderBottom: 'none' }}>
                                        <Typography variant="subtitle2">
                                            {emprestimo.interest}%
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3} sx={{ borderBottom: 'none' }} />
                                    <TableCell sx={{ borderBottom: 'none' }}>
                                        <Typography variant="subtitle1">Taxas</Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ borderBottom: 'none' }}>
                                        <Typography variant="subtitle2">
                                            R$ {emprestimo.fees}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3} sx={{ borderBottom: 'none' }} />
                                    <TableCell sx={{ borderBottom: 'none' }}>
                                        <Typography variant="subtitle1">Total</Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ borderBottom: 'none' }}>
                                        <Typography variant="subtitle2">
                                            R${emprestimo.totalValue}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Description color="primary" />
                            <Typography variant="h6">Observações</Typography>
                        </Stack>
                        <Typography color="text.secondary" variant="body2">
                            Please make sure you have the right bank registration number
                            as I had issues before and make sure you guys cover transfer
                            expenses.
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
            {meuEmprestimo && onRemover && (
                <>
                    <Divider />
                    <CardActions sx={{
                        flexDirection: { xs: 'column-reverse', sm: 'row' },
                        justifyContent: 'flex-end',
                        p: 2,
                        gap: 1,
                        '& .MuiButton-root': { width: { xs: '100%', sm: 'auto' } }
                    }}>
                        <Button
                            disabled={blockButtons}
                            variant="contained"
                            color="info"
                            onClick={onRemover}
                        >
                            Remover o emprestimo
                        </Button>
                    </CardActions>
                </>
            )}
        </Card>
    );
}
