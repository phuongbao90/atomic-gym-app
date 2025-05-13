import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Platform } from "react-native";
import { colors } from "../../src/styles/themes";
import { Tabs } from "expo-router";
import { useAppSelector } from "../../src/stores/redux-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Icon = ({
  name,
  focused,
}: {
  name: keyof typeof Feather.glyphMap;
  focused: boolean;
}) => {
  const colorMode = useAppSelector((state) => state.app.theme);

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

const TAB_HEIGHT = 56;

export default function TabLayout() {
  // const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const insets = useSafeAreaInsets();
  const colorMode = useAppSelector((state) => state.app.theme);

  // if (!isLoggedIn) {
  //   return <Redirect href={appRoutes.login} />;
  // }

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
            height: insets.bottom ? TAB_HEIGHT : TAB_HEIGHT + insets.bottom,
            paddingBottom: 0,
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
