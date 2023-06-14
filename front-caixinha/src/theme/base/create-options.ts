//@ts-nocheck
import { createTypography } from './create-typography';
import { createComponents } from './create-components.js';

export const createOptions = (config) => {
  const { direction = 'ltr' } = config;

  return {
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440
      }
    },
    components: createComponents(),
    direction,
    shape: {
      borderRadius: 8
    },
    typography: createTypography()
  };
};
