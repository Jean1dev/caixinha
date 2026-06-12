import { ArrowDownward, ArrowUpward, SavingsRounded } from '@mui/icons-material';
import { Avatar, Box, Card, Stack, SvgIcon, Typography } from '@mui/material';
import DisplayValorMonetario from '../display-valor-monetario';

export const CardTotal = (props: any) => {
  const {
    difference,
    positive = false,
    sx,
    value,
    displayText = '',
    displayText2 = '',
    icon = (<SavingsRounded />)
  } = props;

  return (
    <Card
      sx={{
        borderRadius: 5,
        boxShadow: '0 5px 22px rgba(0,0,0,0.08)',
        p: 3,
        ...sx,
      }}
    >
      <Stack
        alignItems="flex-start"
        direction="row"
        justifyContent="space-between"
        spacing={1.5}
      >
        <Box>
          <Typography
            color="text.secondary"
            variant="overline"
            sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.5px', lineHeight: 2 }}
          >
            {displayText}
          </Typography>
          <DisplayValorMonetario
            variant="h5"
            sx={{ fontWeight: 600, fontSize: 28, mt: 0.5 }}
          >
            {value}
          </DisplayValorMonetario>
        </Box>
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            height: 56,
            width: 56,
            flexShrink: 0,
          }}
        >
          <SvgIcon>{icon}</SvgIcon>
        </Avatar>
      </Stack>

      {difference && (
        <Stack alignItems="center" direction="row" spacing={1} sx={{ mt: 2 }}>
          <Stack alignItems="center" direction="row" spacing={0.5}>
            <SvgIcon color={positive ? 'success' : 'error'} fontSize="small">
              {positive ? <ArrowUpward /> : <ArrowDownward />}
            </SvgIcon>
            <Typography
              color={positive ? 'success.main' : 'error.main'}
              variant="body2"
              fontWeight={500}
            >
              {difference}%
            </Typography>
          </Stack>
          {displayText2 && (
            <Typography color="text.secondary" variant="caption">
              {displayText2}
            </Typography>
          )}
        </Stack>
      )}
    </Card>
  );
};
