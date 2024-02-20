import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
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
    const formattedSubtotal = `R$${solicitacao.valor}`
    const total = calcularTotal(solicitacao)
    const formattedTotal = `R$${total}`

    return (
        <Card
            variant="outlined"
            sx={{ p: 3 }}>
            <Typography variant="h6">
                Resumo
            </Typography>
            {
                stateParcelas.loading && <Typography>Calculando parcelamento</Typography>
            }
            <List sx={{ mt: 2 }}>
                {stateParcelas.data.map((parcela: any, index: any) => {
                    const price = `R$${parcela.value}`

                    return (
                        <ListItem
                            disableGutters
                            key={index}
                        >
                            <ListItemAvatar sx={{ pr: 2 }}>
                                <Box
                                    sx={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        height: 100,
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        width: 100,
                                        '& img': {
                                            width: '100%',
                                            height: 'auto'
                                        }
                                    }}
                                >
                                    {/* <img
                    alt={product.name}
                    src={product.image}
                  /> */}
                                </Box>
                            </ListItemAvatar>
                            <ListItemText
                                primary={(
                                    <Typography
                                        sx={{ fontWeight: 'fontWeightBold' }}
                                        variant="subtitle2"
                                    >
                                        parcela {index + 1}
                                    </Typography>
                                )}
                                secondary={(
                                    <Typography
                                        color="text.secondary"
                                        sx={{ mt: 1 }}
                                        variant="body1"
                                    >
                                        {price}
                                    </Typography>
                                )}
                            />
                        </ListItem>
                    );
                })}
            </List>
            {/* <OutlinedInput
                fullWidth
                placeholder="Discount Code"
                size="small"
                sx={{ mt: 2 }}
            />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 2
                }}
            >
                <Button type="button">
                    Apply Coupon
                </Button>
            </Box> */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 2
                }}
            >
                <Typography variant="subtitle2">
                    Subtotal
                </Typography>
                <Typography variant="subtitle2">
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
                <Typography variant="subtitle2">
                    Taxas
                </Typography>
                <Typography variant="subtitle2">
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
                <Typography variant="subtitle2">
                    Impostos
                </Typography>
                <Typography variant="subtitle2">
                    {solicitacao.fees}
                </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <Typography variant="subtitle2">
                    Total
                </Typography>
                <Typography variant="subtitle2">
                    {formattedTotal}
                </Typography>
            </Box>
        </Card>
    );
};

