import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../../styles/themes";
import { Divider } from "./divider";

export const AppHeader = ({
  title,
  center = false,
  withBackButton = false,
  withBottomBorder = true,
  Right,
}: {
  title?: string;
  center?: boolean;
  withBackButton?: boolean;
  withBottomBorder?: boolean;
  Right?: React.ReactNode;
}) => {
  const router = useRouter();
  const mode = useColorScheme();
  return (
    <>
      <View style={[styles.container]}>
        {withBackButton && (
          <Feather
            name="chevron-left"
            size={26}
            color={theme.icon?.[mode.colorScheme!].color}
            onPress={() => {
              router.back();
            }}
            style={styles.backButton}
          />
        )}
        {!!title && (
          <Text
            style={[
              styles.title,
              withBackButton && { marginLeft: 60 },
              center && styles.center,
            ]}
          >
            {title}
          </Text>
        )}

        {!!Right && <View style={styles.right}>{Right}</View>}
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
});
