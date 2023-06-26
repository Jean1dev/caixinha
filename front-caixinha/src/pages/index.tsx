import Layout from "@/components/Layout";
import { BannerNovidades } from "@/components/bem-vindo/banner-novidades";
import { Dicas } from "@/components/bem-vindo/dicas";
import { useSettings } from "@/hooks/useSettings";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Grid from '@mui/material/Unstable_Grid2';
import { Seo } from "@/components/Seo";

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

  const indiceAleatorio = Math.floor(Math.random() * cores.length);
  return cores[indiceAleatorio];
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

  return (
    <Layout>
      <Seo title="Caixinha informações"/>
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
              <Dicas
                sx={{ height: '100%' }}
                tips={[
                  {
                    title: 'Comece participando de uma caixnha.',
                    content: 'Depois só selecione ali na box ali em cima e esta tudo pronto'
                  }
                ]}
              />

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

              {card("Pagar emprestimo", "Pagar meu ultimo emprestimo pendente", () => { router.push('error') })}

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