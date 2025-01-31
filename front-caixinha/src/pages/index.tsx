import Layout from "@/components/Layout";
import { BannerNovidades } from "@/components/bem-vindo/banner-novidades";
import { Dicas } from "@/components/bem-vindo/dicas";
import { AtalhoEmprestimo } from "@/components/bem-vindo/atalho-emprestimo";
import { useSettings } from "@/hooks/useSettings";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Grid from '@mui/material/Unstable_Grid2';
import { Seo } from "@/components/Seo";
import { getAleatorio } from "@/utils/utils";
import { useEffect, useState } from "react";
import { getUltimoEmprestimoPendente } from "./api/api.service";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useTranslations } from "@/hooks/useTranlations";
import { Footer } from "@/components/footer";

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

const card = (title: string, description: string, action: any) => {
  const cor = corAleatoriaCombinada().split('-')
  return (
    <Card
      onClick={action}
      variant="elevation"
      sx={{
        backgroundColor: cor[0],
        shadowOpacity: 50,
        "& :hover": {
          backgroundColor: cor[1],
          opacity: 1
        }
      }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2">
          {description}
        </Typography>
      </CardContent>
    </Card>
  )
}

const Page = () => {
  const router = useRouter()
  const settings = useSettings()
  const { t } = useTranslations()

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
        py: 8
      }}>
      <Container maxWidth={settings.stretch ? false : 'xl'}>
        <Grid
          container
          spacing={{
            xs: 3,
            lg: 4
          }}
        >
          <Grid
            xs={12}
            md={7}
          >
            <BannerNovidades />
          </Grid>

          <Grid
            xs={12}
            md={5}
          >
            {
              ultimoEmprestimoAtalho?.exists
                ? (
                  <>
                    <AtalhoEmprestimo emprestimo={ultimoEmprestimoAtalho.data} />
                  </>
                )

                : (
                  <Dicas
                    sx={{ height: '100%' }}
                    tips={[
                      {
                        title: t.dicas[0].title,
                        content: t.dicas[0].content,
                        link: {
                          href: '/token-market',
                          label: t.dicas[0].link_label
                        }
                      },
                      {
                        title: t.dicas[0].title,
                        content: t.dicas[0].content
                      }
                    ]}
                  />
                )
            }

          </Grid>

          <Grid
            xs={12}
            md={7}
          >
            {card("Caixinhas", t.listar_caixinha_disponiveis, () => { router.push('caixinhas-disponiveis') })}
          </Grid>

          <Grid
            xs={12}
            md={7}
          >

            {card("Depositar", t.depositar, () => { router.push('deposito') })}

          </Grid>

          <Grid
            xs={12}
            md={7}
          >
            {card("Pedir emprestimo", t.emprestimo.solicitar_emprestimo, () => { router.push('emprestimo') })}
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