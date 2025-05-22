import { setRequestCookie } from "app";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, StyleSheet, TextInput, View, Text } from "react-native";
import { AppScreen } from "../../src/components/ui/app-screen";
import { AppScrollView } from "../../src/components/ui/app-scrollview";
import { AppText } from "../../src/components/ui/app-text";
import { appRoutes } from "../../src/configs/routes";
import { AppStorage } from "../../src/lib/storage/app-storage";
import { AppHeader } from "../components/ui/app-header";
import { useAppDispatch } from "../stores/redux-store";
import { switchTheme } from "../stores/slices/app-slice";
import { getCookie, signIn } from "../lib/auth-client";

export function LoginScreen() {
  const { t } = useTranslation("login-screen");
  const [email, setEmail] = useState("bao1@gmail.com");
  const [password, setPassword] = useState("123456#@Nn");
  const router = useRouter();

  const dispatch = useAppDispatch();

  async function handleLogin() {
    const { error } = await signIn.email({
      email,
      password,
    });

    if (error) {
      return;
    }

    const cookie = getCookie();

    setRequestCookie(cookie);
  }

  return (
    <AppScreen name="login-screen">
      <AppHeader title={t("login-title")} />
      <AppScrollView>
        <View className="gap-4 m-4 flex-1">
          <Text className="text-2xl font-bold">{t("login-title")}</Text>
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
              dispatch(switchTheme());
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
          <Button
            title="use as guest"
            onPress={() => {
              router.push("/(tabs)");
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
