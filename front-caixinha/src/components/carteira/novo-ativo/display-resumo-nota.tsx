import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Diagrama } from './diagrama';
import { useCallback, useEffect, useState } from 'react';
import { getCriterios } from '@/pages/api/api.carteira';

export const DisplayResumoNota = ({ tipoAtivo, changeNota }: { tipoAtivo: string, changeNota: Function }) => {
  const [criterios, setCriterios] = useState<any>([])
  const [nota, setNota] = useState({
    positivos: 0,
    negativos: 0,
    total: 0
  })

  useEffect(() => {
    if (tipoAtivo == "" || !tipoAtivo)
      return

    getCriterios(tipoAtivo).then(response => {
      setCriterios(response)
      setNota({
        positivos: 0,
        negativos: response.length,
        total: 0 - response.length
      })
    })
  }, [tipoAtivo])

  const updateNota = useCallback((criterio: any) => {
    setCriterios(criterios.map((item: any) => {
      const copy = { ...item }
      if (item.pergunta === criterio.pergunta) {
        copy['simOuNao'] = !copy['simOuNao']
      }

      return copy
    }))

    let positivos = nota.positivos, negativos = nota.negativos, total = 0
    if (criterio['simOuNao']) {
      positivos--
      negativos++
      total = positivos - negativos
    } else {
      positivos++
      negativos--
      total = positivos - negativos
    }

    setNota({
      positivos,
      negativos,
      total
    })

    changeNota({
      target: {
        name: 'nota',
        value: total
      }
    })
  }, [criterios, nota, changeNota])

  if (!criterios.length) {
    return <></>
  }

  return (
    <>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'neutral.800'
            : 'neutral.100',
          p: 3
        }}
      >
        <Card>
          <Grid
            container
            sx={{
              '& > *:not(:last-of-type)': {
                borderRight: (theme) => ({
                  md: `1px solid ${theme.palette.divider}`
                }),
                borderBottom: (theme) => ({
                  xs: `1px solid ${theme.palette.divider}`,
                  md: 'none'
                })
              }
            }}
          >
            <Grid
              xs={12}
              sm={6}
              md={3}
            >
              <Stack
                alignItems="center"
                spacing={1}
                sx={{ p: 3 }}
              >
                <Typography
                  color="text.secondary"
                  component="h2"
                  variant="overline"
                >
                  Pontos Positivos
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Typography variant="h5">
                    {nota.positivos}
                  </Typography>

                </Stack>
              </Stack>
            </Grid>
            <Grid
              xs={12}
              sm={6}
              md={3}
            >
              <Stack
                alignItems="center"
                spacing={1}
                sx={{ p: 3 }}
              >
                <Typography
                  color="text.secondary"
                  component="h5"
                  variant="overline"
                >
                  Pontos Negativos
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Typography variant="h5">
                    {nota.negativos}
                  </Typography>

                </Stack>
              </Stack>
            </Grid>
            <Grid
              xs={12}
              sm={6}
              md={3}
            >
              <Stack
                alignItems="center"
                spacing={1}
                sx={{ p: 3 }}
              >
                <Typography
                  color="text.secondary"
                  component="h2"
                  variant="overline"
                >
                  Resultado
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Typography variant="h5">
                    {nota.total}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Box>
      <Diagrama criterios={criterios} updateNota={updateNota} />
    </>
  )
}
