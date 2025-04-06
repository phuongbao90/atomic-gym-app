import { cva } from "class-variance-authority";

export const buttonCva = cva("group flex-1 items-center justify-center", {
  variants: {
    size: {
      sx: "py-1 px-2 h-8",
      sm: "py-1 px-2 h-9",
      md: "py-1 px-3 h-10",
      lg: "py-1 px-4 h-12",
      xl: "py-1 px-5 h-14",
    },
    radius: {
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
    },
    color: {
      default: "bg-dark border-dark",
      primary: "bg-primary border-primary",
      secondary: "bg-secondary border-secondary",
      danger: "bg-danger border-danger",
    },

    disabled: {
      true: "opacity-60",
      false: "",
    },
    fullWidth: {
      true: "w-full",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    radius: "md",
    color: "default",
    disabled: false,
  },
});

export const buttonTextCva = cva("", {
  variants: {
    size: {
      sx: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
    color: {
      default: "text-white",
      primary: "text-black",
      secondary: "text-black",
      danger: "text-white",
    },
    disabled: {
      true: "opacity-50",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
});
