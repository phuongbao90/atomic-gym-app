import Feather from "@expo/vector-icons/Feather";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  SlideOutLeft,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export const OnboardNavigation = ({
  next,
  skip,
  activeIndex,
  count,
  skipButtonStyle,
  buttonStyle,
}: {
  next: () => void;
  skip: () => void;
  activeIndex: number;
  count: number;
  skipButtonStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}) => {
  const isEnd = activeIndex === count - 1;
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(isEnd ? 100 : 46),
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withDelay(200, withTiming(isEnd ? 1 : 0)),
    };
  });

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 32,
        alignItems: "center",
        height: 40,
        marginBottom: 16,
      }}
    >
      {!isEnd && (
        <Animated.View exiting={SlideOutLeft}>
          <TouchableOpacity onPress={skip} hitSlop={20}>
            <Text style={[styles.defaultSkipButton, skipButtonStyle]}>
              Bỏ qua
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <TouchableOpacity
        onPress={next}
        hitSlop={20}
        style={{ marginLeft: "auto" }}
      >
        <Animated.View
          style={[styles.defaultButton, buttonStyle, animatedButtonStyle]}
        >
          {isEnd ? (
            <Animated.Text
              key="text"
              style={[styles.defaultText, animatedTextStyle]}
            >
              Bắt đầu
            </Animated.Text>
          ) : (
            <Feather name="chevron-right" size={20} color="#fff" />
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  defaultButton: {
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 38,
  },
  defaultText: {
    color: "#fff",
  },
  defaultSkipButton: {
    color: "#666",
  },
});
