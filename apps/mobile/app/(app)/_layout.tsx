import { Redirect, Stack } from "expo-router";
import { appRoutes } from "../../src/configs/routes";
import { use$ } from "@legendapp/state/react";
import { authStore$ } from "../../src/stores/auth-store";
export default function AppLayout() {
  const isLoggedIn = use$(authStore$.isLoggedIn);

  if (!isLoggedIn) {
    return <Redirect href={appRoutes.login} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="exercises"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
