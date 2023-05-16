import Head from 'next/head';
import NextLink from 'next/link';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { Box, Button, Container, SvgIcon, Typography } from '@mui/material';

const Sucesso = () => (
  <>
    <Head>
      <title>
        Caixinha
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%'
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              mb: 3,
              textAlign: 'center'
            }}
          >
          </Box>
          <Typography
            align="center"
            sx={{ mb: 3 }}
            variant="h3"
          >
            Sucesso
          </Typography>
          <Typography
            align="center"
            color="text.secondary"
            variant="body1"
          >
            Notificaremos os outros membros
          </Typography>
          <Button
            component={NextLink}
            href="/"
            startIcon={(
              <SvgIcon fontSize="small">
                <ArrowDownwardIcon />
              </SvgIcon>
            )}
            sx={{ mt: 3 }}
            variant="contained"
          >
            Go back to dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  </>
);

export default Sucesso;
