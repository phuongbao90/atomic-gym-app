import { PlatformPressable } from "@react-navigation/elements";
import { ColorNameOrHex } from "app-config";
import * as Haptics from "expo-haptics";
import { ReactNode } from "react";
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  useColorScheme,
} from "react-native";

export const AppButton = ({
  title,
  onPress,
  children,
  haptic = false,
  variant = "contained",
  radius = "lg",
  spacing = "md",
  color,
}: {
  title: string;
  children?: ReactNode;
  haptic?: boolean;
  variant?: "contained" | "outlined" | "text";
  radius?: "sm" | "md" | "lg" | "xl";
  spacing?: "sm" | "md" | "lg" | "xl";
  color?: ColorNameOrHex;
} & PressableProps) => {
  const isLightTheme = useColorScheme() === "dark";

  function handlePress(ev: GestureResponderEvent) {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(ev);
  }

  // const styles = useStyles();

  if (children) {
    return (
      <PlatformPressable onPress={handlePress} style={styles.button}>
        {children}
      </PlatformPressable>
    );
  }

  return (
    <PlatformPressable
      onPress={handlePress}
      style={[
        styles.button,
        isLightTheme ? styles.lightContained : styles.darkContained,
      ]}
    >
      <Text
        style={[
          isLightTheme ? styles.lightContainedText : styles.darkContainedText,
        ]}
      >
        {title}
      </Text>
    </PlatformPressable>
  );
};

// const styles = createStyleSheet((theme) => ({
//   button: {
//     backgroundColor: theme.button.contained.enabled.background,
//     padding: 10,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     alignSelf: "center",
//     marginTop: "auto",
//   },
// }));

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    // width: "70%",
    alignSelf: "center",
    marginTop: "auto",
  },
  darkContained: {
    backgroundColor: "black",
  },
  lightContained: {
    backgroundColor: "white",
  },
  darkContainedText: {
    color: "white",
  },
  lightContainedText: {
    color: "black",
  },
});
