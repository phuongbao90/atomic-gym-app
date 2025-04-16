import { Redirect, Stack } from "expo-router";
import { appRoutes } from "../../src/configs/routes";
import { useAppSelector } from "../../src/stores/redux-store";

export default function AuthLayout() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  if (isLoggedIn) {
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
