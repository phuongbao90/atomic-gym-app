import { queryClient } from "app";
import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import { AppScrollView } from "../../src/components/ui/app-scrollview";
import { AppStorage } from "../../src/lib/storage/app-storage";
import { AppHeader } from "../components/ui/app-header";
import { AppScreen } from "../components/ui/app-screen";
import { Icon } from "../components/ui/icon";
import i18n from "../configs/i18n";
import { useAppDispatch, useAppSelector } from "../stores/redux-store";
import { logout } from "../stores/slices/auth-slice";

export function HomeScreen() {
  const theme = useAppSelector((state) => state.app.theme);
  const language = useAppSelector((state) => state.app.language);

  return (
    <AppScreen name="home-screen">
      <AppHeader title="Home" theme={theme} language={language} />
      <AppScrollView contentContainerStyle={{ flex: 1 }}>
        <Text>{i18n.resolvedLanguage}</Text>
        <Icon name="sort-numeric-up-alt" size={22} color="red" />

        <DEV />
      </AppScrollView>
    </AppScreen>
  );
}

const DEV = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  return (
    <View className="flex-row items-center justify-center gap-4 mt-auto mb-2">
      <Button
        title="dev ui"
        onPress={() => {
          router.push("/dev/ui");
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
          dispatch(logout());
          queryClient.clear();
        }}
      />
    </View>
  );
};
