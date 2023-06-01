import { ArrowRight } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Scrollbar } from '../scrollbar';

// const statusMap = {
//   pending: 'warning',
//   delivered: 'success',
//   refunded: 'error'
// };

export const UltimasMovimentacoes = (props: any) => {
  const { orders = [], sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="Ultimas transações" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Operação
                </TableCell>
                <TableCell>
                  membro
                </TableCell>
                <TableCell sortDirection="desc">
                  Date
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order: any) => {
                return (
                  <TableRow
                    hover
                    key={order.id}
                  >
                    <TableCell>
                      {order.tipo}
                    </TableCell>
                    <TableCell>
                      {order.nick}
                    </TableCell>
                    <TableCell>
                      {order.date}
                    </TableCell>
                    <TableCell>
                      {order.status}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRight />
            </SvgIcon>
          )}
          size="small"
          variant="text"
        >
          Ver todas
        </Button>
      </CardActions>
    </Card>
  );
};

