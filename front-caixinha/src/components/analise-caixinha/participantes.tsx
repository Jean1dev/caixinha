import { AddReactionOutlined } from '@mui/icons-material';
import {
    Box,
    Card,
    CardHeader,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    SvgIcon
} from '@mui/material';

export const Participantes = (props: any) => {
    const { participantes = [], sx } = props;

    return (
        <Card sx={sx}>
            <CardHeader title="Membros" />
            <List>
                {participantes.map((pessoa: any, index: any) => {
                    const hasDivider = index < pessoa.length - 1;

                    return (
                        <ListItem
                            divider={hasDivider}
                            key={index}
                        >
                            <ListItemAvatar>
                                {
                                    pessoa.photoUrl
                                        ? (
                                            <Box
                                                component="img"
                                                src={pessoa.photoUrl}
                                                sx={{
                                                    borderRadius: 1,
                                                    height: 48,
                                                    width: 48
                                                }}
                                            />
                                        )
                                        : (
                                            <Box
                                                sx={{
                                                    borderRadius: 1,
                                                    backgroundColor: 'neutral.200',
                                                    height: 48,
                                                    width: 48
                                                }}
                                            />
                                        )
                                }
                            </ListItemAvatar>
                            <ListItemText
                                primary={pessoa.name}
                                primaryTypographyProps={{ variant: 'subtitle1' }}
                                secondaryTypographyProps={{ variant: 'body2' }}
                            />
                            <IconButton edge="end">
                                <SvgIcon>
                                    <AddReactionOutlined />
                                </SvgIcon>
                            </IconButton>
                        </ListItem>
                    );
                })}
            </List>
        </Card>
    );
};
