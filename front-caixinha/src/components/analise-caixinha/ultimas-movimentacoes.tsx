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

export const UltimasMovimentacoes = (props: any) => {
  const { orders = [], sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="Ultimos depositos" />
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
                  Data
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
          onClick={props.extrato}
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

