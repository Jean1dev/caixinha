import { Caixinha } from '@/types/types';
import { InfoOutlined, PeopleAltOutlined } from '@mui/icons-material';
import { Box, Button, Card, Divider, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import DisplayValorMonetario from '../display-valor-monetario';
import { getAleatorio } from '@/utils/utils';

const GRADIENTS = [
    'linear-gradient(135deg,#5475B8,#7691C6)',
    'linear-gradient(135deg,#9176C6,#C7B9E1)',
    'linear-gradient(135deg,#7A86B2,#A2A9CD)',
    'linear-gradient(135deg,#6B82A3,#B3B1D4)',
    'linear-gradient(135deg,#868DB6,#C8C4E5)',
    'linear-gradient(135deg,#8988B8,#AFAEE1)',
]

export const CaixinhaCard = ({ caixinha }: { caixinha: Caixinha }) => {
    const router = useRouter()
    const gradient = getAleatorio(GRADIENTS)

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
                height: '100%',
                borderRadius: 5,
                boxShadow: '0 5px 22px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 32px rgba(0,0,0,0.14)',
                },
            }}
        >
            {/* Gradient header — replaces random external image */}
            <Box sx={{ height: 140, background: gradient }} />

            <Box sx={{ p: 3, textAlign: 'center' }}>
                <DisplayValorMonetario
                    align="center"
                    gutterBottom
                    variant="h5"
                    sx={{ fontWeight: 700 }}
                >
                    {caixinha.currentBalance.value.toFixed(2)}
                </DisplayValorMonetario>
                <Typography align="center" variant="body1" color="text.primary">
                    {caixinha.name}
                </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />
            <Divider />

            <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                sx={{ px: 2, py: 1.5 }}
            >
                <Button
                    size="small"
                    color="inherit"
                    startIcon={<InfoOutlined fontSize="small" />}
                    onClick={detalhes}
                    sx={{ color: 'text.secondary', textTransform: 'none', fontSize: 13 }}
                >
                    Detalhes
                </Button>

                <Stack alignItems="center" direction="row" spacing={1.5}>
                    <Stack alignItems="center" direction="row" spacing={0.5}>
                        <PeopleAltOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography color="text.secondary" variant="body2">
                            {caixinha.members.length}
                        </Typography>
                    </Stack>
                    <Button
                        size="small"
                        variant="text"
                        color="primary"
                        onClick={join}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                        Participar
                    </Button>
                </Stack>
            </Stack>
        </Card>
    );
};
