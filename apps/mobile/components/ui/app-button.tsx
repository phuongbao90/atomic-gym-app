import { PlatformPressable } from "@react-navigation/elements";
import { ColorNameOrHex } from "@repo/app-config/app-colors";
import * as Haptics from "expo-haptics";
import { ReactNode } from "react";
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

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
  function handlePress(ev: GestureResponderEvent) {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(ev);
  }

  const styles = useStyles();

  // if (children) {
  //   return (
  //     <PlatformPressable onPress={handlePress} style={styles.button}>
  //       {children}
  //     </PlatformPressable>
  //   );
  // }

  return (
    <PlatformPressable
      onPress={handlePress}
      style={{
        backgroundColor: styles.theme.button[variant].enabled.background,
        borderRadius: styles.theme.radius[radius],
        padding: styles.theme.spacing[spacing],
      }}
    >
      <Text
        style={{
          color: color || styles.theme.button[variant].enabled.color,
        }}
      >
        {title}
      </Text>
    </PlatformPressable>
  );
};

const styles = createStyleSheet((theme) => ({
  button: {
    backgroundColor: theme.button.contained.enabled.background,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: "auto",
  },
}));

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: appColors.light.ui.button.contained.enabled.background,
//     padding: 10,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     // width: "70%",
//     alignSelf: "center",
//     marginTop: "auto",
//   },
// });
