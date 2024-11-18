import WalletIcon from '@mui/icons-material/Wallet';
import Layout from "@/components/Layout";
import { RouterLink } from "@/components/RouterLink";
import { Seo } from "@/components/Seo";
import { useSettings } from "@/hooks/useSettings";
import { Box, Button, Container, Rating, Stack, SvgIcon, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

export default function TokenMarket() {
    const settings = useSettings()

    return (
        <Layout>
            <Seo title="Token Market" />
            <Box component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}>
                <Container maxWidth={settings.stretch ? false : 'xl'}>
                    <Grid container
                        spacing={{
                            xs: 3,
                            lg: 4
                        }}>
                        <Grid
                            xs={12}
                            md={7}>

                            <Box maxWidth="sm">
                                <Typography
                                    variant="h1"
                                    sx={{ mb: 2 }}
                                >
                                    Featuring&nbsp;
                                    <Typography
                                        component="span"
                                        color="primary.main"
                                        variant="inherit"
                                    >
                                        DREX Caixinha
                                    </Typography>
                                    , decentralized and secure.
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    sx={{
                                        fontSize: 20,
                                        fontWeight: 500
                                    }}
                                >
                                    Cryptocurrencies offer a decentralized and secure way to conduct transactions, providing
                                    greater privacy and lower transaction fees compared to traditional financial systems. They
                                    enable fast and borderless transfers, making it easier to engage in global commerce and
                                    investment opportunities.
                                </Typography>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    flexWrap="wrap"
                                    spacing={1}
                                    sx={{ my: 3 }}
                                >
                                    <Rating
                                        readOnly
                                        value={4.7}
                                        precision={0.1}
                                        max={5}
                                    />
                                    <Typography
                                        color="text.primary"
                                        variant="caption"
                                        sx={{ fontWeight: 700 }}
                                    >
                                        4.7/5
                                    </Typography>
                                    <Typography
                                        color="text.secondary"
                                        variant="caption"
                                    >
                                        based on (70+ reviews)
                                    </Typography>
                                </Stack>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    spacing={2}
                                >
                                    <Button
                                        component={RouterLink}
                                        href={"/"}
                                        startIcon={(
                                            <SvgIcon fontSize="small">
                                                <WalletIcon />
                                            </SvgIcon>
                                        )}
                                        sx={(theme) => theme.palette.mode === 'dark'
                                            ? {
                                                backgroundColor: 'neutral.50',
                                                color: 'neutral.900',
                                                '&:hover': {
                                                    backgroundColor: 'neutral.200'
                                                }
                                            }
                                            : {
                                                backgroundColor: 'neutral.900',
                                                color: 'neutral.50',
                                                '&:hover': {
                                                    backgroundColor: 'neutral.700'
                                                }
                                            }}
                                        variant="contained"
                                    >
                                        Create Wallet
                                    </Button>
                                </Stack>
                            </Box>
                        </Grid>

                        <Grid
                            xs={12}
                            md={5}
                        >
                            <div className="media-icon">
                                <img
                                    alt="Rocket"
                                    src={"assets/crypto/images/capicoin.png"}
                                    width={500}
                                    height={500}
                                />
                            </div>
                        </Grid>

                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
}