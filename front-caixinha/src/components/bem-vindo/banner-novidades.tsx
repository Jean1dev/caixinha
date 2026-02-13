import Image from 'next/image';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from 'react-i18next';
import { SettingsApplications } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

export const BannerNovidades = (props: any) => {
  const { handleDrawerOpen } = useSettings();
  const { t } = useTranslation();

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
        <Image src="/assets/person-standing.png" alt="" width={200} height={200} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          color="primary.main"
          variant="overline"
        >
          {t('banner_novidades.title')}
        </Typography>
        <Typography
          color="text.primary"
          sx={{ mt: 2 }}
          variant="h6"
        >
          {t('banner_novidades.content')}
        </Typography>
        <Typography
          color="text.primary"
          sx={{ mt: 1 }}
          variant="body1"
        >
          {t('banner_novidades.content2')}
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
            {t('banner_novidades.btn_click')}
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};
