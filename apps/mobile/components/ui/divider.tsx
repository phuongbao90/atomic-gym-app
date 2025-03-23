import { cx } from "class-variance-authority";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { box } from "../../styles/box";

export const Divider = ({ className }: { className?: string }) => {
  const theme = useColorScheme();

  return (
    <View
      className={cx(
        "w-full",
        box({ intent: "divider", theme: theme.colorScheme! }),
        className
      )}
    />
  );
};
