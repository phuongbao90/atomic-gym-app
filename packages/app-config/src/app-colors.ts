import { Colors } from "./app-colors.type";

const pallets = {
  yellow: {
    main: "#FFD600",
    light: "#FFEB3B",
    dark: "#B2A300",
    extraLight: "#FFF9C4",
    extraDark: "#685700",
  },
  green: {
    main: "#00C853",
    light: "#64D89D",
    dark: "#009624",
    extraLight: "#A7F3D0",
    extraDark: "#006412",
  },
  gray: {
    main: "#687076",
    light: "#9BA1A6",
    dark: "#454F54",
    extraLight: "#ECEDEE",
    extraDark: "#11181C",
  },
  red: {
    main: "#CD4525",
    light: "#e46b66",
    dark: "#af2620",
    extraLight: "#f1aeac",
    extraDark: "#901f24",
  },
  blue: {
    main: "#4a48c6",
    light: "#acbaf5",
    dark: "#342ca2",
    extraLight: "#d3dbfc",
    extraDark: "#221483",
  },

  background: {
    black: "#000000",
    white: "#FFFFFF",
    background50: "#FFFFFF",
    background100: "#EEEEEE",
    background200: "#E0E0E0",
    background300: "#BDBDBD",
    background400: "#393939",
    background500: "#2C2C2C",
    background600: "#161616",
    background700: "#000000",
  },

  overlay01: "rgba(0,0,0,0.55)",
  overlay02: "rgba(0,0,0,0.32)",

  onBackgroundLight01: "rgba(0,0,0,0.88)",
  onBackgroundLight02: "rgba(0,0,0,0.50)",
  onBackgroundLight03: "rgba(0,0,0,0.38)",
  onBackgroundLight04: "rgba(0,0,0,0.12)",

  onBackgroundDark01: "rgba(255,255,255,0.88)",
  onBackgroundDark02: "rgba(255,255,255,0.50)",
  onBackgroundDark03: "rgba(255,255,255,0.38)",
  onBackgroundDark04: "rgba(255,255,255,0.12)",
};

const variants = {
  primary: pallets.yellow,
  secondary: pallets.green,
  error: pallets.red,
  info: pallets.blue,
  gray: pallets.gray,
  text: {
    black: "#000000",
    white: "#FFFFFF",
  },
};

const lightColors: Colors = {
  primary: variants.primary.main,
  primaryLight: variants.primary.light,
  primaryDark: variants.primary.dark,
  secondary: variants.secondary.main,
  secondaryLight: variants.secondary.light,
  secondaryDark: variants.secondary.dark,
  error: variants.error.main,
  errorLight: variants.error.light,
  errorDark: variants.error.dark,
  info: variants.info.main,
  infoLight: variants.info.light,
  infoDark: variants.info.dark,
  //
  text: "#000000",
  textPrimary: variants.primary.main,
  textPrimaryLight: variants.primary.light,
  textPrimaryDark: variants.primary.dark,
  textSecondary: variants.gray.main,
  textSecondaryLight: variants.gray.light,
  textSecondaryDark: variants.gray.dark,
  textDisabled: variants.gray.light,
  textBlack: "#000000",
  textWhite: "#FFFFFF",

  background: {
    white: pallets.background.white,
    main: pallets.background.background100,
    dark: pallets.background.background200,
    extraDark: pallets.background.background300,
  },

  ui: {
    button: {
      contained: {
        enabled: {
          background: variants.primary.main,
          text: variants.text.white,
          border: variants.primary.main,
        },
        disabled: {
          background: variants.primary.light,
          text: variants.text.white,
          border: variants.primary.light,
        },
        pressed: {
          background: variants.primary.dark,
          text: variants.text.white,
          border: variants.primary.dark,
        },
      },
      outlined: {
        enabled: {
          background: "transparent",
          text: variants.text.black,
          border: variants.primary.main,
        },
        disabled: {
          background: "transparent",
          text: variants.text.black,
          border: variants.primary.light,
        },
        pressed: {
          background: "transparent",
          text: variants.text.black,
          border: variants.primary.dark,
        },
      },
      text: {
        enabled: {
          background: "transparent",
          text: variants.primary.main,
          border: "transparent",
        },
        disabled: {
          background: "transparent",
          text: variants.primary.main,
          border: "transparent",
        },
        pressed: {
          background: "transparent",
          text: variants.primary.main,
          border: "transparent",
        },
      },
    },
  },
};

const darkColors: Colors = {
  primary: variants.primary.light,
  primaryLight: variants.primary.extraLight,
  primaryDark: variants.primary.main,
  secondary: variants.secondary.light,
  secondaryLight: variants.secondary.extraLight,
  secondaryDark: variants.secondary.main,
  error: variants.error.light,
  errorLight: variants.error.extraLight,
  errorDark: variants.error.main,
  info: variants.info.light,
  infoLight: variants.info.extraLight,
  infoDark: variants.info.main,
  //
  text: "#FFFFFF",
  textPrimary: variants.primary.light,
  textPrimaryLight: variants.primary.extraLight,
  textPrimaryDark: variants.primary.main,
  textSecondary: variants.gray.light,
  textSecondaryLight: variants.gray.extraLight,
  textSecondaryDark: variants.gray.main,
  textDisabled: variants.gray.main,
  textBlack: "#000000",
  textWhite: "#FFFFFF",

  background: {
    white: pallets.background.white,
    main: pallets.background.background500,
    dark: pallets.background.background600,
    extraDark: pallets.background.background700,
  },

  ui: {
    button: {
      contained: {
        enabled: {
          background: variants.primary.light,
          text: variants.text.black,
          border: variants.primary.light,
        },
        disabled: {
          background: variants.primary.extraLight,
          text: variants.text.black,
          border: variants.primary.extraLight,
        },
        pressed: {
          background: variants.primary.dark,
          text: variants.text.black,
          border: variants.primary.dark,
        },
      },
      outlined: {
        enabled: {
          background: "transparent",
          text: variants.text.black,
          border: variants.primary.light,
        },
        disabled: {
          background: "transparent",
          text: variants.text.black,
          border: variants.primary.extraLight,
        },
        pressed: {
          background: "transparent",
          text: variants.text.black,
          border: variants.primary.dark,
        },
      },
      text: {
        enabled: {
          background: "transparent",
          text: variants.primary.light,
          border: "transparent",
        },
        disabled: {
          background: "transparent",
          text: variants.primary.light,
          border: "transparent",
        },
        pressed: {
          background: "transparent",
          text: variants.primary.light,
          border: "transparent",
        },
      },
    },
  },
};

export const appColors = {
  dark: darkColors,
  light: lightColors,
};

export const darkTheme = {
  dark: true,
  colors: {
    primary: darkColors.primary,
    background: darkColors.background,
    card: darkColors.background.main,
    text: darkColors.text,
    border: darkColors.background.dark,
    notification: darkColors.error,
  },
};

export const lightTheme = {
  dark: false,
  colors: {
    primary: lightColors.primary,
    background: lightColors.background,
    card: lightColors.background.main,
    text: lightColors.text,
    border: lightColors.background.dark,
    notification: lightColors.error,
  },
};

export type ColorNameOrHex = keyof Colors | (string & {});
