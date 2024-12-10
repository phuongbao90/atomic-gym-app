import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const AppHeader = ({
  title,
  center = false,
  withBackButton = false,
  Right,
}: {
  title: string;
  center?: boolean;
  withBackButton?: boolean;
  Right?: React.ReactNode;
}) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {withBackButton && (
        <Feather
          name="chevron-left"
          size={26}
          color="black"
          onPress={() => {
            console.log("back");
            router.back();
          }}
          style={styles.backButton}
        />
      )}
      <Text style={[styles.title, center && styles.center]}>{title}</Text>
      {!!Right && <View style={styles.right}>{Right}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    height: 50,
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
    right: 10,
    zIndex: 1000,
  },
});
