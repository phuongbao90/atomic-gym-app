import { BottomSheetView } from "@gorhom/bottom-sheet";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { AppText } from "../ui/app-text";

export const ExerciseNoteSheet = () => {
  //   const ref = useRef<BottomSheetModal>(null);
  return (
    <BottomSheetView>
      <AppText>Hello</AppText>
    </BottomSheetView>
  );
  //   return (
  //     <BottomSheetModal
  //       ref={ref}
  //       index={0}
  //       snapPoints={["50%"]}
  //       onChange={handleSheetChanges}
  //     >
  //       <BottomSheetView></BottomSheetView>
  //     </BottomSheetModal>
  //   );
};
