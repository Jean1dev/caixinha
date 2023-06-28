import { TrendingUp } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

export const MinhasCarteirasList = (props: any) => {
    const { carteiras } = props

    return (
        <Card>
            <CardHeader title="Carteiras" />
            <List disablePadding>
                {carteiras.map((carteira: any) => {

                    return (
                        <ListItem
                            key={carteira.id}
                            divider
                        >
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        backgroundColor: 'success.alpha4',
                                        color: 'success.main'
                                    }}
                                >
                                    <SvgIcon>
                                        <TrendingUp/>
                                    </SvgIcon>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText>
                                <Typography variant="subtitle2">
                                    {carteira.nome}
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    variant="body2"
                                >
                                    quantidade de ativos {carteira.quantidadeAtivos}
                                </Typography>
                            </ListItemText>
                        </ListItem>
                    );
                })}
            </List>
        </Card>
    );
};

