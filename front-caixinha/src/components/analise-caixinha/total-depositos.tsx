import { ArrowDownward, ArrowUpward, VerifiedUserSharp } from '@mui/icons-material';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import DisplayValorMonetario from '../display-valor-monetario';

export const TotalDepositos = (props: any) => {
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
              Total depositos
            </Typography>
            <DisplayValorMonetario
              variant="h4">
              R$ {value}
            </DisplayValorMonetario>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'success.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <VerifiedUserSharp />
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
              comparação ao mes passado
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

