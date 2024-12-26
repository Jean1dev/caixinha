import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { SeverityPill } from '../severity-pill';
import { AtivosListagemCompra } from '@/types/types';

export const AtivosListTable = (props: any) => {
    const {
        count = 0,
        items = [],
        onPageChange = () => { },
        onRowsPerPageChange,
        onSelect,
        page = 0,
        rowsPerPage = 0
    } = props;

    return (
        <div>
            <Table>
                <TableBody>
                    {items.map((data: AtivosListagemCompra) => {
                        const totalAmount = `R$ ${data.valor}`;
                        const statusColor = data.disponivel ? 'success' : 'error';

                        return (
                            <TableRow
                                hover
                                key={data.codigo}
                                onClick={() => onSelect?.(data.codigo)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell
                                    sx={{
                                        alignItems: 'center',
                                        display: 'flex'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: (theme) => theme.palette.mode === 'dark'
                                                ? 'neutral.800'
                                                : 'neutral.200',
                                            borderRadius: 2,
                                            maxWidth: 'fit-content',
                                            ml: 3,
                                            p: 1
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                alignItems: 'center',
                                                backgroundColor: 'neutral.50',
                                                backgroundImage: `url(${data.imgUrl})`,
                                                backgroundPosition: 'center',
                                                backgroundSize: 'cover',
                                                borderRadius: 1,
                                                display: 'flex',
                                                height: 80,
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                width: 80
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ ml: 2 }}>
                                        <Typography variant="subtitle2">
                                            {data.codigo}
                                        </Typography>
                                        <Typography
                                            color="text.secondary"
                                            variant="body2"
                                        >
                                            Valor atual
                                            {' '}
                                            {totalAmount}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <SeverityPill color={statusColor}>
                                        {data.disponivel ? 'Disponível' : 'Indisponível'}
                                    </SeverityPill>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={count}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </div>
    );
};