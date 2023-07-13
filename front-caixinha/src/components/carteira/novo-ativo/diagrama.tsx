import { Scrollbar } from '@/components/scrollbar';
import { Switch } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';


const orderItems = [
  {
    id: '5ecb8abbdd6dfb1f9d6bf98b',
    pergunta: 'As propriedades são novas e não consomem manutenção excessiva?',
    criterio: 'TEMP',
    reposta: false
  },
  {
    id: '5ecb8ac10f116d04bed990eb',
    pergunta: 'O fundo imobiliário está negociado abaixo do P/VP 1? (Acima de 1,5, eu descarto o investimento em qualquer hipótese)',
    criterio: 'TEMP',
    reposta: false
  }
];

export const Diagrama = () => (
  <Box
    sx={{
      backgroundColor: (theme) => theme.palette.mode === 'dark'
        ? 'neutral.800'
        : 'neutral.100',
      p: 3
    }}
  >
    <Card>
      <CardHeader title="Diagrama" />
      <Divider />
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                Pergunta
              </TableCell>
              <TableCell>
                Criterio
              </TableCell>
              <TableCell>
                Resposta
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItems.map((item) => {

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {item.pergunta}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {item.criterio}
                  </TableCell>
                  <TableCell>
                    <Switch defaultChecked />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  </Box>
);
