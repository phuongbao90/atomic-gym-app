import { cx } from "class-variance-authority";
import { Text, TextProps } from "react-native";
import { typographyCva } from "../../styles/typography";
import { useAppSelector } from "../../stores/redux-store";

export const AppText = ({
  children,
  className,
  intent = "ordinary",
  ...props
}: TextProps & {
  intent?: "ordinary" | "label";
}) => {
  const theme = useAppSelector((state) => state.app.theme);
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
