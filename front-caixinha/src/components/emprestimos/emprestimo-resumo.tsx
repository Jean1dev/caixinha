import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

function calcularTotal(solicitacao: any) {
    const valorEmprestimo = Number(solicitacao.valor);
    const juros = Number(solicitacao.juros);
    const taxa = Number(solicitacao.fees);
    const total = valorEmprestimo + (valorEmprestimo * (juros / 100)) + taxa;
    return total;
}

export const EmprestimoResumo = (props: any) => {
    const { solicitacao, stateParcelas } = props;

    const formattedShippingTax = `${solicitacao.juros}%`
    const formattedSubtotal = `R$ ${solicitacao.valor}`
    const total = calcularTotal(solicitacao)
    const formattedTotal = `R$ ${total.toFixed(2)}`

    return (
        <Card
            variant="outlined"
            sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Resumo
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Total
            </Typography>
            <Typography variant="h4" gutterBottom>
                {formattedTotal}
            </Typography>
            {
                stateParcelas.loading && <Typography>Calculando parcelamento</Typography>
            }
            <List disablePadding>
                {stateParcelas.data.map((parcela: any, index: any) => {
                    const price = `R$ ${parcela.value}`

                    return (
                        <ListItem key={index} sx={{ py: 1, px: 0 }}>
                            <ListItemText
                                sx={{ mr: 2 }}
                                primary={`parcela ${index + 1}`}
                            />
                            <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                                {price}
                            </Typography>
                        </ListItem>
                    )
                })}
            </List>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 2
                }}
            >
                <Typography variant="body1">
                    Subtotal
                </Typography>
                <Typography variant="body1">
                    {formattedSubtotal}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 2
                }}
            >
                <Typography variant="body1">
                    Taxas
                </Typography>
                <Typography variant="body1">
                    {formattedShippingTax}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 2
                }}
            >
                <Typography variant="body1">
                    Impostos
                </Typography>
                <Typography variant="body1">
                    R$ {solicitacao.fees.toFixed(2)}
                </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <Typography variant="body1">
                    Total
                </Typography>
                <Typography variant="body1">
                    {formattedTotal}
                </Typography>
            </Box>
        </Card>
    );
};

