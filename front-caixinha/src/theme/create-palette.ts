import { common } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';
import { error, indigo, indigoDark, info, neutral, neutralDark, success, warning } from './colors';

export function createPalette(mode: 'light' | 'dark') {
  if (mode === 'light') {
    return {
      action: {
        active: neutral[500],
        disabled: alpha(neutral[900], 0.38),
        disabledBackground: alpha(neutral[900], 0.12),
        focus: alpha(neutral[900], 0.16),
        hover: alpha(neutral[900], 0.04),
        selected: alpha(neutral[900], 0.12)
      },
      background: {
        default: common.white,
        paper: common.white,
      },
      divider: '#F2F4F7',
      error,
      info,
      mode,
      neutral,
      primary: indigo,
      success,
      text: {
        primary: neutral[900],
        secondary: neutral[500],
        disabled: alpha(neutral[900], 0.38)
      },
      warning
    };
  }

  return {
    action: {
      active: neutralDark[500],
      disabled: alpha(neutralDark[900], 0.38),
      disabledBackground: alpha(neutralDark[900], 0.12),
      focus: alpha(neutralDark[900], 0.16),
      hover: alpha(neutralDark[900], 0.04),
      selected: alpha(neutralDark[900], 0.12)
    },
    background: {
      default: '#222222',
      paper: '#222222',
    },
    divider: '#222222',
    error,
    info,
    mode,
    neutral,
    primary: indigoDark,
    success,
    text: {
      primary: neutralDark[900],
      secondary: neutralDark[500],
      disabled: alpha(neutralDark[900], 0.38)
    },
    warning
  };
}
