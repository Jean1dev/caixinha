import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';

export const CriarCarteiraNova = (props: any) => (
    <Card {...props}>
        <Stack
            alignItems="center"
            spacing={2}
            sx={{ p: 3 }}
        >
            <Box
                sx={{
                    width: 100,
                    '& img': {
                        width: '100%'
                    }
                }}
            >
                <img src="/assets/iconly/iconly-glass-tick.svg" />
            </Box>
            <Typography
                align="center"
                variant="h6"
            >
                Crie uma nova carteira agora.
            </Typography>
            <Typography
                align="center"
                variant="body2"
            >
                Utilize o diagrama para receber as recomendações de aporte.
            </Typography>
            <Button LinkComponent={NextLink}
                href="/nova-carteira"
                variant="contained">
                Criar agora
            </Button>
        </Stack>
    </Card>
);
