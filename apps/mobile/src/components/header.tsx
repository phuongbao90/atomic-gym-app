import { StyleSheet, TouchableOpacity, View } from "react-native"
import i18n from "../configs/i18n"
import { use$ } from "@legendapp/state/react"
import { appStore$ } from "../stores/app-store"
import Entypo from "@expo/vector-icons/Entypo"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { USFlag } from "../constants/app-assets"
import { Image } from "expo-image"
import { VNFlag } from "../constants/app-assets"

export function Header() {
  const theme = use$(appStore$.theme)
  return (
    <View
      testID="app-header"
      className="flex-row items-center justify-end px-4 py-3 bg-white"
    >
      <View className="flex-row gap-8">
        <TouchableOpacity
          onPress={() => {
            appStore$.switchTheme()
          }}
        >
          {theme === "light" ? (
            <Entypo name="light-up" size={24} color="black" />
          ) : (
            <MaterialIcons name="dark-mode" size={24} color="black" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            appStore$.switchLanguage()
          }}
        >
          {i18n.language === "vi" ? (
            <Image source={VNFlag} style={styles.flag} />
          ) : (
            <Image source={USFlag} style={styles.flag} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  flag: {
    height: 20,
    aspectRatio: 513 / 342,
  },
})
