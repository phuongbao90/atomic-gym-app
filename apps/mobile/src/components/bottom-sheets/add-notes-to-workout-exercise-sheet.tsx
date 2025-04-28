import { TouchableOpacity, View } from "react-native";

import { AppBottomSheetModal } from "../ui/app-bottom-sheet-modal";
import { AppText } from "../ui/app-text";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useBottomSheetBackHandler } from "../../hooks/use-bottom-sheet-back-handler";
import { WorkoutExercise } from "app";
import { addNotesToWorkoutExercise } from "../../stores/slices/workout-session-slice";
import { useAppDispatch } from "../../stores/redux-store";
import { useEffect, useRef, useState } from "react";
import { BottomSheetTextInputProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput";
import { TextInput, TextInputProps } from "react-native";
import { twColors } from "../../styles/themes";
import { useTranslation } from "react-i18next";

export const AddNotesToWorkoutExerciseSheet = ({
  modalRef,
  workoutExercise,
}: {
  modalRef: React.RefObject<BottomSheetModal>;
  workoutExercise: WorkoutExercise;
}) => {
  const { handleSheetPositionChange } = useBottomSheetBackHandler(modalRef);
  const dispatch = useAppDispatch();

  const [notes, setNotes] = useState(workoutExercise.notes);
  const inputRef = useRef<TextInput>(null);
  const { t } = useTranslation();

  function onSaveNotes() {
    dispatch(
      addNotesToWorkoutExercise({
        workoutExerciseId: workoutExercise.id,
        notes: notes || "",
      })
    );
    modalRef.current?.dismiss();
  }
  return (
    <AppBottomSheetModal
      testID="add-notes-to-workout-exercise-sheet"
      modalRef={modalRef}
      snapPoints={["80%", "80%"]}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      enableBlurKeyboardOnGesture
      keyboardBehavior="extend"
      android_keyboardInputMode="adjustResize"
      onChange={(index, position, type) => {
        handleSheetPositionChange(index, position, type);

        const isOpen = index >= 0;
        if (isOpen) {
          inputRef.current?.setNativeProps({
            text: workoutExercise.notes,
          });
        }
      }}
    >
      <View className="flex-row items-center my-4 justify-center">
        <AppText className="text-xl">{t("add_notes")}</AppText>
        <TouchableOpacity
          hitSlop={10}
          className="absolute right-4"
          onPress={onSaveNotes}
        >
          <AppText className="text-xl text-indigo-700 dark:text-indigo-400 font-bold">
            {t("save")}
          </AppText>
        </TouchableOpacity>
      </View>
      <BottomSheetTextInput
        //@ts-ignore
        ref={inputRef}
        placeholder="Add notes"
        placeholderTextColor={twColors.gray[500]}
        multiline
        className="text-black dark:text-white text-lg pl-4"
        onChangeText={setNotes}
      />
    </AppBottomSheetModal>
  );
};
