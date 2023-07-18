import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { EmprestimoCaixinha, IMeusEmprestimos, LoansForApprove } from '@/types/types';
import { Scrollbar } from '../scrollbar';
import { useRouter } from 'next/router';

const agrupar = (items: IMeusEmprestimos) => {
    const data: any = {
        'para aprovar': [],
        pendentes: [],
        quitados: []
    }

    items.caixinhas.forEach(caixa => {
        caixa.emprestimosParaAprovar.forEach((loan: any) => data['para aprovar'].push(loan))
        caixa.meusEmprestimos.forEach(loan => data.pendentes.push(loan))
        caixa.meusEmprestimosQuitados.forEach(loan => data.quitados.push(loan))
    })

    return data
};

export const getInitials = (name: string = '') => name
    .replace(/\s+/, ' ')
    .split(' ')
    .slice(0, 2)
    .map((v) => v && v[0].toUpperCase())
    .join('');


const InvoiceRow = (props: any) => {
    const { invoice, goToDetalhesEmprestimo, ...other }: { invoice: LoansForApprove, goToDetalhesEmprestimo: any, other: any } = props;

    const jump = () => goToDetalhesEmprestimo(invoice)

    return (
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            {...other}>
            <TableCell width="25%">
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={2}
                    sx={{
                        display: 'inline-flex',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <Avatar
                        sx={{
                            height: 42,
                            width: 42
                        }}
                    >
                        {getInitials(invoice.memberName)}
                    </Avatar>
                    <div>
                        <Typography
                            color="text.primary"
                            variant="subtitle2"
                        >
                            {invoice.memberName}
                        </Typography>
                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >
                            {invoice.description}
                        </Typography>
                    </div>
                </Stack>
            </TableCell>
            <TableCell>
                <Typography variant="subtitle2">
                    {'valor solicitado - R$'}
                    {invoice.valueRequested}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography variant="subtitle2">
                    Data solicitado
                </Typography>
                <Typography
                    color="text.secondary"
                    variant="body2"
                >
                    {invoice.date}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography variant="subtitle2">
                    Caixinha
                </Typography>
                <Typography
                    color="text.secondary"
                    variant="body2"
                >
                    {invoice?.caixinha}
                </Typography>
            </TableCell>
            <TableCell align="right">
                {invoice.isPaidOff}

            </TableCell>
            <TableCell align="right">
                <IconButton onClick={jump}>
                    <SvgIcon>
                        <ArrowForwardIcon />
                    </SvgIcon>
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

export const MeuEmprestimosListTable = (props: any) => {
    const {
        group = false,
        items = [],
        count = 0,
        onPageChange = () => { },
        onRowsPerPageChange,
        page = 0,
        rowsPerPage = 0
    } = props;
    const router = useRouter()

    const goToDetalhesEmprestimo = (item: LoansForApprove) => {
        router.push({
            pathname: 'detalhes-emprestimo',
            query: {
                uid: item.uid
            }
        })
    }

    let content;

    if (group) {
        const groupedInvoices = agrupar(items);
        const statuses = Object.keys(groupedInvoices);

        content = (
            <Stack spacing={6}>
                {statuses.map((status) => {
                    const groupTitle = status.charAt(0).toUpperCase() + status.slice(1);
                    //@ts-ignore
                    const count = groupedInvoices[status].length;
                    //@ts-ignore
                    const invoices = groupedInvoices[status];
                    const hasInvoices = invoices.length > 0;

                    return (
                        <Stack
                            key={groupTitle}
                            spacing={2}
                        >
                            <Typography
                                color="text.secondary"
                                variant="h6"
                            >
                                {groupTitle}
                                {' '}
                                ({count})
                            </Typography>
                            {hasInvoices && (
                                <Card>
                                    <Scrollbar>
                                        <Table sx={{ minWidth: 600 }}>
                                            <TableBody>
                                                {invoices.map((invoice: LoansForApprove) => (
                                                    <InvoiceRow
                                                        key={invoice.uid}
                                                        invoice={invoice}
                                                        goToDetalhesEmprestimo={goToDetalhesEmprestimo}
                                                    />
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Scrollbar>
                                </Card>
                            )}
                        </Stack>
                    );
                })}
            </Stack>
        );
    } else {
        const data: LoansForApprove[] = []
        items?.caixinhas.forEach((caixa: EmprestimoCaixinha) => {
            caixa.emprestimosParaAprovar.forEach((loan: any) => data.push(loan))
            caixa.meusEmprestimos.forEach((loan: any) => data.push(loan))
        })

        content = (
            <Card>
                <Table>
                    <TableBody>
                        {data.map((invoice: LoansForApprove) => (
                            <InvoiceRow
                                key={invoice.uid}
                                invoice={invoice}
                                goToDetalhesEmprestimo={goToDetalhesEmprestimo}
                            />
                        ))}
                    </TableBody>
                </Table>
            </Card>
        );
    }

    return (
        <Stack spacing={4}>
            {content}
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </Stack>
    );
};