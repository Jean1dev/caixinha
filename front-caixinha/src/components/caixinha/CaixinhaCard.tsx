import { Caixinha } from '@/types/types';
import { InfoOutlined, PeopleAltOutlined } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia, Divider, IconButton, Stack, SvgIcon, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import DisplayValorMonetario from '../display-valor-monetario';
import { getAleatorio } from '@/utils/utils';

const images = [
    'https://static.vecteezy.com/system/resources/previews/001/759/904/original/crowdfunding-isometric-web-banner-vector.jpg',
    'https://www.siteware.com.br/wp-content/uploads/2018/07/colaboracao-ambiente-de-trabalho.png',
    'https://www.siteware.com.br/wp-content/uploads/2018/12/colaboracao-corporativa.png',
    'https://www.napratica.org.br/wp-content/uploads/2020/07/btg.jpg',
    'https://i.pinimg.com/736x/e7/5f/ce/e75fcea304308f2718b188c027a58a2d.jpg',
    'https://www.comececomopedireito.com.br/blog/wp-content/uploads/2021/03/Investimentos-para-empresas.jpg'
]

export const CaixinhaCard = ({ caixinha }: { caixinha: Caixinha }) => {
    const router = useRouter()
    const imagemAleatoria = getAleatorio(images)

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
            <CardMedia
                image={imagemAleatoria}
                sx={{ height: 180 }}
            />
            <CardContent>
              
                <DisplayValorMonetario
                    align="center"
                    gutterBottom
                    variant="h5"
                >
                    {caixinha.currentBalance.value.toFixed(2)}
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
                             Detalhes
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
                        <PeopleAltOutlined />
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
