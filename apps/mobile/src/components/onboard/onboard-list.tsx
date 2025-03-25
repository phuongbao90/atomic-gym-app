import { Image } from "expo-image";
import { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  SlideInLeft,
  SlideOutRight,
  useSharedValue,
} from "react-native-reanimated";
import { OnboardNavigation } from "./onboard-navigation";
import { OnboardPagination } from "./onboard-pagination";
import { OnboardItem } from "./onboard-schemas";

export const OnboardList = ({
  data,
  onComplete,
  onSkip,
  skipButtonStyle,
  buttonStyle,
}: {
  data: OnboardItem[];
  onComplete: () => void;
  onSkip: () => void;
  skipButtonStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}) => {
  const [index, setIndex] = useState(0);
  const offsetX = useSharedValue<number>(0);

  const swipeGesture = Gesture.Pan()
    .onChange((event) => {
      offsetX.value += event.changeX;
    })
    .onFinalize(() => {
      console.log("finalize");
      if (offsetX.value < -100 && index < data.length - 1) {
        runOnJS(setIndex)(index + 1);
        // console.log("swipe right");
      }
      if (offsetX.value > 100 && index > 0) {
        runOnJS(setIndex)(index - 1);
        // console.log("swipe left");
      }
      offsetX.value = 0;
    });

  function handleNext() {
    if (index === data.length - 1) {
      onComplete();
    } else {
      setIndex((prev) => prev + 1);
    }
  }

  function handleSkip() {
    onSkip();
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <GestureDetector gesture={swipeGesture}>
          <RenderItem item={data[index]} index={index} count={data.length} />
        </GestureDetector>
        <OnboardNavigation
          next={handleNext}
          skip={handleSkip}
          activeIndex={index}
          count={data.length}
          skipButtonStyle={skipButtonStyle}
          buttonStyle={buttonStyle}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const RenderItem = ({
  index,
  item,
  count,
}: {
  index: number;
  item: OnboardItem;
  count: number;
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const entering = SlideInLeft.delay(200)
    .duration(300)
    .springify()
    .damping(10)
    .mass(0.25);
  const exiting = SlideOutRight.duration(400)
    .springify()
    .damping(10)
    .mass(0.25);

  return (
    <Animated.View
      style={[styles.item, { width: SCREEN_WIDTH }]}
      collapsable={false}
    >
      <Animated.View
        key={`image-${item.id}`}
        entering={entering}
        exiting={exiting}
      >
        <Image
          source={item.image}
          style={styles.itemImage}
          contentFit="contain"
        />
      </Animated.View>
      <OnboardPagination
        count={count}
        activeIndex={index}
        style={styles.pagination}
      />
      <Animated.Text
        key={`title-${item.id}`}
        entering={entering}
        exiting={exiting}
        style={styles.itemTitle}
      >
        {item.title}
      </Animated.Text>
      <Animated.Text
        key={`description-${item.id}`}
        entering={entering}
        exiting={exiting}
        style={styles.itemDescription}
      >
        {item.description}
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
  },
  itemImage: {
    width: "100%",
    height: 300,
    marginTop: 40,
  },
  itemTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  itemDescription: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
  },
  pagination: {
    marginTop: 20,
  },
});
