import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import { Pressable, View } from "react-native";

type IconProps = {
  size: number;
  color: string;
};

const iconMap = {
  chevronLeft: ({ size, color }: IconProps) => (
    <Feather name="chevron-left" size={size} color={color} />
  ),
  chevronRight: ({ size, color }: IconProps) => (
    <Feather name="chevron-right" size={size} color={color} />
  ),
  chevronDown: ({ size, color }: IconProps) => (
    <Feather name="chevron-down" size={size} color={color} />
  ),
  chevronUp: ({ size, color }: IconProps) => (
    <Feather name="chevron-up" size={size} color={color} />
  ),
  menu: ({ size, color }: IconProps) => (
    <Feather name="menu" size={size} color={color} />
  ),
  close: ({ size, color }: IconProps) => (
    <Feather name="x" size={size} color={color} />
  ),
};

export const IconButton = ({
  icon,
  size,
  color,
  onPress,
  haptic = false,
  variant = "contained",
  radius = "md",
  spacing = "sm",
  tintColor,
}: {
  icon: keyof typeof iconMap;
  size: number;
  color: string;
  onPress: () => void;
  haptic?: boolean;
  variant?: "contained" | "outlined" | "text";
  radius?: "sm" | "md" | "lg" | "xl";
  spacing?: "sm" | "md" | "lg" | "xl";
  tintColor?: string;
}) => {
  // const styles = useStyles({
  //   button: {
  //     justifyContent: "center",
  //     alignItems: "center",
  //     aspectRatio: 1.15,
  //   },
  // });

  const handlePress = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      {iconMap[icon]({
        size,
      })}
    </Pressable>
  );
};
