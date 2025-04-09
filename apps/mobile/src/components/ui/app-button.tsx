import React from "react";
import { Pressable, Text, View } from "react-native";
import { buttonCva, buttonTextCva } from "../../styles/button-cva";
import { cn } from "../../utils/cn";

// const buttonTextVariants = cva("text-base font-medium text-foreground", {
//   variants: {
//     variant: {
//       default: "text-white",
//       destructive: "text-white",
//       outline: "group-active:text-accent-foreground",
//       secondary:
//         "text-secondary-foreground group-active:text-secondary-foreground",
//       ghost: "group-active:text-accent-foreground",
//       link: "text-primary group-active:underline",
//     },
//     size: {
//       default: "",
//       sm: "",
//       lg: "text-lg",
//       icon: "",
//     },
//   },
//   defaultVariants: {
//     variant: "default",
//     size: "default",
//   },
// })

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> & {
  title: string;
  size?: "sx" | "sm" | "md" | "lg" | "xl";
  color?: "default" | "primary" | "secondary" | "danger";
  disabled?: boolean;
  fullWidth?: boolean;
  radius?: "sm" | "md" | "lg" | "xl";
  containerClassName?: string;
  textClassName?: string;
  className?: string;
  testID?: string;
};

export const AppButton = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(
  (
    {
      className,
      size,
      color,
      disabled,
      fullWidth,
      radius,
      containerClassName,
      textClassName,
      testID,
      ...props
    },
    ref
  ) => {
    return (
      <View
        className={cn("flex-1 flex-col items-start", containerClassName)}
        testID={testID}
      >
        <Pressable
          className={cn(
            buttonCva({ size, color, disabled, fullWidth, radius, className })
          )}
          ref={ref}
          {...props}
        >
          <View>
            <Text
              className={cn(
                "font-semibold",
                buttonTextCva({
                  size,
                  color,
                  disabled,
                  className: textClassName,
                })
              )}
            >
              {props.title}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  }
);

export const OutlineButton = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>((props, ref) => {
  return <AppButton {...props} ref={ref} />;
});
