//@ts-nocheck
import { createTheme as createMuiTheme, responsiveFontSizes } from '@mui/material/styles';

import { createOptions as createBaseOptions } from './base/create-options';
import { createOptions as createDarkOptions } from './dark/create-options';
import { createOptions as createLightOptions } from './light/create-options';

export const createTheme = (config) => {
  let theme = createMuiTheme(

    createBaseOptions({
      direction: config.direction
    }),
    config.paletteMode === 'dark'
      ? createDarkOptions({
        colorPreset: config.colorPreset,
        contrast: config.contrast
      })
      : createLightOptions({
        colorPreset: config.colorPreset,
        contrast: config.contrast
      }));

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
