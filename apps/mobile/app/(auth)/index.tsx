import { useLoginMutation } from "@repo/app";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { AppScrollView } from "../../components/ui/AppScrollView";
import { appRoutes } from "../../configs/routes";
import { setToken } from "../../lib/auth/session-store";
import { AppStorage } from "../../lib/storage/app-storage";
import { useAuthStore } from "../../stores/use-auth-store";

export default function Login() {
  const [email, setEmail] = useState("bao5@gmail.com");
  const [password, setPassword] = useState("123456#@Nn");
  const { setIsLoggedIn } = useAuthStore();
  const loginMutation = useLoginMutation();
  const router = useRouter();

  async function handleLogin() {
    try {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: (result) => {
            console.info("Login success: ");
            setToken(result!.accessToken);
            setIsLoggedIn(true);
          },
        }
      );
    } catch (error) {
      console.log("error ====> ", (error as Error)?.message);
    }
  }

  return (
    <AppScreen>
      <AppScrollView>
        <View style={{ gap: 10, marginVertical: 20, marginHorizontal: 20 }}>
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
        </View>
        <View style={{ marginTop: "auto", gap: 8 }}>
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
