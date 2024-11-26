import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <ScrollView>
      <View style={styles.titleContainer}></View>
      <Text>This app includes example code to help you get started.</Text>

      <Text>This app has two screens: </Text>
      <Text>
        The layout file in <Text>app/(tabs)/_layout.tsx</Text> sets up the tab
        navigator.
      </Text>

      <Text>
        You can open this project on Android, iOS, and the web. To open the web
        version, press <Text>w</Text> in the terminal running this project.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
