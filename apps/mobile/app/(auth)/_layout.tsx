import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "../../stores/use-auth-store";

export default function AuthLayout() {
  const { isLoggedIn } = useAuthStore();
  if (isLoggedIn) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="otp-verify"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
