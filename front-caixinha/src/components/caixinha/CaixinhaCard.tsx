import { Caixinha } from '@/types/types';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { Avatar, Box, Button, Card, CardContent, Divider, Stack, SvgIcon, Typography } from '@mui/material';
import { useRouter } from 'next/router';

export const CaixinhaCard = ({ caixinha }: { caixinha: Caixinha }) => {
    const router = useRouter()

    const join = () => {
        router.push({
            pathname: '/join',
            query: { id: caixinha.id },
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
                <Typography
                    align="center"
                    gutterBottom
                    variant="h5"
                >
                    R${caixinha.currentBalance.value}
                </Typography>
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
                    <SvgIcon
                        color="action"
                        fontSize="small"
                    >
                        <QueryBuilderIcon />
                    </SvgIcon>
                    <Typography
                        color="text.secondary"
                        display="inline"
                        variant="body2"
                    >
                        Ultima movimentação 2hr atrás
                    </Typography>
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
