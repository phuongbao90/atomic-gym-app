import { useColorScheme } from "nativewind";
import { View } from "react-native";

export const AppScreen = ({ children }: { children: React.ReactNode }) => {
  const theme = useColorScheme();

  return (
    <View
      className={`flex-1 ${theme.colorScheme === "dark" ? "bg-black" : "bg-white"}`}
    >
      {children}
    </View>
  );
};
