import { Caixinha } from '@/types/types';
import { InfoOutlined } from '@mui/icons-material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { Avatar, Box, Button, Card, CardContent, Divider, IconButton, Stack, SvgIcon, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import DisplayValorMonetario from '../display-valor-monetario';

export const CaixinhaCard = ({ caixinha }: { caixinha: Caixinha }) => {
    const router = useRouter()

    const join = () => {
        router.push({
            pathname: '/join',
            query: { id: caixinha.id },
        })
    }

    const detalhes = () => {
        router.push({
            pathname: '/analise-caixinha',
            query: { unique: caixinha.id },
        })
    }

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        pb: 3
                    }}
                >
                    <Avatar
                        src='https://png.pngtree.com/png-clipart/20200225/original/pngtree-coin-money-icon-png-image_5278199.jpg'
                        variant="square"
                    />
                </Box>
                <DisplayValorMonetario
                    //@ts-ignore
                    align="center"
                    gutterBottom
                    variant="h5"
                >
                    {caixinha.currentBalance.value}
                </DisplayValorMonetario>
                <Typography
                    align="center"
                    variant="body1"
                >
                    {caixinha.name}
                </Typography>
            </CardContent>
            <Box sx={{ flexGrow: 1 }} />
            <Divider />
            <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                spacing={2}
                sx={{ p: 2 }}
            >
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                >
                    <IconButton onClick={detalhes}>
                        <SvgIcon
                            color="action"
                            fontSize="small"
                        >
                            <InfoOutlined />
                        </SvgIcon>
                        <Typography
                            color="text.secondary"
                            display="inline"
                            variant="body2"
                        >
                            clique para ver os detalhes
                        </Typography>
                    </IconButton>
                </Stack>
                <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                >
                    <SvgIcon
                        color="action"
                        fontSize="small"
                    >
                        <ArrowDownwardIcon />
                    </SvgIcon>
                    <Typography
                        color="text.secondary"
                        display="inline"
                        variant="body2"
                    >
                        {caixinha.members.length} Participantes
                    </Typography>
                    <Button onClick={join}
                    >
                        Participar
                    </Button>
                </Stack>
            </Stack>
        </Card>
    );
};
