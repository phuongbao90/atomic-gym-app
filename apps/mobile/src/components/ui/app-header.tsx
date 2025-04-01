import { useRouter } from "expo-router"
import { useColorScheme } from "nativewind"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { Divider } from "./divider"
import { USFlag } from "../../constants/app-assets"
import { appStore$ } from "../../stores/app-store"
import { VNFlag } from "../../constants/app-assets"
import { Image } from "expo-image"
import { use$ } from "@legendapp/state/react"
import { AppText } from "./app-text"
import { ExpoIcon } from "./expo-icon"
import { cn } from "../../utils/cn"
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons"

export const AppHeader = ({
  title,
  center = false,
  withBackButton = false,
  withBottomBorder = true,
  Right,
  className,
}: {
  title?: string
  center?: boolean
  withBackButton?: boolean
  withBottomBorder?: boolean
  Right?: React.ReactNode
  className?: string
}) => {
  const router = useRouter()
  const mode = useColorScheme()
  const theme = use$(appStore$.theme)
  const language = use$(appStore$.language)

  return (
    <>
      <View className={cn("flex-row items-center h-14 z-50", className)}>
        {withBackButton && (
          <ExpoIcon
            library="feather"
            name="chevron-left"
            size={26}
            onPress={() => router.back()}
            className="pl-4"
          />
        )}
        {!!title && (
          <AppText className="flex-1 ml-8 text-xl font-bold">{title}</AppText>
        )}

        {!!Right && <View style={styles.right}>{Right}</View>}

        <View style={styles.right}>
          <View className="flex-row gap-8">
            <TouchableOpacity
              onPress={() => {
                appStore$.switchTheme()
              }}
            >
              {theme === "light" ? (
                <ExpoIcon library="entypo" name="light-up" size={24} />
              ) : (
                <ExpoIcon library="materialIcons" name="dark-mode" size={24} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                appStore$.switchLanguage()
              }}
            >
              {language === "vi" ? (
                <Image source={VNFlag} style={styles.flag} />
              ) : (
                <Image source={USFlag} style={styles.flag} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("/settings")
              }}
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
  )
}

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
})
