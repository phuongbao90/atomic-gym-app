import type { Config } from "tailwindcss"

// @ts-expect-error
const config: Config = {
  theme: {
    extend: {
      colors: {
        // primary: "#bcf352",
        // secondary: "#8a69fb",
        // destructive: "#ff0000",
        // light: "#ffffff",
        // dark: "#000000",
        // inactive: "#808080",
        // main: "#000000",
        // page: "#ffffff",
        // pageDark: "#2a2c38",
      },
    },
  },

  plugins: [],
}
export default config
