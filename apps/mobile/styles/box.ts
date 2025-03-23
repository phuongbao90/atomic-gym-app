import { cva } from "class-variance-authority";

export const box = cva([], {
  variants: {
    intent: {
      divider: "",
    },
    theme: {
      light: "",
      dark: "",
    },
  },
  compoundVariants: [
    {
      intent: "divider",
      theme: "light",
      className: ["border-b-2 border-gray-200"],
    },
    {
      intent: "divider",
      theme: "dark",
      className: ["border-b-2 border-gray-700"],
    },
  ],
});
