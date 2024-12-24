import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SeverityPill } from '../severity-pill';
import { PropertyListItem } from '../property-list-item';
import { PropertyList } from '../property-list';

export const CompraAtivoDrawerDetails = (props: any) => {
    const { onApprove, onReject, data } = props;
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

    const align = lgUp ? 'horizontal' : 'vertical';
    const createdAt = new Date().toDateString();
    const statusColor = data?.disponivel ? 'success' : 'error';

    return (
        <Stack spacing={6}>
            <Stack spacing={3}>
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                >
                    <Typography variant="h6">
                        Details
                    </Typography>
                </Stack>
                <PropertyList>
                    <PropertyListItem
                        align={align}
                        disableGutters
                        divider
                        label="ID"
                        value={data.id}
                    />
                    <PropertyListItem
                        align={align}
                        disableGutters
                        divider
                        label="Codigo"
                        value={data.nome}
                    />
                    <PropertyListItem
                        align={align}
                        disableGutters
                        divider
                        label="Informacoes"
                    >
                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >
                            valor {data.valor}
                        </Typography>
                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >
                            variacao %{data.variacao}
                        </Typography>
                    </PropertyListItem>
                    <PropertyListItem
                        align={align}
                        disableGutters
                        divider
                        label="Ultima Atualizacao"
                        value={createdAt}
                    />
                    <PropertyListItem
                        align={align}
                        disableGutters
                        divider
                        label="Status"
                    >
                        <SeverityPill color={statusColor}>
                            {data.disponivel ? 'Disponível' : 'Indisponível'}
                        </SeverityPill>
                    </PropertyListItem>
                </PropertyList>
                <Stack
                    alignItems="center"
                    direction="row"
                    flexWrap="wrap"
                    justifyContent="flex-end"
                    spacing={2}
                >
                    <Button
                        onClick={onApprove}
                        size="small"
                        variant="contained"
                    >
                        Comprar
                    </Button>
                    <Button
                        color="error"
                        onClick={onReject}
                        size="small"
                        variant="outlined"
                    >
                        Reject
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    );
};