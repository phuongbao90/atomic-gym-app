import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import { colors } from "../../styles/themes";
import { Animated, Pressable, View } from "react-native";
import { useAppSelector } from "../../stores/redux-store";
import { Extrapolation, useAnimatedStyle } from "react-native-reanimated";
import { interpolate } from "react-native-reanimated";
import { useMemo } from "react";

const _CustomBackdrop = ({
  animatedIndex,
  style,
}: BottomSheetBackdropProps) => {
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));
  const { close } = useBottomSheet();

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: "rgba(0, 0, 0, 1)",
        opacity: 0.5,
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return (
    <Animated.View style={containerStyle}>
      <Pressable
        onPress={() => {
          close?.();
        }}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );
};

export const AppBottomSheetModal = (
  props: BottomSheetModalProps & {
    children: React.ReactNode;
    modalRef: React.RefObject<BottomSheetModal>;
    testID?: string;
  }
) => {
  const theme = useAppSelector((state) => state.app.theme);
  return (
    <View testID={props.testID}>
      <BottomSheetModal
        ref={props.modalRef}
        // keyboardBehavior="fillParent"
        // keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        handleStyle={{
          backgroundColor:
            theme === "dark"
              ? colors.pageBackground.dark
              : colors.pageBackground.light,
        }}
        handleIndicatorStyle={{
          backgroundColor:
            theme === "light"
              ? colors.pageBackground.dark
              : colors.pageBackground.light,
        }}
        backdropComponent={_CustomBackdrop}
        {...props}
      >
        {props.children}
      </BottomSheetModal>
    </View>
  );
};
