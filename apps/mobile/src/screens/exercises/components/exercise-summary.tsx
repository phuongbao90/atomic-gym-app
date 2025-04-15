import Feather from "@expo/vector-icons/Feather";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Exercise } from "app";
import { useCallback, useRef, useState } from "react";
import { View, Linking, TouchableOpacity } from "react-native";
import { AppScrollView } from "../../../components/ui/app-scrollview";
import { AppText } from "../../../components/ui/app-text";
import { Divider } from "../../../components/ui/divider";
import { ListItem } from "../../../components/ui/list-item";
import { ThemedIcon } from "../../../components/ui/themed-icon";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { MuscleItem } from "../../../components/muscle-item";
import { AppBottomSheetView } from "../../../components/ui/app-bottom-sheet-view";
import { appStore$ } from "../../../stores/app-store";
import { use$ } from "@legendapp/state/react";
import { colors } from "../../../styles/themes";
import { AppBottomSheetModal } from "../../../components/ui/app-bottom-sheet-modal";

export const ExerciseSummary = ({
  exercise,
}: { exercise: Exercise | undefined }) => {
  const ref = useRef<BottomSheetModal>(null);
  const { t } = useTranslation();
  const theme = use$(appStore$.theme);
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
        <Image
          source={exercise.images?.[0]}
          style={{ width: "100%", height: 300 }}
          contentFit="cover"
        />
      )}
      <View className="px-4">
        <AppText className="text-3xl mt-4">
          {exercise?.translations?.[0].name}
        </AppText>
        <Divider className="my-4" />
        <AppText className="text-lg">
          {exercise?.translations?.[0].description}
        </AppText>
        <Divider className="my-4" />
        <AppText className="text-xl font-semibold my-4">
          {t("muscle_groups")}
        </AppText>
        <View className="flex-row flex-wrap gap-2">
          {exercise?.primaryMuscle?.map((muscleGroup) => (
            <MuscleItem key={muscleGroup.id} muscleGroup={muscleGroup} />
          ))}
        </View>
        <Divider className="my-4" />
        <ListItem
          label={t("view_notes")}
          labelClassName="text-xl"
          onPress={() => {
            ref.current?.present();
          }}
          Left={
            <ThemedIcon
              render={({ color }) => (
                <Feather name="message-square" size={24} color={color} />
              )}
            />
          }
        />

        <Divider className="my-4" />
        <ListItem
          label={t("view_on_youtube")}
          labelClassName="text-xl"
          onPress={() => {
            Linking.openURL(
              `https://www.youtube.com/results?search_query=${exercise?.translations?.[0]?.name}`
            );
          }}
          Left={
            <ThemedIcon
              render={({ color }) => (
                <Feather name="youtube" size={24} color={color} />
              )}
            />
          }
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
            <AppText className="text-xl">
              {exercise?.translations?.[0].name}
            </AppText>
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
