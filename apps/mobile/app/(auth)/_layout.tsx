import { Redirect, Stack } from "expo-router";
import { appRoutes } from "app-config";
import { useSession } from "../../src/lib/auth-client";

export default function AuthLayout() {
  const { data } = useSession();
  if (data?.session) {
    return <Redirect href={appRoutes.home} />;
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
