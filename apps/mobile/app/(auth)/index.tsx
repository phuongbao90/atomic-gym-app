import { useLoginMutation } from "app";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { AppScrollView } from "../../components/ui/app-scrollview";
import { appRoutes } from "../../configs/routes";
import { setToken } from "../../lib/auth/session-store";
import { AppStorage } from "../../lib/storage/app-storage";
import { authStore$ } from "../../stores/auth-store";
import { appStore$ } from "../../stores/app-store";
import { AppText } from "../../components/ui/app-text";

export default function Login() {
  const [email, setEmail] = useState("bao5@gmail.com");
  const [password, setPassword] = useState("123456#@Nn");
  const loginMutation = useLoginMutation();
  const router = useRouter();

  async function handleLogin() {
    try {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: (result) => {
            console.info("Login success: ");
            SecureStore.setItemAsync("accessToken", result!.accessToken);
            setToken(result!.accessToken);
            authStore$.setIsLoggedIn(true);
          },
        },
      );
    } catch (error) {
      console.log("error ====> ", (error as Error)?.message);
    }
  }

  return (
    <AppScreen>
      <AppScrollView contentContainerStyle={{ flex: 1 }}>
        <View className="gap-4 m-4 flex-1">
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
          />

          <AppText className="text-red-500">
            Aute id sit esse exercitation reprehenderit est velit pariatur id ut
            et. Laboris incididunt aute minim pariatur aliqua eiusmod. Pariatur
            duis exercitation anim amet Lorem reprehenderit excepteur duis sunt
            adipisicing sit esse id enim. Enim tempor tempor adipisicing dolore
            consectetur labore ea minim Lorem magna incididunt excepteur eiusmod
            nisi ut. Laboris minim nostrud irure veniam officia ea minim ipsum
            eu voluptate fugiat nulla pariatur.
          </AppText>
        </View>
        <View className="mt-auto gap-4">
          <Button
            title="Switch theme"
            onPress={() => {
              appStore$.switchTheme();
            }}
          />
          <Button
            title="Login"
            onPress={() => {
              handleLogin();
            }}
          />
          <Button
            title="signup"
            color={"black"}
            onPress={() => {
              router.push(appRoutes.register);
            }}
          />
          <Button
            title="Clear onboarding"
            onPress={() => {
              AppStorage.setIsOnboarded(false);
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
    borderColor: "gray",
  },
});
