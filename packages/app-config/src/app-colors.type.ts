export type Colors = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  error: string;
  errorLight: string;
  errorDark: string;
  info: string;
  infoLight: string;
  infoDark: string;
  // Text colors
  text: string;
  textPrimary: string;
  textPrimaryLight: string;
  textPrimaryDark: string;
  textSecondary: string;
  textSecondaryLight: string;
  textSecondaryDark: string;
  textDisabled: string;
  textBlack: string;
  textWhite: string;

  // Backgrounds
  background: {
    white: string;
    main: string;
    dark: string;
    extraDark: string;
  };

  // UI
  ui: {
    button: UiButtonVariants;
  };
};

type UiButtonVariantColors = {
  enabled: {
    background: string;
    text: string;
    border: string;
  };
  disabled: {
    background: string;
    text: string;
    border: string;
  };
  pressed: {
    background: string;
    text: string;
    border: string;
  };
};

export type UiButtonVariants = {
  contained: UiButtonVariantColors;
  outlined: UiButtonVariantColors;
  text: UiButtonVariantColors;
};
