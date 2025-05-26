import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Platform } from "react-native";
import { colors } from "../../src/styles/themes";
import { Tabs } from "expo-router";
import { useAppSelector } from "../../src/stores/redux-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

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
  const insets = useSafeAreaInsets();
  const colorMode = useAppSelector((state) => state.app.theme);
  const { t } = useTranslation("common");
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
          title: t("tab-home"),
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon name="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: t("tab-plans"),
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon name="calendar" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          title: t("tab-coach"),
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
          title: t("tab-history"),
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon name="clock" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: t("tab-statistics"),
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Icon name="bar-chart" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
