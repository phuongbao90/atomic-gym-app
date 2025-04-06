import { useRouter } from "expo-router";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { Divider } from "./divider";
import { USFlag } from "../../constants/app-assets";
import { appStore$ } from "../../stores/app-store";
import { VNFlag } from "../../constants/app-assets";
import { Image } from "expo-image";
import { AppText } from "./app-text";
import { ExpoIcon } from "./expo-icon";
import { cn } from "../../utils/cn";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

export const AppHeader = ({
  title,
  center = false,
  withBackButton = false,
  withBottomBorder = true,
  Right,
  className,
  theme,
  language,
}: {
  title?: string;
  center?: boolean;
  withBackButton?: boolean;
  withBottomBorder?: boolean;
  Right?: React.ReactNode;
  className?: string;
  theme: "light" | "dark";
  language: "vi" | "en";
}) => {
  const router = useRouter();

  return (
    <>
      <View
        testID="app-header"
        className={cn("flex-row items-center h-14 z-50", className)}
      >
        {withBackButton && (
          <Pressable onPress={() => router.back()} testID="back-button">
            <ExpoIcon
              library="feather"
              name="chevron-left"
              size={26}
              className="pl-4"
            />
          </Pressable>
        )}
        {!!title && (
          <AppText numberOfLines={1} className="flex-1 ml-8 text-xl font-bold">
            {title}
          </AppText>
        )}

        {!!Right && <View style={styles.right}>{Right}</View>}

        <View style={styles.right}>
          <View className="flex-row gap-8">
            <TouchableOpacity
              onPress={() => {
                appStore$.switchTheme();
              }}
              testID="theme-button"
            >
              {theme === "light" && (
                <View testID="light-icon">
                  <ExpoIcon library="entypo" name="light-up" size={24} />
                </View>
              )}
              {theme === "dark" && (
                <View testID="dark-icon">
                  <ExpoIcon
                    library="materialIcons"
                    name="dark-mode"
                    size={24}
                  />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                appStore$.switchLanguage();
              }}
              testID="language-button"
            >
              {language === "vi" && (
                <Image source={VNFlag} style={styles.flag} testID="vn-flag" />
              )}
              {language === "en" && (
                <Image source={USFlag} style={styles.flag} testID="us-flag" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("/settings");
              }}
              testID="settings-button"
            >
              <SimpleLineIcons
                name="settings"
                size={22}
                color={theme === "light" ? "black" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {withBottomBorder && <Divider />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    height: 50,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  center: {
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    left: 10,
    zIndex: 1000,
  },
  right: {
    position: "absolute",
    right: 16,
    zIndex: 1000,
  },
  flag: {
    height: 22,
    aspectRatio: 513 / 342,
  },
});
