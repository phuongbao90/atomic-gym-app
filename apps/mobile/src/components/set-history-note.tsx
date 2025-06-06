import BottomSheet from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../stores/redux-store";
import { AppText } from "./ui/app-text";
import { AppTouchable } from "./ui/app-touchable";
import { View } from "react-native";

export const HistoryAndNotes = ({
  noteRef,
  historyRef,
  workoutExerciseId,
}: {
  noteRef: React.RefObject<BottomSheet | null>;
  historyRef: React.RefObject<BottomSheet | null>;
  workoutExerciseId: string;
}) => {
  const { t } = useTranslation();
  const notes = useAppSelector(
    (s) =>
      s.workoutSession?.activeWorkout?.workoutExercises?.find(
        (we) => we.id === workoutExerciseId
      )?.notes
  );

  return (
    <View className="flex-row items-center gap-x-4">
      <AppTouchable
        className="flex-1 border border-gray-500 rounded-3xl p-2"
        hitSlop={10}
        onPress={() => {
          historyRef.current?.expand();
        }}
      >
        <AppText className="text-center">{t("history")}</AppText>
      </AppTouchable>
      <AppTouchable
        className="flex-1 border border-gray-500 rounded-3xl p-2"
        hitSlop={10}
        onPress={() => {
          noteRef.current?.expand();
        }}
      >
        <View className="flex-row items-center gap-x-2 justify-center">
          {!!notes && <View className="w-2 h-2 rounded-full bg-primary" />}
          <AppText className="text-center">{t("notes")}</AppText>
        </View>
      </AppTouchable>
    </View>
  );
};
