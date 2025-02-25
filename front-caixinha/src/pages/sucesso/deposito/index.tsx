import Head from 'next/head';
import NextLink from 'next/link';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Box, Button, Container, SvgIcon, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import confetti from "canvas-confetti";
import { keyframes } from '@emotion/react';

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const SucessoDeposito = () => {
  const { t } = useTranslation();

  useEffect(() => {
    confetti({
      particleCount: 600,
      spread: 120,
      origin: { y: 0.6 },
    });
  }, []);

  return (
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
              <img src="https://superex-shreethemes.vercel.app/static/media/10.ffe4457cb971da834bae.gif" alt="Ursinho feliz" style={{ width: '200px', height: '200px' }} />
            </Box>
            <Typography
              align="center"
              sx={{ mb: 3, fontSize: '3rem', animation: `${blink} 1s infinite` }}
              variant="h3"
            >
              Obrigado pelo seu depósito !!!
            </Typography>
            <Typography
              align="center"
              sx={{ mb: 3 }}
              variant="h3"
            >
              Você está ajudando essa caixinha a evoluir
            </Typography>
            <Typography
              align="center"
              color="text.secondary"
              variant="body1"
            >
              {t('notificaremos')}
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
              {t('voltar')}
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default SucessoDeposito;
