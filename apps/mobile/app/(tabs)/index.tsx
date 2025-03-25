import { queryClient } from "app";
import { colorScheme, useColorScheme } from "nativewind";
import { Button, View } from "react-native";
import { AppScreen } from "../../src/components/ui/app-screen";
import { AppText } from "../../src/components/ui/app-text";
import { AppScrollView } from "../../src/components/ui/app-scrollview";
import { AppStorage } from "../../src/lib/storage/app-storage";
import { authStore$ } from "../../src/stores/auth-store";
import { appStore$ } from "../../src/stores/app-store";

export default function HomeScreen() {
  const theme = useColorScheme();
  console.log("theme", theme.colorScheme);
  return (
    <AppScreen>
      <AppScrollView>
        <View className="flex-1">
          <View className="text-primary h-10">
            <AppText className="text-red-700 text-xl">hhhhhh 111</AppText>
          </View>
          <View className="items-center justify-center gap-4 mt-auto">
            <Button
              title="switch mode"
              onPress={() => {
                appStore$.switchTheme();
              }}
            />
            <Button
              title="clear onboarded"
              onPress={() => {
                AppStorage.setIsOnboarded(false);
              }}
            />
            <Button
              title="logout"
              onPress={() => {
                authStore$.setIsLoggedIn(false);
                queryClient.clear();
              }}
            />
          </View>
        </View>
      </AppScrollView>
    </AppScreen>
  );
}
