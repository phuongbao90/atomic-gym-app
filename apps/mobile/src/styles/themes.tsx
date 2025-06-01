export const PRIMARY_COLOR = "#bcf352";
export const PRIMARY_COLOR_DARK = "#7FCF0A";
export const SECONDARY_COLOR = "#8a69fb";
export const DESTRUCTIVE_COLOR = "#ff0000";
import _twColors from "tailwindcss/colors";

export const colors = {
  pageBackground: {
    dark: "#2a2c38",
    light: "#ffffff",
  },
  text: {
    dark: {
      inactive: "#808080",
      main: "#ffffff",
    },
    light: {
      inactive: "#808080",
      main: "#000000",
    },
  },
} as const;

export const twColors = _twColors;
