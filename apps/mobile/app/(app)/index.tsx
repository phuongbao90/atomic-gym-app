import { useGetMe, useSession } from "@repo/app";
import { Button, StyleSheet, View } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { AppScrollView } from "../../components/ui/AppScrollView";
import { queryClient } from "../../lib/react-query";
import { AppStorage } from "../../lib/storage/app-storage";
import { useAuthStore } from "../../stores/use-auth-store";

export default function HomeScreen() {
  const { setIsLoggedIn } = useAuthStore();

  const { data, status, update, expires } = useSession();
  const { data: me } = useGetMe();
  console.log("me", me, status);
  return (
    <AppScreen>
      <AppScrollView>
        <View style={{ gap: 8, marginTop: "auto" }}>
          <Button title="get accessToken" onPress={() => {}} />
          <Button
            title="clear onboarded"
            onPress={() => {
              AppStorage.setIsOnboarded(false);
            }}
          />
          <Button
            title="logout"
            onPress={() => {
              setIsLoggedIn(false);
              queryClient.clear();
            }}
          />
        </View>
      </AppScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "red",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
