import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import { View, Linking, TouchableOpacity, Dimensions } from "react-native";
import { AppScrollView } from "../../../components/ui/app-scrollview";
import { AppText } from "../../../components/ui/app-text";
import { Divider } from "../../../components/ui/divider";
import { ListItem } from "../../../components/ui/list-item";
import { useTranslation } from "react-i18next";
import { MuscleItem } from "../../../components/muscle-item";
import { AppBottomSheetView } from "../../../components/ui/app-bottom-sheet-view";
import { colors } from "../../../styles/themes";
import { AppBottomSheetModal } from "../../../components/ui/app-bottom-sheet-modal";
import { useAppSelector } from "../../../stores/redux-store";
import { ExerciseItemSchema } from "app-config";
import { z } from "zod";
import { MessageIcon, YoutubeIcon } from "../../../components/ui/expo-icon";
import { AppImage } from "../../../components/ui/app-image";

export const ExerciseSummary = ({
  exercise,
}: { exercise: z.infer<typeof ExerciseItemSchema> | undefined }) => {
  const ref = useRef<BottomSheetModal>(null);
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.app.theme);
  const [notes, setNotes] = useState(exercise?.notes);

  const handleSaveNotes = useCallback(() => {
    //TODO: call put api
    //

    ref.current?.close();
  }, [exercise?.notes]);

  const handleDismiss = useCallback(() => {
    setNotes(exercise?.notes);
  }, [exercise?.notes]);

  if (!exercise) {
    return (
      <View className="flex-1 items-center justify-center">
        <AppText>{t("no_exercise_data")}</AppText>
      </View>
    );
  }

  return (
    <AppScrollView
      contentContainerStyle={{
        paddingBottom: 60,
      }}
    >
      {exercise?.images?.[0] && (
        <AppImage
          uri={exercise.images?.[0]}
          style={{ width: "100%", height: 300 }}
          height={300}
          contentFit="cover"
        />
      )}
      <View className="px-4">
        <AppText className="text-3xl mt-4">{exercise?.name}</AppText>
        <Divider className="my-4" />
        <AppText className="text-lg">{exercise?.description}</AppText>
        <Divider className="my-4" />
        <AppText className="text-xl font-semibold my-4">
          {t("muscle_groups")}
        </AppText>
        <View className="flex-row flex-wrap gap-2">
          {exercise?.muscleGroups?.map((muscleGroup) => (
            <MuscleItem
              key={muscleGroup.muscleGroup.id}
              muscleGroup={muscleGroup.muscleGroup}
            />
          ))}
        </View>
        <Divider className="my-4" />
        <ListItem
          label={t("view_notes")}
          labelClassName="text-xl"
          onPress={() => {
            ref.current?.present();
          }}
          Left={<MessageIcon />}
        />

        <Divider className="my-4" />
        <ListItem
          label={t("view_on_youtube")}
          labelClassName="text-xl"
          onPress={() => {
            Linking.openURL(
              `https://www.youtube.com/results?search_query=${exercise?.name}`
            );
          }}
          Left={<YoutubeIcon />}
        />
        <Divider className="mt-4" />
      </View>
      <AppBottomSheetModal
        modalRef={ref}
        snapPoints={["65%", "65%"]}
        onDismiss={handleDismiss}
        enableDismissOnClose
      >
        <AppBottomSheetView>
          <View className="px-4">
            <View className="flex-row justify-between items-center">
              <AppText className="text-2xl font-semibold">{t("notes")}</AppText>
              <TouchableOpacity onPress={handleSaveNotes} hitSlop={20}>
                <AppText className="text-primary dark:text-primary text-xl font-bold">
                  {t("save")}
                </AppText>
              </TouchableOpacity>
            </View>
            <AppText className="text-xl">{exercise?.name}</AppText>
          </View>
          <Divider className="my-4" />

          <BottomSheetTextInput
            placeholder="Add a note"
            placeholderTextColor={
              theme === "dark"
                ? colors.text.dark.inactive
                : colors.text.light.inactive
            }
            multiline
            value={notes ?? ""}
            onChangeText={(text) => {
              setNotes(text);
            }}
            style={{
              color:
                theme === "dark"
                  ? colors.text.dark.main
                  : colors.text.light.main,
              fontSize: 16,
              paddingHorizontal: 12,
            }}
          />
        </AppBottomSheetView>
      </AppBottomSheetModal>
    </AppScrollView>
  );
};
