import { View } from "react-native";
import { FloatingActionButton } from "./ui/floating-button";
import { StyleSheet, Pressable } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { appStore$ } from "../stores/app-store";
import { Image } from "expo-image";
import { USFlag } from "../constants/app-assets";
import { VNFlag } from "../constants/app-assets";
import { use$ } from "@legendapp/state/react";
import { useLanguage } from "../hooks/use-language";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const DevFloatingButtons = () => {
  const isExpanded = useSharedValue(false);

  const handlePress = () => {
    isExpanded.value = !isExpanded.value;
  };
  const language = use$(appStore$.language);
  const { switchLanguage } = useLanguage();

  const plusIconStyle = useAnimatedStyle(() => {
    // highlight-next-line
    const moveValue = interpolate(Number(isExpanded.value), [0, 1], [0, 2]);
    const translateValue = withTiming(moveValue);
    const rotateValue = isExpanded.value ? "45deg" : "0deg";

    return {
      transform: [
        { translateX: translateValue },
        { rotate: withTiming(rotateValue) },
      ],
    };
  });

  return (
    <View
      style={{ position: "absolute", bottom: 100, right: 10, zIndex: 1000 }}
    >
      <View style={styles.buttonContainer}>
        <AnimatedPressable
          onPress={handlePress}
          style={[styles.shadow, mainButtonStyles.button]}
        >
          <Animated.Text style={[plusIconStyle, mainButtonStyles.content]}>
            +
          </Animated.Text>
        </AnimatedPressable>
        <FloatingActionButton
          isExpanded={isExpanded}
          index={1}
          buttonLetter={"T"}
          onPress={() => {
            appStore$.switchTheme();
            handlePress();
          }}
        />
        <FloatingActionButton
          isExpanded={isExpanded}
          index={2}
          onPress={() => {
            switchLanguage(language);
            handlePress();
          }}
        >
          {language === "en" ? (
            <Image
              source={USFlag}
              style={{ width: 40, height: 40 }}
              testID="us-flag"
            />
          ) : (
            <Image
              source={VNFlag}
              style={{ width: 40, height: 40 }}
              testID="vn-flag"
            />
          )}
        </FloatingActionButton>
      </View>
    </View>
  );
};

const mainButtonStyles = StyleSheet.create({
  button: {
    zIndex: 1,
    height: 56,
    width: 56,
    borderRadius: 100,
    backgroundColor: "#b58df1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    fontSize: 40,
    color: "#f8f9ff",
  },
});

const styles = StyleSheet.create({
  buttonContainer: {
    position: "relative",
    height: 260,
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
