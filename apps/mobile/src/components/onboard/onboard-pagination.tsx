import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type PaginationCompProps = {
  index: number;
  activeIndex: number;
};

const PaginationComp = ({ index, activeIndex }: PaginationCompProps) => {
  const isActive = index === activeIndex;

  const animatedDotStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(isActive ? 18 : 10),
    };
  });

  return (
    <Animated.View
      style={[
        styles.dots,
        animatedDotStyle,
        { backgroundColor: index === activeIndex ? "black" : "gray" },
      ]}
    />
  );
};

export const OnboardPagination = ({
  count,
  style,
  activeIndex,
}: {
  count: number;
  style?: StyleProp<ViewStyle>;
  activeIndex: number;
}) => {
  return (
    <View style={[styles.footerContainer, style]}>
      {Array.from({ length: count }).map((_, index) => (
        <PaginationComp key={index} index={index} activeIndex={activeIndex} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  container: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dots: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: "black",
  },
});
