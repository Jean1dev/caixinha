import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LockClock, Receipt } from '@mui/icons-material';
import { IMeusEmprestimos } from '@/types/types';
import { useTranslation } from 'react-i18next';

export const MeusEmprestimosListSummary = ({ data }: { data: IMeusEmprestimos }) => {
  const total = {
    totalPendente: data.totalPendente,
    totalPago: data.totalPago,
    totalGeral: data.totalGeral
  }
  const { t } = useTranslation()

  return (

    <div>
      <Grid
        container
        spacing={3}
      >
        <Grid
          xs={12}
          md={6}
          lg={4}
        >
          <Card>
            <CardContent>
              <Stack
                alignItems="center"
                direction="row"
                spacing={2}
              >
                <Avatar
                  sx={{
                    height: 48,
                    width: 48
                  }}
                >
                  <Receipt />
                </Avatar>
                <div>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    {t('total')}
                  </Typography>
                  <Typography variant="h6">
                    R$ {total.totalGeral.toFixed(2)}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    {t('emprestimo.referente_ultimos')}
                  </Typography>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          xs={12}
          md={6}
          lg={4}
        >
          <Card>
            <CardContent>
              <Stack
                alignItems="center"
                direction="row"
                spacing={2}
              >
                <Avatar
                  sx={{
                    backgroundColor: 'success.lightest',
                    color: 'success.main',
                    height: 48,
                    width: 48
                  }}
                >
                  <Receipt />
                </Avatar>
                <div>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    {t('pago')}
                  </Typography>
                  <Typography variant="h6">
                    R$ {total.totalPago.toFixed(2)}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    {t('emprestimo.referente_ultimos')}
                  </Typography>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          xs={12}
          md={6}
          lg={4}
        >
          <Card>
            <CardContent>
              <Stack
                alignItems="center"
                direction="row"
                spacing={2}
              >
                <Avatar
                  sx={{
                    backgroundColor: 'warning.lightest',
                    color: 'warning.main',
                    height: 48,
                    width: 48
                  }}
                >
                  <LockClock />
                </Avatar>
                <div>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    {t('emprestimo.pendente_aprovacao')}
                  </Typography>
                  <Typography variant="h6">
                    R$ {total.totalPendente.toFixed(2)}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                  >
                    {t('emprestimo.referente_ultimos')}
                  </Typography>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
