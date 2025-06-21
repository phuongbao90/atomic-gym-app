import { Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { AppTouchable } from "./app-touchable";
import { AppText } from "./app-text";
import { twColors } from "../../styles/themes";
import { capitalize } from "lodash";
import { cn } from "../../utils/cn";

export const ButtonGroup = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isAndroid = Platform.OS === "android";

  if (isAndroid) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: twColors.neutral[800],
          },
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={10}
      tint="dark"
      style={[
        styles.container,
        {
          backgroundColor: twColors.neutral[800],
        },
      ]}
    >
      {children}
    </BlurView>
  );
};

const Button = ({
  title,
  onPress,
  textClassName,
  className,
}: {
  title: string;
  onPress: () => void;
  textClassName?: string;
  className?: string;
}) => {
  return (
    <AppTouchable
      onPress={onPress}
      className={cn("py-4", className)}
      hitSlop={10}
    >
      <AppText
        className={cn(
          "text-center text-lg text-white dark:text-white",
          textClassName
        )}
      >
        {capitalize(title)}
      </AppText>
    </AppTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
  },
});

ButtonGroup.Button = Button;
