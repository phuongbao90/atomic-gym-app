import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { cn } from "../../utils/cn";
import { AppText } from "./app-text";
import { Divider } from "./divider";
import { ChevronLeftIcon } from "./expo-icon";
import { usePreventRepeatPress } from "../../hooks/use-prevent-repeat-press";

export const AppHeader = ({
  title,
  withBackButton = false,
  withBottomBorder = true,
  Right,
  className,
  onBackPress,
}: {
  title?: string | React.ReactNode;
  withBackButton?: boolean;
  withBottomBorder?: boolean;
  Right?: React.ReactNode;
  className?: string;
  onBackPress?: () => void;
}) => {
  const router = useRouter();
  const debouncedPress = usePreventRepeatPress();

  return (
    <>
      <View
        testID="app-header"
        className={cn("flex-row items-center py-2 z-50 min-h-16", className)}
      >
        {withBackButton && (
          <Pressable
            onPress={() =>
              debouncedPress(() => {
                if (onBackPress) {
                  onBackPress();
                } else {
                  router.back();
                }
              })
            }
            testID="back-button"
            hitSlop={20}
          >
            <ChevronLeftIcon size={26} />
          </Pressable>
        )}
        {!!title &&
          (typeof title === "string" ? (
            <AppText
              numberOfLines={1}
              className="flex-1 ml-8 text-xl font-bold"
            >
              {title}
            </AppText>
          ) : (
            title
          ))}

        {!!Right && <View style={styles.right}>{Right}</View>}

        {/* <View style={styles.right}>
          <View className="flex-row gap-8">
            <TouchableOpacity
              onPress={() => {
                debouncedPress(() => {
                  dispatch(switchTheme());
                });
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
                debouncedPress(() => {
                  dispatch(switchLanguage());
                });
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
                debouncedPress(() => {
                  router.push("/settings");
                });
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
        </View> */}
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
