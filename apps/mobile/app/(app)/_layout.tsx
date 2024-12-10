import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";
import { appRoutes } from "../../configs/routes";
import { useAuthStore } from "../../stores/use-auth-store";

export default function TabLayout() {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <Redirect href={appRoutes.login} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          // tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          // tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
