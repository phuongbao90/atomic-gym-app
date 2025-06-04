import { BottomSheetModal, BottomSheetModalProps } from "@gorhom/bottom-sheet";
import { colors } from "../../styles/themes";
import { View } from "react-native";
import { useAppSelector } from "../../stores/redux-store";
import { CustomBottomSheetBackdrop } from "../custom-bottom-sheet-backdrop";

export const AppBottomSheetModal = (
  props: BottomSheetModalProps & {
    children: React.ReactNode;
    modalRef: React.RefObject<BottomSheetModal> | null;
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
        backdropComponent={CustomBottomSheetBackdrop}
        {...props}
      >
        {props.children}
      </BottomSheetModal>
    </View>
  );
};
