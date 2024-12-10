import { TouchableOpacity } from "react-native";

export const AppTouchable = ({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={20}>
      {children}
    </TouchableOpacity>
  );
};
