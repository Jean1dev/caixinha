import { useCallback } from 'react';
import Badge, { badgeClasses } from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

// import { Scrollbar } from 'src/components/scrollbar';

import { OptionsColorPreset } from './options-color-preset';
import { OptionsContrast } from './options-contrast';
import { OptionsDirection } from './options-direction';
import { OptionsLayout } from './options-layout';
import { OptionsNavColor } from './options-nav-color';
import { OptionsColorScheme } from './options-color-scheme';
import { OptionsStretch } from './options-stretch';
import { Scrollbar } from '../scrollbar';
import { CloseOutlined, RefreshOutlined } from '@mui/icons-material';

export const SettingsDrawer = (props: any) => {
  const { canReset, onClose, onUpdate, onReset, open, values = {}, ...other } = props;

  const handleFieldUpdate = useCallback((field: any, value: any) => {
    onUpdate?.({
      [field]: value
    });
  }, [onUpdate]);

  return (
    <Drawer
      disableScrollLock
      anchor="right"
      onClose={onClose}
      open={open}
      ModalProps={{
        BackdropProps: {
          invisible: true
        },
        sx: { zIndex: 1400 }
      }}
      PaperProps={{
        elevation: 24,
        sx: {
          maxWidth: '100%',
          width: 440
        }
      }}
      {...other}>
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%'
          },
          '& .simplebar-scrollbar:before': {
            background: 'var(--nav-scrollbar-color)'
          }
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={3}
          sx={{
            px: 3,
            pt: 2
          }}
        >
          <Typography variant="h6">
            Configurações do app
          </Typography>
          <Stack
            alignItems="center"
            direction="row"
            spacing={0.5}
          >
            <Badge
              anchorOrigin={{
                horizontal: 'right',
                vertical: 'top'
              }}
              color="error"
              sx={{
                [`& .${badgeClasses.badge}`]: {
                  top: 6,
                  right: 6,
                  ...(!canReset && {
                    display: 'none'
                  })
                }
              }}
              variant="dot"
            >
              <IconButton
                color="inherit"
                onClick={onReset}
              >
                <SvgIcon fontSize="small">
                  <RefreshOutlined />
                </SvgIcon>
              </IconButton>
            </Badge>
            <IconButton
              color="inherit"
              onClick={onClose}
            >
              <SvgIcon>
                <CloseOutlined />
              </SvgIcon>
            </IconButton>
          </Stack>
        </Stack>
        <Stack
          spacing={5}
          sx={{ p: 3 }}
        >
          <OptionsColorPreset
            onChange={(value: any) => handleFieldUpdate('colorPreset', value)}
            value={values.colorPreset}
          />
          <OptionsColorScheme
            onChange={(value: any) => handleFieldUpdate('paletteMode', value)}
            value={values.paletteMode}
          />
          {/* <OptionsNavColor
            onChange={(value: any) => handleFieldUpdate('navColor', value)}
            value={values.navColor}
          />
          <OptionsLayout
            onChange={(value: any) => handleFieldUpdate('layout', value)}
            value={values.layout}
          />
          <OptionsStretch
            onChange={(value: any) => handleFieldUpdate('stretch', value)}
            value={values.stretch}
          />
          <OptionsContrast
            onChange={(value: any) => handleFieldUpdate('contrast', value)}
            value={values.contrast}
          />
          <OptionsDirection
            onChange={(value: any) => handleFieldUpdate('direction', value)}
            value={values.direction}
          /> */}
        </Stack>
      </Scrollbar>
    </Drawer>
  );
};
