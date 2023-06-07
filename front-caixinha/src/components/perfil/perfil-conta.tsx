import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography
} from '@mui/material';
import { IUser } from '@/pages/perfil';

export const PerfilDaConta = ({ user }: { user: IUser | null }) => (
    <Card>
        <CardContent>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Avatar
                    src={user?.photoUrl}
                    sx={{
                        height: 80,
                        mb: 2,
                        width: 80
                    }}
                />
                <Typography
                    gutterBottom
                    variant="h5"
                >
                    {user?.name}
                </Typography>
                <Typography
                    color="text.secondary"
                    variant="body2"
                >
                    {user?.email}
                </Typography>
            </Box>
        </CardContent>
        <Divider />
        <CardActions>
            <Button
                fullWidth
                variant="text"
            >
                Atualizar foto
            </Button>
        </CardActions>
    </Card>
);
