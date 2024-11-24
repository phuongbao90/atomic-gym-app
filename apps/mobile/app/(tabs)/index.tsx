import { Colors } from "@/constants/Colors";
import { appColors } from "@repo/app-config/app-colors";

import {
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  View,
  Text,
} from "react-native";
// import { Colors } from "@/constants/Colors";

export default function HomeScreen() {
  console.log(Colors);

  return (
    <ScrollView>
      <View style={styles.titleContainer}>
        <Text style={{ color: appColors.dark.primary }}>Welcome 11111</Text>
      </View>
      <View style={styles.stepContainer}>
        <Text type="subtitle">Step 1: Try it</Text>
        <Text>
          Edit <Text type="defaultSemiBold">app/(tabs)/index.tsx</Text> to see
          changes. Press{" "}
          <Text type="defaultSemiBold">
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </Text>{" "}
          to open developer tools.
        </Text>
      </View>
      <View style={styles.stepContainer}>
        <Text type="subtitle">Step 2: Explore</Text>
        <Text>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </Text>
      </View>
      <View style={styles.stepContainer}>
        <Text type="subtitle">Step 3: Get a fresh start</Text>
        <Text>
          When you're ready, run{" "}
          <Text type="defaultSemiBold">npm run reset-project</Text> to get a
          fresh <Text type="defaultSemiBold">app</Text> directory. This will
          move the current <Text type="defaultSemiBold">app</Text> to{" "}
          <Text type="defaultSemiBold">app-example</Text>.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
