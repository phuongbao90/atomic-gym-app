import sharedConfig from "tailwind-config";
// const { colors } = require("./src/styles/themes")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
    "./src/styles/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset"), sharedConfig],
  theme: {
    extend: {
      colors: {
        primary: "#bcf352",
        primaryDarken: "#8acf13",
        secondary: "#8a69fb",
        danger: "#ff0000",
        light: "#ffffff",
        dark: "#000000",
        inactive: "#808080",
        main: "#000000",
        page: "#ffffff",
        pageDark: "#2a2c38",
      },
    },
  },
  plugins: [],
};
