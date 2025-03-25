import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
// import { BottomSheetModal } from "@gorhom/bottom-sheet";
// import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Exercise, exerciseQuery } from "app";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { useRef, useState } from "react";
import { Linking, TextInput, View, useWindowDimensions } from "react-native";
// import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { ExerciseNoteSheet } from "../../../components/bottom-sheets/exercise-note-sheet";
import { MuscleItem } from "../../../components/muscle-item";
import { AppBottomSheetView } from "../../../components/ui/app-bottom-sheet-view";
import { AppHeader } from "../../../components/ui/app-header";
import { AppScreen } from "../../../components/ui/app-screen";
import { AppText } from "../../../components/ui/app-text";
import { AppScrollView } from "../../../components/ui/app-scrollview";
import { Divider } from "../../../components/ui/divider";
import { ListItem } from "../../../components/ui/list-item";
import { ThemedIcon } from "../../../components/ui/themed-icon";
import { theme } from "../../../styles/themes";

const Summary = ({ exercise }: { exercise?: Exercise }) => {
  const ref = useRef<BottomSheetModal>(null);
  const mode = useColorScheme();

  const [notes, setNotes] = useState(exercise?.notes);

  function handleSheetChanges(index: number) {
    console.log("index", index);
  }

  if (!exercise) return null;
  return null;
  return (
    <AppScrollView
      contentContainerStyle={{
        paddingBottom: 30,
      }}
    >
      {exercise.images?.[0] && (
        <Image
          source={exercise.images?.[0]}
          style={{ width: "100%", aspectRatio: 1 }}
          contentFit="cover"
        />
      )}
      <View className="px-4">
        <AppText className="text-3xl mt-4">{exercise?.name}</AppText>
        <Divider className="my-4" />
        <AppText className="text-lg">{exercise?.description}</AppText>
        <Divider className="my-4" />
        <AppText className="text-xl font-semibold my-4">Muscle Groups</AppText>
        <View className="flex-row flex-wrap gap-2">
          {exercise?.muscleGroups?.map((muscleGroup) => (
            <MuscleItem key={muscleGroup.id} muscleGroup={muscleGroup} />
          ))}
        </View>
        <Divider className="my-4" />
        <ListItem
          label="View notes"
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
          label="View on Youtube"
          labelClassName="text-xl"
          onPress={() => {
            Linking.openURL(
              `https://www.youtube.com/results?search_query=${exercise?.name}`,
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
      {/* <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={["65%", "100%"]}
        onChange={handleSheetChanges}
        handleStyle={{
          backgroundColor: theme.pageBackground[mode.colorScheme!],
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.text[mode.colorScheme!].main,
        }}
        style={{
          borderTopColor: theme.text[mode.colorScheme!].main,
          borderTopWidth: 1,
          flexGrow: 1,
        }}
      >
        <AppBottomSheetView>
          <View className="px-4">
            <AppText className="text-2xl font-semibold">Notes</AppText>
            <AppText className="text-xl">{exercise?.name}</AppText>
          </View>
          <Divider className="my-4" />

          <TextInput
            placeholder="Add a note"
            placeholderTextColor={theme.text[mode.colorScheme!].inactive}
            multiline
            value={notes}
            onChangeText={(text) => {
              setNotes(text);
            }}
            style={{
              color: theme.text[mode.colorScheme!].main,
              fontSize: 16,
            }}
          />
        </AppBottomSheetView>
      </BottomSheetModal> */}
    </AppScrollView>
  );
};

const History = ({ exercise }: { exercise?: Exercise }) => {
  if (!exercise) return null;
  return (
    <View>
      <AppText>{exercise?.name}</AppText>
    </View>
  );
};

const routes = [
  { key: "summary", title: "Summary" },
  { key: "history", title: "History" },
];

export default function ExercisePage() {
  const params = useLocalSearchParams();
  const { data } = exerciseQuery.getExercise(Number(params.id));
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const mode = useColorScheme();

  // console.log("data ", data);

  return (
    <AppScreen>
      <AppHeader withBackButton Right={<Icons />} withBottomBorder={false} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          summary: () => <Summary exercise={data?.data} />,
          history: () => <History exercise={data?.data} />,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{
              backgroundColor: "transparent",
            }}
            activeColor={theme.text?.[mode.colorScheme!].primary}
            inactiveColor={theme.text?.[mode.colorScheme!].inactive}
          />
        )}
      />
    </AppScreen>
  );
}

const Icons = () => {
  const mode = useColorScheme();
  return (
    <View className="flex-row gap-6">
      <Ionicons
        name="pencil"
        size={24}
        color={theme.icon?.[mode.colorScheme!].color}
      />
      <Ionicons
        name="options-sharp"
        size={24}
        color={theme.icon?.[mode.colorScheme!].color}
      />
    </View>
  );
};
