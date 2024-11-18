import Layout from "@/components/Layout";
import { BannerNovidades } from "@/components/bem-vindo/banner-novidades";
import { Dicas } from "@/components/bem-vindo/dicas";
import { AtalhoEmprestimo} from "@/components/bem-vindo/atalho-emprestimo";
import { useSettings } from "@/hooks/useSettings";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Grid from '@mui/material/Unstable_Grid2';
import { Seo } from "@/components/Seo";
import { getAleatorio } from "@/utils/utils";
import { useEffect, useState } from "react";
import { getUltimoEmprestimoPendente } from "./api/api.service";
import { useUserAuth } from "@/hooks/useUserAuth";

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

export default function Home() {
  const router = useRouter()
  const settings = useSettings()
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
    <Layout>
      <Seo title="Caixinha informações" />
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
                          title: 'Caixinha Coin (CapiCoin) Saindo do forno.',
                          content: 'Seja um dos primeiros a começar a usar a nova moeda digital',
                          link: {
                            href: '/token-market',
                            label: 'Saiba mais'
                          }
                        },
                        {
                          title: 'Comece participando de uma caixnha.',
                          content: 'Depois só selecione ali na box ali em cima e esta tudo pronto'
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
              {card("Caixinhas", "listar todas as caixinhas disponiveis", () => { router.push('caixinhas-disponiveis') })}
            </Grid>

            <Grid
              xs={12}
              md={7}
            >

              {card("Depositar", "Fazer um novo deposito na minha caixinha", () => { router.push('deposito') })}

            </Grid>

            <Grid
              xs={12}
              md={7}
            >
              {card("Meu Extrato", "ver todas minhas movimentações", () => { router.push('extrato') })}
            </Grid>

          </Grid>
        </Container>
      </Box>
    </Layout>
  )
}