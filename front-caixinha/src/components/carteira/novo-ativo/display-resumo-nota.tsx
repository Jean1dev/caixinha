import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export const DisplayResumoNota = () => (
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
                7
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
                5
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
                -5
              </Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  </Box>
);
