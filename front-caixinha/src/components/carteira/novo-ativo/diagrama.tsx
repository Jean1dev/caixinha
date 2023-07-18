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

export const Diagrama = (props: any) => {
  const {
    criterios,
    updateNota
  } = props
  return (
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
              {criterios.map((item: any, index: any) => {

                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {item.pergunta}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {item.criterio}
                    </TableCell>
                    <TableCell>
                      <Switch value={item.simOuNao} onChange={() => updateNota(item)} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbar>
      </Card>
    </Box>
  )
}
