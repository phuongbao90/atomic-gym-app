import { cx } from "class-variance-authority";
import { useColorScheme } from "nativewind";
import { Text, TextProps } from "react-native";
import { typography } from "../../styles/typography";

export const AppText = ({
  children,
  className,
  intent = "ordinary",
  ...props
}: TextProps & {
  intent?: "ordinary" | "label";
}) => {
  const theme = useColorScheme();
  return (
    <Text
      {...props}
      className={cx(
        typography({
          intent: intent,
          theme: theme.colorScheme,
        }),
        className
      )}
    >
      {children}
    </Text>
  );
};
