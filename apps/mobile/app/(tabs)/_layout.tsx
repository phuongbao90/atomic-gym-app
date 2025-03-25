import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Redirect, Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { Platform } from "react-native";
import { appRoutes } from "../../src/configs/routes";
import { tabBarStyle } from "../../src/styles/themes";
import { use$ } from "@legendapp/state/react";
import { authStore$ } from "../../src/stores/auth-store";

const Icon = ({
  name,
  focused,
}: {
  name: keyof typeof Feather.glyphMap;
  focused: boolean;
}) => {
  const theme = useColorScheme();

  return (
    <Feather
      name={name}
      size={24}
      color={
        focused
          ? tabBarStyle[theme.colorScheme!].iconColor.focused
          : tabBarStyle[theme.colorScheme!].iconColor.unfocused
      }
    />
  );
};

export default function TabLayout() {
  const isLoggedIn = use$(authStore$.isLoggedIn);
  const theme = useColorScheme();

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
          default: {
            backgroundColor: tabBarStyle[theme.colorScheme!].backgroundColor,
            borderTopColor: tabBarStyle[theme.colorScheme!].borderTopColor,
          },
        }),
        tabBarActiveTintColor:
          tabBarStyle[theme.colorScheme!].labelColor.focused,
        tabBarInactiveTintColor:
          tabBarStyle[theme.colorScheme!].labelColor.unfocused,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <Icon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: "Plans",
          // tabBarLabel: ({ focused }) => <Text>{focused ? "Plans" : ""}</Text>,
          tabBarIcon: ({ focused }) => (
            <Icon name="calendar" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: "Coach",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="whistle-outline"
              size={24}
              color={
                focused
                  ? tabBarStyle[theme.colorScheme!].iconColor.focused
                  : tabBarStyle[theme.colorScheme!].iconColor.unfocused
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ focused }) => <Icon name="clock" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistics",
          tabBarIcon: ({ focused }) => (
            <Icon name="bar-chart" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
