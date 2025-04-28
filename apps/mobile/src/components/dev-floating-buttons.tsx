import { View } from "react-native";
import { FloatingActionButton } from "./ui/floating-button";
import { StyleSheet, Pressable } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { USFlag } from "../constants/app-assets";
import { VNFlag } from "../constants/app-assets";
import { useAppDispatch, useAppSelector } from "../stores/redux-store";
import { switchLanguage, switchTheme } from "../stores/slices/app-slice";
import { increaseExerciseSetValue } from "../stores/slices/workout-session-slice";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const DevFloatingButtons = () => {
  const isExpanded = useSharedValue(false);
  const language = useAppSelector((state) => state.app.language);
  const dispatch = useAppDispatch();

  const handlePress = () => {
    isExpanded.value = !isExpanded.value;
  };

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
      style={{ position: "absolute", bottom: 100, right: 10, zIndex: 1000000 }}
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
            dispatch(switchTheme());
            handlePress();
          }}
        />
        <FloatingActionButton
          isExpanded={isExpanded}
          index={2}
          onPress={() => {
            dispatch(switchLanguage());
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
        <FloatingActionButton
          isExpanded={isExpanded}
          index={3}
          buttonLetter={"X"}
          onPress={() => {
            dispatch(
              increaseExerciseSetValue({
                workoutExerciseId: "19428957-ce2e-436b-b0ba-a829db55acb4",
                exerciseSetId: "f5250f1c-6b57-45b7-83ae-f97a8ac15485",
                type: "weight",
                value: 1,
              })
            );
            handlePress();
          }}
        />
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
    // height: 260,
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 1000000,
  },
  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
