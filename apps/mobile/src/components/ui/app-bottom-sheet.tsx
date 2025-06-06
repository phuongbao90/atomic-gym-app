import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetProps,
} from "@gorhom/bottom-sheet";
import { View } from "react-native";

export const AppBottomSheet = ({
  modalRef,
  children,
  testID,
  ...props
}: {
  modalRef: React.RefObject<BottomSheet | null>;
  children: React.ReactNode;
  testID?: string;
} & BottomSheetProps) => {
  const renderBackdrop = (props: BottomSheetBackdropProps) => {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    );
  };

  return (
    <View testID={testID}>
      <BottomSheet
        ref={modalRef}
        enablePanDownToClose
        //   detached
        //   bottomInset={40}
        //   backgroundStyle={{
        //     backgroundColor: "transparent",
        //   }}
        //   handleComponent={null}
        backdropComponent={renderBackdrop}
        index={-1}
        {...props}
      >
        {children}
      </BottomSheet>
    </View>
  );
};
