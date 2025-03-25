const { platformSelect } = require("nativewind/theme");
import sharedConfig from "tailwind-config";

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./styles/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset"), sharedConfig],
  theme: {
    extend: {},
  },
  plugins: [],
};
