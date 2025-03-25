import { use$ } from "@legendapp/state/react";
import { View } from "react-native";
import { appStore$ } from "../../stores/app-store";

export const AppScreen = ({ children }: { children: React.ReactNode }) => {
  const theme = use$(appStore$.theme);

  return (
    <View className={`flex-1 ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}>
      {children}
    </View>
  );
};
