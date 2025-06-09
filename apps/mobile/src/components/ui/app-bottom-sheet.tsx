import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetProps,
} from "@gorhom/bottom-sheet";

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
    <BottomSheet
      ref={modalRef}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      index={-1}
      {...props}
    >
      {children}
    </BottomSheet>
  );
};
