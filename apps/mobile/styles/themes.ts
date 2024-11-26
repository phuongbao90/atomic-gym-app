import { appColors } from "@repo/app-config/app-colors";

const margins = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
};
const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};
const spacing = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
};

export const lightTheme = {
  colors: {
    typography: "#000000",
    background: "#ffffff",
  },
  margins,
  radius,
  spacing,
  button: {
    text: {
      enabled: {
        background: "transparent",
        border: "transparent",
        color: appColors.light.ui.button.text.enabled.text,
      },
      disabled: {
        background: "transparent",
        border: "transparent",
        color: appColors.light.ui.button.text.disabled.text,
      },
      pressed: {
        background: "transparent",
        border: "transparent",
        color: appColors.light.ui.button.text.pressed.text,
      },
    },
    outlined: {
      enabled: {
        background: appColors.light.ui.button.outlined.enabled.background,
        color: appColors.light.ui.button.outlined.enabled.text,
        border: appColors.light.ui.button.outlined.enabled.border,
      },
      disabled: {
        background: appColors.light.ui.button.outlined.disabled.background,
        color: appColors.light.ui.button.outlined.disabled.text,
        border: appColors.light.ui.button.outlined.disabled.border,
      },
      pressed: {
        background: appColors.light.ui.button.outlined.pressed.background,
        color: appColors.light.ui.button.outlined.pressed.text,
        border: appColors.light.ui.button.outlined.pressed.border,
      },
    },
    contained: {
      enabled: {
        background: appColors.light.ui.button.contained.enabled.background,
        color: appColors.light.ui.button.contained.enabled.text,
        border: appColors.light.ui.button.contained.enabled.border,
      },
      disabled: {
        background: appColors.light.ui.button.contained.disabled.background,
        color: appColors.light.ui.button.contained.disabled.text,
        border: appColors.light.ui.button.contained.disabled.border,
      },
      pressed: {
        background: appColors.light.ui.button.contained.pressed.background,
        color: appColors.light.ui.button.contained.pressed.text,
        border: appColors.light.ui.button.contained.pressed.border,
      },
    },
  },
} as const;

export const darkTheme = {
  colors: {
    typography: "#ffffff",
    background: "#000000",
  },
  margins,
  radius,
  spacing,

  button: {
    text: {
      enabled: {
        background: "transparent",
        border: "transparent",
        color: appColors.dark.ui.button.text.enabled.text,
      },
      disabled: {
        background: "transparent",
        border: "transparent",
        color: appColors.dark.ui.button.text.disabled.text,
      },
      pressed: {
        background: "transparent",
        border: "transparent",
        color: appColors.dark.ui.button.text.pressed.text,
      },
    },
    outlined: {
      enabled: {
        background: appColors.dark.ui.button.outlined.enabled.background,
        color: appColors.dark.ui.button.outlined.enabled.text,
        border: appColors.dark.ui.button.outlined.enabled.border,
      },
      disabled: {
        background: appColors.dark.ui.button.outlined.disabled.background,
        color: appColors.dark.ui.button.outlined.disabled.text,
        border: appColors.dark.ui.button.outlined.disabled.border,
      },
      pressed: {
        background: appColors.dark.ui.button.outlined.pressed.background,
        color: appColors.dark.ui.button.outlined.pressed.text,
        border: appColors.dark.ui.button.outlined.pressed.border,
      },
    },
    contained: {
      enabled: {
        background: appColors.dark.ui.button.contained.enabled.background,
        color: appColors.dark.ui.button.contained.enabled.text,
        border: appColors.dark.ui.button.contained.enabled.border,
      },
      disabled: {
        background: appColors.dark.ui.button.contained.disabled.background,
        color: appColors.dark.ui.button.contained.disabled.text,
        border: appColors.dark.ui.button.contained.disabled.border,
      },
      pressed: {
        background: appColors.dark.ui.button.contained.pressed.background,
        color: appColors.dark.ui.button.contained.pressed.text,
        border: appColors.dark.ui.button.contained.pressed.border,
      },
    },
  },
} as const;

// define other themes
