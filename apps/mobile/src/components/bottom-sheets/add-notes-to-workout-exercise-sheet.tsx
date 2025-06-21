import { Platform, TouchableOpacity, View } from "react-native";
import { AppText } from "../ui/app-text";
import BottomSheet, {
  BottomSheetModalProps,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useBottomSheetBackHandler } from "../../hooks/use-bottom-sheet-back-handler";
import { useAppDispatch, useAppSelector } from "../../stores/redux-store";
import { useRef, useState } from "react";
import { TextInput } from "react-native";
import { twColors } from "../../styles/themes";
import { useTranslation } from "react-i18next";
import { AppBottomSheetView } from "../ui/app-bottom-sheet-view";
import { AppBottomSheet } from "../ui/app-bottom-sheet";
import { addNotesToExercise } from "../../stores/slices/edit-exercise-set-slice";

export const AddNotesToWorkoutExerciseSheet = ({
  modalRef,
  workoutExerciseId,
}: {
  modalRef: React.RefObject<BottomSheet | null>;
  workoutExerciseId: string;
}) => {
  const { handleSheetPositionChange } = useBottomSheetBackHandler(modalRef);
  const dispatch = useAppDispatch();
  const _notes = useAppSelector(
    (s) =>
      s.editExerciseSet.sessionExercises.find((e) => e.id === workoutExerciseId)
        ?.notes
  );
  const [notes, setNotes] = useState(_notes);
  const inputRef = useRef<TextInput>(null);
  const { t } = useTranslation();

  function onSaveNotes() {
    if (notes) {
      dispatch(addNotesToExercise({ id: workoutExerciseId, notes }));
    }
    modalRef.current?.close();
  }

  type IosSetting =
    | {
        keyboardBehavior: "extend";
        keyboardBlurBehavior: "none";
      } // no push, keyboard cover the bottom sheet
    | {
        keyboardBehavior: "fillParent";
        keyboardBlurBehavior: "restore" | "none";
      } // push  content up and cover full screen
    | {
        keyboardBehavior: "interactive";
        keyboardBlurBehavior: "restore" | "none";
      }; // push some content up;

  const settings = Platform.select({
    ios: {
      keyboardBehavior: "interactive",
      keyboardBlurBehavior: "restore",
    } as IosSetting,
    android: {
      keyboardBehavior: "fillParent",
      keyboardBlurBehavior: "restore",
    } as Pick<
      BottomSheetModalProps,
      "keyboardBehavior" | "keyboardBlurBehavior"
    >,
  });

  return (
    <AppBottomSheet
      testID="add-notes-to-workout-exercise-sheet"
      modalRef={modalRef}
      // index={-1}
      snapPoints={["30%"]}
      maxDynamicContentSize={600}
      {...settings}
      onChange={(index, position, type) => {
        handleSheetPositionChange(index, position, type);

        const isOpen = index >= 0;
        if (isOpen) {
          inputRef.current?.setNativeProps({
            text: _notes,
          });
        }
      }}
    >
      <AppBottomSheetView style={{ height: 300, paddingBottom: 80 }}>
        <View className="flex-row items-center my-4 justify-center ">
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
      </AppBottomSheetView>
    </AppBottomSheet>
  );
};
