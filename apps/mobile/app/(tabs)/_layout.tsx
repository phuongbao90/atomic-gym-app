import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { use$ } from "@legendapp/state/react";
import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";
import { appRoutes } from "../../src/configs/routes";
import { appStore$ } from "../../src/stores/app-store";
import { authStore$ } from "../../src/stores/auth-store";
import { colors } from "../../src/styles/themes";

const Icon = ({
  name,
  focused,
}: {
  name: keyof typeof Feather.glyphMap;
  focused: boolean;
}) => {
  const colorMode = use$(appStore$.theme);

  return (
    <Feather
      name={name}
      size={24}
      color={
        focused ? colors.text[colorMode].main : colors.text[colorMode].inactive
      }
    />
  );
};

export default function TabLayout() {
  const isLoggedIn = use$(authStore$.isLoggedIn);
  const colorMode = use$(appStore$.theme);

  if (!isLoggedIn) {
    return <Redirect href={appRoutes.login} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {
            backgroundColor: colors.pageBackground[colorMode],
          },
        }),
        tabBarActiveTintColor: colors.text[colorMode].main,
        tabBarInactiveTintColor: colors.text[colorMode].inactive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon name="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: "Plans",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon name="calendar" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: "Coach",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <MaterialCommunityIcons
              name="whistle-outline"
              size={24}
              color={
                focused
                  ? colors.text[colorMode].main
                  : colors.text[colorMode].inactive
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon name="clock" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistics",
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon name="bar-chart" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
