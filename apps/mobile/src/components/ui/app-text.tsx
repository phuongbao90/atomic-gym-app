import { use$ } from "@legendapp/state/react";
import { cx } from "class-variance-authority";
import { Text, TextProps } from "react-native";
import { appStore$ } from "../../stores/app-store";
import { typographyCva } from "../../styles/typography";

export const AppText = ({
  children,
  className,
  intent = "ordinary",
  ...props
}: TextProps & {
  intent?: "ordinary" | "label";
}) => {
  const theme = use$(appStore$.theme);
  return (
    <Text
      {...props}
      className={cx(
        typographyCva({
          intent: intent,
          theme: theme,
        }),
        className
      )}
    >
      {children}
    </Text>
  );
};
