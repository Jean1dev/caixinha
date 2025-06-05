import Layout from "@/components/Layout";
import { BannerNovidades } from "@/components/bem-vindo/banner-novidades";
import { Dicas } from "@/components/bem-vindo/dicas";
import { AtalhoEmprestimo } from "@/components/bem-vindo/atalho-emprestimo";
import { useSettings } from "@/hooks/useSettings";
import { Box, Card, CardContent, Container, Typography, Stack } from "@mui/material";
import { useRouter } from "next/router";
import Grid from '@mui/material/Unstable_Grid2';
import { Seo } from "@/components/Seo";
import { getAleatorio } from "@/utils/utils";
import { useEffect, useState } from "react";
import { getUltimoEmprestimoPendente } from "./api/api.service";
import { useUserAuth } from "@/hooks/useUserAuth";
import { Footer } from "@/components/footer";
import { useTranslation } from "react-i18next";
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const corAleatoriaCombinada = () => {
  const cores = [
    "#5475B8-#7691C6",
    "#9176C6-#C7B9E1",
    "#7A86B2-#A2A9CD",
    "#6B82A3-#B3B1D4",
    "#868DB6-#C8C4E5",
    "#9599BA-#D0D2EA",
    "#8988B8-#AFAEE1"
  ]
  return getAleatorio(cores)
}

const card = (title: string, description: string, action: any, icon: any) => {
  const cor = corAleatoriaCombinada().split('-')
  return (
    <Card
      onClick={action}
      variant="elevation"
      sx={{
        background: `linear-gradient(135deg, ${cor[0]}, ${cor[1]})`,
        boxShadow: 6,
        borderRadius: 4,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.03)',
          boxShadow: 12,
          opacity: 0.95
        },
        p: 2,
        minHeight: 140,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          {icon}
          <Typography variant="h5" component="div" fontWeight={700} color="white">
            {title}
          </Typography>
        </Stack>
        <Typography variant="body2" color="white">
          {description}
        </Typography>
      </CardContent>
    </Card>
  )
}

const Page = () => {
  const router = useRouter()
  const settings = useSettings()
  const { t } = useTranslation()

  const [ultimoEmprestimoAtalho, setUltimoEmprestimoAtalho] = useState<any | null>(null)
  const { user } = useUserAuth()

  useEffect(() => {
    if (user.name === '' || !user) {
      return
    }
    getUltimoEmprestimoPendente(user.name, user.email)
      .then((response) => {
        if (response.exists) {
          setUltimoEmprestimoAtalho(response)
        }
      })
  }, [user])

  return (
    <Box component="main"
      sx={{
        flexGrow: 1,
        minHeight: '100vh',
        py: 8,
      }}>
      <Container maxWidth={settings.stretch ? false : 'xl'}>
        <Stack spacing={4} alignItems="center" mb={4}>
          <Typography variant="h3" fontWeight={700} align="center">
            Bem-vindo à Caixinha!
          </Typography>
        </Stack>
        <Grid
          container
          spacing={{
            xs: 3,
            lg: 4
          }}
        >
          <Grid xs={12} md={7}>
            <BannerNovidades />
          </Grid>
          <Grid xs={12} md={5}>
            {
              ultimoEmprestimoAtalho?.exists
                ? (
                  <AtalhoEmprestimo emprestimo={ultimoEmprestimoAtalho.data} />
                )
                : (
                  <Dicas
                    sx={{ height: '100%' }}
                    tips={[
                      {
                        title: t('dicas.0.title'),
                        content: t('dicas.0.content'),
                        link: {
                          href: '/token-market',
                          label: t('dicas.0.link_label')
                        }
                      },
                      {
                        title: t('dicas.1.title'),
                        content: t('dicas.1.content')
                      }
                    ]}
                  />
                )
            }
          </Grid>
          <Grid xs={12} md={7}>
            {card(
              "Caixinhas",
              t('listar_caixinha_disponiveis'),
              () => { router.push('caixinhas-disponiveis') },
              <SavingsIcon sx={{ color: 'white', fontSize: 36 }} />
            )}
          </Grid>
          <Grid xs={12} md={7}>
            {card(
              "Depositar",
              t('depositar'),
              () => { router.push('deposito') },
              <AccountBalanceWalletIcon sx={{ color: 'white', fontSize: 36 }} />
            )}
          </Grid>
          <Grid xs={12} md={7}>
            {card(
              "Pedir emprestimo",
              t('emprestimo.solicitar_emprestimo'),
              () => { router.push('emprestimo') },
              <AddCircleOutlineIcon sx={{ color: 'white', fontSize: 36 }} />
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default function Home() {
  return (
    <Layout>
      <>
        <Seo title="Home" />
        <Page />
        <Footer />
      </>
    </Layout>
  )
}