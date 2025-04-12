import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import { AppBottomSheetView } from "./app-bottom-sheet-view";
import { use$ } from "@legendapp/state/react";
import { appStore$ } from "../../stores/app-store";
import { colors } from "../../styles/themes";
import { StyleSheet, View } from "react-native";

const CustomBackdrop = (props: BottomSheetBackdropProps) => {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={1}
      opacity={0.5}
      pressBehavior="close"
      enableTouchThrough={true}
      style={[
        { backgroundColor: "rgba(0, 0, 0, 1)" },
        StyleSheet.absoluteFillObject,
      ]}
    />
  );
};

export const AppBottomSheetModal = (
  props: BottomSheetModalProps & {
    children: React.ReactNode;
    modalRef: React.RefObject<BottomSheetModal>;
    testID?: string;
  }
) => {
  const theme = use$(appStore$.theme);
  return (
    <View testID={props.testID}>
      <BottomSheetModal
        ref={props.modalRef}
        keyboardBehavior="fillParent"
        keyboardBlurBehavior="restore"
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
        backdropComponent={CustomBackdrop}
        {...props}
      >
        <AppBottomSheetView>{props.children}</AppBottomSheetView>
      </BottomSheetModal>
    </View>
  );
};
