import { useTranslation } from "react-i18next"
import { AppScreen } from "../components/ui/app-screen"
import { queryClient } from "app"
import { Button, View } from "react-native"
import { AppText } from "../../src/components/ui/app-text"
import { AppScrollView } from "../../src/components/ui/app-scrollview"
import { AppStorage } from "../../src/lib/storage/app-storage"
import { authStore$ } from "../../src/stores/auth-store"
import { appStore$ } from "../../src/stores/app-store"
import { useRouter } from "expo-router"
import { AppHeader } from "../components/ui/app-header"
import { Icon } from "../components/ui/icon"

export function HomeScreen() {
  return (
    <AppScreen name="home-screen">
      <AppHeader title="Home" />
      <AppScrollView contentContainerStyle={{ flex: 1 }}>
        <Icon name="sort-numeric-up-alt" size={22} color="red" />

        <DEV />
      </AppScrollView>
    </AppScreen>
  )
}

const DEV = () => {
  const router = useRouter()
  return (
    <View className="flex-row items-center justify-center gap-4 mt-auto mb-2">
      <Button
        title="dev ui"
        onPress={() => {
          router.push("/dev/ui")
        }}
      />

      <Button
        title="clear onboarded"
        onPress={() => {
          AppStorage.setIsOnboarded(false)
        }}
      />

      <Button
        title="logout"
        onPress={() => {
          authStore$.setIsLoggedIn(false)
          queryClient.clear()
        }}
      />
    </View>
  )
}
