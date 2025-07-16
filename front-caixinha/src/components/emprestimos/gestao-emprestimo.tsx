import { useCallback, useState } from 'react';
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Unstable_Grid2 as Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Chip,
    useTheme
} from '@mui/material';
import { LoansForApprove } from '@/types/types';
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';
import { aprovarEmprestimo, recusarEmprestimo, removerEmprestimo } from '../../pages/api/api.service';
import CenteredCircularProgress from '@/components/CenteredCircularProgress';
import { toast } from 'react-hot-toast';
import { useUserAuth } from '@/hooks/useUserAuth';
import { 
    Business, 
    Email, 
    Phone, 
    LocationOn, 
    Description, 
    AttachMoney, 
    Schedule, 
    Person, 
    Receipt 
} from '@mui/icons-material';

interface IGestaoInput {
    emprestimo: LoansForApprove,
    meuEmprestimo: boolean
}

export const GestaoEmprestimo = ({ data }: { data: IGestaoInput }) => {
    const { caixinha } = useCaixinhaSelect()
    const [loading, setLoading] = useState(false)
    const [blockButtons, setBlockButtons] = useState(false)
    const { user } = useUserAuth()
    const theme = useTheme()

    const items = [{
        quantidade: 1,
        total: data.emprestimo.totalValue,
        solicitado: data.emprestimo.valueRequested,
        juros: data.emprestimo.interest,
        descricao: data.emprestimo.description
    }]

    const aprovar = useCallback(() => {
        setLoading(true)
        aprovarEmprestimo({
            memberName: user.name,
            caixinhaid: caixinha?.id,
            emprestimoId: data.emprestimo.uid
        }).then(() => {
            setLoading(false)
            setBlockButtons(true)
            toast.success('Aprovação enviada')
        }).catch(e => {
            setLoading(false)
            toast.error(e.message)
        })
    }, [caixinha, data, user])

    const remover = useCallback(() => {
        setLoading(true)
        removerEmprestimo({
            name: user.name,
            email: user.email,
            caixinhaId: caixinha?.id,
            emprestimoUid: data.emprestimo.uid
        }).then(() => {
            setLoading(false)
            setBlockButtons(true)
            toast.success('Emprestimo removido')
        }).catch(e => {
            setLoading(false)
            toast.error(e.message)
        })
    }, [caixinha, data, user])

    const reprovar = useCallback(() => {
        let motivo = prompt('Escreva o motivo da rejeicao');
        let confirmacao = confirm('Voce confirma essa operacao');

        if (!confirmacao)
            return;

        if (!caixinha?.id) {
            toast.error('Nenhuma caixinha selecionada')
            return
        }

        setLoading(true)
        recusarEmprestimo({
            name: user.name,
            email: user.email,
            caixinhaId: caixinha.id,
            emprestimoUid: data.emprestimo.uid,
            reason: motivo
        }).then(() => {
            setLoading(false)
            setBlockButtons(true)
            toast.success('Emprestimo rejeitado')
        }).catch(e => {
            setLoading(false)
            toast.error(e.message)
        })
    }, [caixinha, data, user])

    if (loading) {
        return <CenteredCircularProgress />
    }

    return (
        <Stack spacing={3}>
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
                                    src='https://pbs.twimg.com/profile_images/1294819965632163840/zL35EMhv_400x400.jpg'
                                    sx={{
                                        height: 64,
                                        width: 64
                                    }}
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
                                label={data.emprestimo.isPaidOff ? 'Pago' : 'Pendente'}
                                color={data.emprestimo.isPaidOff ? 'success' : 'warning'}
                                sx={{ 
                                    height: 32,
                                    fontSize: '1rem',
                                    fontWeight: 600
                                }}
                            />
                        </Stack>

                        <Grid container spacing={3}>
                            <Grid xs={12} md={4}>
                                <Stack spacing={1}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Business color="primary" />
                                        <Typography variant="subtitle2">
                                            Empresa
                                        </Typography>
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
                                        <Typography variant="subtitle2">
                                            Endereço
                                        </Typography>
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
                                        <Typography variant="subtitle2">
                                            Contato
                                        </Typography>
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

            <Card elevation={3}>
                <CardContent>
                    <Stack spacing={3}>
                        <Grid container spacing={3}>
                            <Grid xs={12} md={4}>
                                <Stack spacing={1}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Schedule color="primary" />
                                        <Typography variant="subtitle2">
                                            Data solicitação
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        {data.emprestimo.date}
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid xs={12} md={4}>
                                <Stack spacing={1}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Receipt color="primary" />
                                        <Typography variant="subtitle2">
                                            Data limite
                                            {data.emprestimo.parcelas > 0 && (
                                                <Chip
                                                    label={`${data.emprestimo.parcelas}x`}
                                                    size="small"
                                                    color="primary"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        {data.emprestimo.parcelas == 0
                                            ? data.emprestimo.billingDates[0].data
                                            : data.emprestimo.billingDates[data.emprestimo.billingDates.length - 1].data
                                        }
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid xs={12} md={4}>
                                <Stack spacing={1}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Person color="primary" />
                                        <Typography variant="subtitle2">
                                            Favorecido
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">
                                        {data.emprestimo.memberName}
                                        <br />
                                        endereço não fornecido
                                        <br />
                                        <Chip
                                            label={`Juros ${data.emprestimo.interest}%`}
                                            size="small"
                                            color="info"
                                            sx={{ mt: 1 }}
                                        />
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>

                        {data.emprestimo.billingDates.length > 1 && (
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
                                    Emprestimo parcelado em {data.emprestimo.billingDates.length}x
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    valor da parcela R$ {data.emprestimo.billingDates[0].valor}
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <Card elevation={3}>
                <CardContent>
                    <Stack spacing={3}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Description color="primary" />
                            <Typography variant="h6">
                                Detalhes do Empréstimo
                            </Typography>
                        </Stack>

                        <Table>
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
                                {items.map((item, index) => {
                                    const unitAmount = `R$${item.solicitado}`
                                    const totalAmount = `R$${item.total}`

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.descricao}</TableCell>
                                            <TableCell>{item.quantidade}</TableCell>
                                            <TableCell>{unitAmount}</TableCell>
                                            <TableCell align="right">{totalAmount}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                <TableRow>
                                    <TableCell colSpan={3} sx={{ borderBottom: 'none' }} />
                                    <TableCell sx={{ borderBottom: 'none' }}>
                                        <Typography variant="subtitle1">Subtotal</Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ borderBottom: 'none' }}>
                                        <Typography variant="subtitle2">
                                            R${data.emprestimo.valueRequested}
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
                                            {data.emprestimo.interest}%
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
                                            R$ {data.emprestimo.fees}
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
                                            R${data.emprestimo.totalValue}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Description color="primary" />
                                <Typography variant="h6">
                                    Observações
                                </Typography>
                            </Stack>
                            <Typography color="text.secondary" variant="body2">
                                Please make sure you have the right bank registration number
                                as I had issues before and make sure you guys cover transfer
                                expenses.
                            </Typography>
                        </Stack>
                    </Stack>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                    {!data.meuEmprestimo && (
                        <>
                            <Button 
                                onClick={aprovar} 
                                disabled={blockButtons} 
                                variant="contained"
                                color="success"
                            >
                                Aprovar
                            </Button>
                            <Button 
                                onClick={reprovar} 
                                disabled={blockButtons} 
                                variant="contained" 
                                color="error"
                            >
                                Reprovar
                            </Button>
                        </>
                    )}
                    {data.meuEmprestimo && (
                        <Button 
                            disabled={blockButtons} 
                            variant="contained" 
                            color="info" 
                            onClick={remover}
                        >
                            Remover o emprestimo
                        </Button>
                    )}
                </CardActions>
            </Card>
        </Stack>
    );
};
