import { useSettings } from '@/hooks/useSettings';
import { SettingsApplications } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

export const BannerNovidades = (props: any) => {
  const { handleDrawerOpen } = useSettings();

  return (
    <Stack
      alignItems="center"
      direction={{
        xs: 'column',
        md: 'row'
      }}
      spacing={4}
      sx={{
        backgroundColor: (theme) => theme.palette.mode === 'dark'
          ? 'primary.darkest'
          : 'primary.lightest',
        borderRadius: 2.5,
        p: 4
      }}
      {...props}>
      <Box
        sx={{
          width: 200,
          '& img': {
            width: '100%'
          }
        }}
      >
        <img src="/assets/person-standing.png" />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          color="primary.main"
          variant="overline"
        >
          Release 1 liberada
        </Typography>
        <Typography
          color="text.primary"
          sx={{ mt: 2 }}
          variant="h6"
        >
          Mais transparencia, segurança e praticidade
        </Typography>
        <Typography
          color="text.primary"
          sx={{ mt: 1 }}
          variant="body1"
        >
          A caixinha agora é um aplicativo que vai te oferecer ainda mais coisas
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            color="primary"
            onClick={handleDrawerOpen}
            startIcon={(
              <SvgIcon>
                <SettingsApplications />
              </SvgIcon>
            )}
            variant="contained"
          >
            Abrir configurações
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};
