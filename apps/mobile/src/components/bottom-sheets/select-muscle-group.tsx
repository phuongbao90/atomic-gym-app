import { Pressable, TouchableOpacity, View } from "react-native";
import { AppBottomSheetModal } from "../ui/app-bottom-sheet-modal";
import { AppText } from "../ui/app-text";
import { BottomSheetModal, BottomSheetSectionList } from "@gorhom/bottom-sheet";
import { MuscleGroup, useGetMuscleGroups } from "app";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { MuscleItem } from "../muscle-item";
import { cn } from "../../utils/cn";
import { Env } from "../../configs/env";
import { useBottomSheetBackHandler } from "../../hooks/use-bottom-sheet-back-handler";
export const SelectMuscleGroupSheet = ({
  modalRef,
  setSelectedMuscleGroup,
}: {
  modalRef: React.RefObject<BottomSheetModal>;
  setSelectedMuscleGroup: (muscleGroup: MuscleGroup | null) => void;
}) => {
  const { t } = useTranslation();
  const { data: muscleGroups } = useGetMuscleGroups();

  const [selectedMuscleGroupId, setSelectedMuscleGroupId] = useState(-1);

  const { handleSheetPositionChange } = useBottomSheetBackHandler(modalRef);

  const parentMuscleGroups = useMemo(() => {
    if (!muscleGroups) return [];
    return muscleGroups.reduce(
      (acc, curr) => {
        if (curr.parentId === null) {
          const newMuscleGroup = { ...curr, data: [] };
          acc.push(newMuscleGroup);
        } else {
          //   const parent = acc.find((m) => m.id === curr.parentId);
          //   if (parent) {
          //     parent.data.push(curr);
          //   }
        }
        return acc;
      },
      [] as (MuscleGroup & { data: MuscleGroup[] })[]
    );
  }, [muscleGroups]);

  // biome-ignore lint/correctness/useExhaustiveDependencies(modalRef.current?.close):
  // biome-ignore lint/correctness/useExhaustiveDependencies(setSelectedMuscleGroup):
  const renderSectionHeader = useCallback(
    ({ section }: { section: (typeof parentMuscleGroups)[number] }) => {
      const muscles = muscleGroups?.filter((m) => m.parentId === section.id);
      return (
        <View className="py-4">
          <View className="py-2 w-full pl-4 border-b border-gray-600 mb-4">
            <AppText className="text-xl font-bold">
              {section.translations?.[0].name}
            </AppText>
          </View>
          <View className="flex-row flex-wrap gap-y-8">
            {muscles?.map((muscle) => (
              <Pressable
                key={muscle.id}
                className="w-1/3"
                onPress={() => {
                  setSelectedMuscleGroupId(muscle.id);
                  setSelectedMuscleGroup(muscle);
                  modalRef.current?.close();
                }}
              >
                <MuscleItem
                  vertical
                  muscleGroup={muscle}
                  className={cn(
                    "pb-2 rounded-md",
                    selectedMuscleGroupId === muscle.id && "bg-gray-600"
                  )}
                />
              </Pressable>
            ))}
          </View>
          {/* <BottomSheetFlatList
            data={muscles || []}
            renderItem={({ item }) => (
              <MuscleItem muscleGroup={item} vertical />
            )}
            contentContainerStyle={{}}
            numColumns={3}
            style={{
              flexGrow: 1,
              gap: 30,
            }}
          /> */}
        </View>
      );
    },
    [muscleGroups, selectedMuscleGroupId]
  );

  return (
    <AppBottomSheetModal
      testID="select-muscle-group-sheet"
      modalRef={modalRef}
      snapPoints={["80%", "80%"]}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      enableBlurKeyboardOnGesture
      onChange={handleSheetPositionChange}
    >
      <View className="flex-row justify-between items-end px-4 py-4">
        <AppText className="text-2xl font-bold">{t("muscle_groups")}</AppText>
        <TouchableOpacity
          hitSlop={20}
          onPress={() => {
            setSelectedMuscleGroupId(-1);
            setSelectedMuscleGroup(null);
          }}
        >
          <AppText className="text-xl font-bold">{t("clear")}</AppText>
        </TouchableOpacity>
      </View>

      <BottomSheetSectionList
        testID="select-muscle-group-list"
        sections={parentMuscleGroups || []}
        renderSectionHeader={renderSectionHeader}
        renderItem={() => null}
        style={{
          flex: 1,
        }}
        initialNumToRender={Env.TEST_MODE ? 10000 : 10}
        contentContainerStyle={{ paddingBottom: 200 }}
      />
      {/* <BottomSheetSectionList
        sections={parentMuscleGroups || []}
        renderSectionHeader={renderSectionHeader}
        renderItem={() => null}
        style={{
          flex: 1,
        }}
        initialNumToRender={100}
      /> */}
    </AppBottomSheetModal>
  );
};
