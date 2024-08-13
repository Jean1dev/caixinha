import { useCallback, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    Divider,
    Unstable_Grid2 as Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { LoansForApprove } from '@/types/types';
import { useCaixinhaSelect } from '@/hooks/useCaixinhaSelect';
import { aprovarEmprestimo, recusarEmprestimo } from '../../pages/api/api.service';
import CenteredCircularProgress from '@/components/CenteredCircularProgress';
import { toast } from 'react-hot-toast';
import { useUserAuth } from '@/hooks/useUserAuth';

interface IGestaoInput {
    emprestimo: LoansForApprove,
    meuEmprestimo: boolean
}

export const GestaoEmprestimo = ({ data }: { data: IGestaoInput }) => {
    const { caixinha } = useCaixinhaSelect()
    const [loading, setLoading] = useState(false)
    const [blockButtons, setBlockButtons] = useState(false)
    const { user } = useUserAuth()

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

    const reprovar = useCallback(() => {
        let motivo = prompt('Escreva o motivo da rejeicao');
        let confirmacao = confirm('Voce confirma essa operacao');

        if (!confirmacao)
            return;

        setLoading(true)
        recusarEmprestimo({
            name: user.name,
            email: user.email,
            caixinhaid: caixinha?.id,
            emprestimoId: data.emprestimo.uid,
            reason: motivo
        }).then(() => {
            setLoading(false)
            setBlockButtons(true)
            toast.success('Aprovação enviada')
        }).catch(e => {
            setLoading(false)
            toast.error(e.message)
        })
    }, [caixinha, data, user])

    if (loading) {
        return <CenteredCircularProgress />
    }

    return (
        <Card sx={{ p: 6 }}>
            <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={3}
            >
                <div>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            height: 24,
                            width: 24
                        }}
                    >
                        <Avatar
                            src='https://pbs.twimg.com/profile_images/1294819965632163840/zL35EMhv_400x400.jpg'
                            sx={{
                                height: 80,
                                mb: 2,
                                width: 80
                            }}
                        />
                    </Box>
                    <Typography variant="subtitle2">
                        https://caixinha-gilt.vercel.app/
                    </Typography>
                </div>
                <div>
                    <Typography
                        align="right"
                        color={data.emprestimo.isPaidOff ? "success.main" : 'info'}
                        variant="h4"
                    >
                        {data.emprestimo.isPaidOff ? 'Pago' : 'Pendente'}
                    </Typography>

                </div>
            </Stack>
            <Box sx={{ mt: 4 }}>
                <Grid
                    container
                    justifyContent="space-between"
                >
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <Typography variant="body2">
                            Alameda Jau, 1177,
                            <br />
                            Andar 4 - Jardim Paulista
                            <br />
                            Sao Paulo - SP | CEP: 01.420-903
                        </Typography>
                    </Grid>
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <Typography variant="body2">
                            Caixinha financeira LTDA. 4675933
                            <br />
                            CNPJ. 45.848.563/0001-72
                            <br />
                            razão social Jeanlucafp Consultoria de Ti Ltda
                        </Typography>
                    </Grid>
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <Typography
                            align="right"
                            variant="body2"
                        >
                            emprestimos@caixinha.com.br
                            <br />
                            (+40) 652 3456 23
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ mt: 4 }}>
                <Grid
                    container
                    justifyContent="space-between"
                >
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <Typography
                            gutterBottom
                            variant="subtitle2"
                        >
                            Data solicitação
                        </Typography>
                        <Typography variant="body2">
                            {data.emprestimo.date}
                        </Typography>
                    </Grid>
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <Typography
                            gutterBottom
                            variant="subtitle2"
                        >
                            Data limite
                            {
                                data.emprestimo.parcelas > 0
                                    ? `\n Esse é um emprestimo parcelado em ${data.emprestimo.parcelas}x`
                                    : ''
                            }
                        </Typography>
                        <Typography variant="body2">
                            {
                                data.emprestimo.parcelas == 0
                                    ? data.emprestimo.billingDates[0].data
                                    : data.emprestimo.billingDates[data.emprestimo.billingDates.length - 1].data
                            }
                        </Typography>
                    </Grid>
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <Typography
                            gutterBottom
                            variant="subtitle2"
                        >
                            UID
                        </Typography>
                        <Typography variant="body2">
                            {data.emprestimo.uid}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ mt: 4 }}>
                <Grid
                    container
                    justifyContent="space-between"
                >
                    <Grid
                        xs={12}
                        md={4}
                    >
                        <Typography
                            gutterBottom
                            variant="subtitle2"
                        >
                            Favorecido
                        </Typography>
                        <Typography variant="body2">
                            {data.emprestimo.memberName}
                            <br />
                            endereço não fornecido
                            <br />
                            Juros {data.emprestimo.interest}%
                        </Typography>
                    </Grid>
                    <Grid
                        xs={12}
                        md={4}
                    >
                        {
                            data.emprestimo.billingDates.length > 1 && (
                                <>
                                    <Typography
                                        gutterBottom
                                        variant="subtitle2"
                                    >
                                        Emprestimo parcelado em {data.emprestimo.billingDates.length}x
                                    </Typography>
                                    <Typography variant="body2">
                                        valor da parcela R$ {data.emprestimo.billingDates[0].valor}
                                    </Typography>
                                </>
                            )
                        }

                    </Grid>
                </Grid>

            </Box>

            <Table sx={{ mt: 4 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            #
                        </TableCell>
                        <TableCell>
                            Descrição
                        </TableCell>
                        <TableCell>
                            Qtd
                        </TableCell>
                        <TableCell>
                            Valor solicital
                        </TableCell>
                        <TableCell align="right">
                            Total
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item, index) => {
                        const unitAmount = `R$${item.solicitado}`
                        const totalAmount = `R$${item.total}`

                        return (
                            <TableRow key={index}>
                                <TableCell>
                                    {index + 1}
                                </TableCell>
                                <TableCell>
                                    {item.descricao}
                                </TableCell>
                                <TableCell>
                                    {item.quantidade}
                                </TableCell>
                                <TableCell>
                                    {unitAmount}
                                </TableCell>
                                <TableCell align="right">
                                    {totalAmount}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    <TableRow>
                        <TableCell
                            colSpan={3}
                            sx={{ borderBottom: 'none' }}
                        />
                        <TableCell sx={{ borderBottom: 'none' }}>
                            <Typography variant="subtitle1">
                                Subtotal
                            </Typography>
                        </TableCell>
                        <TableCell
                            align="right"
                            sx={{ borderBottom: 'none' }}
                        >
                            <Typography variant="subtitle2">
                                R${data.emprestimo.valueRequested}
                            </Typography>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell
                            colSpan={3}
                            sx={{ borderBottom: 'none' }}
                        />
                        <TableCell sx={{ borderBottom: 'none' }}>
                            <Typography variant="subtitle1">
                                Impostos
                            </Typography>
                        </TableCell>
                        <TableCell
                            align="right"
                            sx={{ borderBottom: 'none' }}
                        >
                            <Typography variant="subtitle2">
                                {data.emprestimo.interest}%
                            </Typography>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell
                            colSpan={3}
                            sx={{ borderBottom: 'none' }}
                        />
                        <TableCell sx={{ borderBottom: 'none' }}>
                            <Typography variant="subtitle1">
                                Taxas
                            </Typography>
                        </TableCell>
                        <TableCell
                            align="right"
                            sx={{ borderBottom: 'none' }}
                        >
                            <Typography variant="subtitle2">
                                R$ {data.emprestimo.fees}
                            </Typography>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell
                            colSpan={3}
                            sx={{ borderBottom: 'none' }}
                        />
                        <TableCell sx={{ borderBottom: 'none' }}>
                            <Typography variant="subtitle1">
                                Total
                            </Typography>
                        </TableCell>
                        <TableCell
                            align="right"
                            sx={{ borderBottom: 'none' }}
                        >
                            <Typography variant="subtitle2">
                                R${data.emprestimo.totalValue}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Box sx={{ mt: 2 }}>
                <Typography
                    gutterBottom
                    variant="h6"
                >
                    Notes
                </Typography>
                <Typography
                    color="text.secondary"
                    variant="body2"
                >
                    Please make sure you have the right bank registration number
                    as I
                    had issues before and make sure you guys cover transfer
                    expenses.
                </Typography>
            </Box>
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
                {
                    !data.meuEmprestimo && (
                        <>
                            <Button onClick={aprovar} disabled={blockButtons} variant="contained">
                                Aprovar
                            </Button>
                            <Button onClick={reprovar} disabled={blockButtons} variant="contained" color='error'>
                                Reprovar
                            </Button>
                        </>
                    )
                }
                {
                    data.meuEmprestimo && (
                        <Button disabled={blockButtons} variant="contained" color='info' onClick={() => alert('WIP')}>
                            Remover o emprestimo
                        </Button>
                    )
                }
            </CardActions>
        </Card>
    );
};
