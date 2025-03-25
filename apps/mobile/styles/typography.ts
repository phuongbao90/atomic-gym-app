import { cva, type VariantProps } from "class-variance-authority";
import { Appearance, Text, TextProps } from "react-native";

console.log("Appearance ", Appearance.getColorScheme());

export const typography = cva([], {
  variants: {
    intent: {
      primary: "",
      secondary: "",
      ordinary: "",
      label: "",
    },
    theme: {
      light: "",
      dark: "",
    },
    size: {
      xsmall: "text-xs",
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
      xlarge: "text-xl",
      xxlarge: "text-2xl",
    },
    disabled: {
      false: null,
      true: ["text-gray-500"],
    },
  },
  compoundVariants: [
    {
      intent: "ordinary",
      theme: "light",
      className: ["text-black"], // className will be added if intent and size match
    },
    {
      intent: "ordinary",
      theme: "dark",
      className: ["text-white"], // className will be added if intent and size match
    },
    {
      intent: "label",
      theme: "light",
      className: ["text-gray-700"],
    },
    {
      intent: "label",
      theme: "dark",
      className: ["text-gray-500"],
    },
  ],
  defaultVariants: {
    intent: "ordinary",
    theme: "light",
  },
});
