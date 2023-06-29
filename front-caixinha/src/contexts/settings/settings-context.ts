import { createContext } from 'react';

export const defaultSettings = {
  colorPreset: 'indigo',
  contrast: 'normal',
  direction: 'ltr',
  layout: 'vertical',
  navColor: 'evident',
  paletteMode: 'light',
  responsiveFontSizes: true,
  stretch: false
};

export const initialState = {
  ...defaultSettings,
  isInitialized: false,
  openDrawer: false,
  showValoresMonetarios: false
};

export const SettingsContext = createContext({
  ...initialState,
  handleDrawerClose: () => { },
  handleDrawerOpen: () => { },
  handleReset: () => { },
  handleUpdate: (settings: any) => { },
  isCustom: false,
  handleShowValoresMonetarios: () => { }
});
