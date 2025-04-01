export const PRIMARY_COLOR = "#bcf352"
export const SECONDARY_COLOR = "#8a69fb"
export const DESTRUCTIVE_COLOR = "#ff0000"

export const theme = {
  icon: {
    light: {
      color: "black",
    },
    dark: {
      color: "white",
    },
  },
  pageBackground: {
    light: "white",
    dark: "black",
  },
  text: {
    light: {
      inactive: "gray",
      main: "black",
    },
    dark: {
      inactive: "gray",
      main: "white",
    },
  },
} as const

export const colors = {
  pageBackground: {
    dark: "#25293c",
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
} as const
