import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const AppScreen = ({ children }: { children: React.ReactNode }) => {
  return <View style={{ flex: 1 }}>{children}</View>;
};
