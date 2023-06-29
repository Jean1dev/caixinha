import { ArrowDownward, ArrowUpward, SavingsRounded } from '@mui/icons-material';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import DisplayValorMonetario from '../display-valor-monetario';

export const SaldoTotal = (props: any) => {
  const { difference, positive = false, sx, value } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              Saldo total
            </Typography>
            <DisplayValorMonetario
              variant="h4">
              {value}
            </DisplayValorMonetario>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'error.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <SavingsRounded />
            </SvgIcon>
          </Avatar>
        </Stack>
        {difference && (
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Stack
              alignItems="center"
              direction="row"
              spacing={0.5}
            >
              <SvgIcon
                color={positive ? 'success' : 'error'}
                fontSize="small"
              >
                {positive ? <ArrowUpward /> : <ArrowDownward />}
              </SvgIcon>
              <Typography
                color={positive ? 'success.main' : 'error.main'}
                variant="body2"
              >
                {difference}%
              </Typography>
            </Stack>
            <Typography
              color="text.secondary"
              variant="caption"
            >
              CDI
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
