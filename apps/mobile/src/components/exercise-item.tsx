import { Exercise, WorkoutExercise } from "app";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { appRoutes } from "../configs/routes";
import { ListItem } from "./ui/list-item";
import { usePreventRepeatPress } from "../hooks/use-prevent-repeat-press";

export const ExerciseItem = ({
  item,
  index,
  right,
}: {
  item: WorkoutExercise;
  index: number;
  right?: React.ReactNode | null;
}) => {
  const router = useRouter();
  const debouncedPress = usePreventRepeatPress();

  return (
    <ListItem
      testID={`exercise-item-${item.id}`}
      label={`${item?.exercise?.translations?.[0]?.name}${__DEV__ ? ` - ${index + 1}` : ""}`}
      labelClassName="text-lg font-bold"
      labelContainerClassName="ml-4"
      subLabel={`${item.exercise?.primaryMuscle?.[0]?.translations?.[0]?.name}`}
      subLabelClassName="text-sm"
      onPress={() =>
        debouncedPress(() => {
          router.push(
            appRoutes.exercises.detail(item.exercise?.id.toString() ?? "")
          );
        })
      }
      Left={
        item.exercise?.images[0] ? (
          <Image
            source={item.exercise?.images[0]}
            style={{
              width: 100,
              height: 100,
            }}
            contentFit="cover"
            testID="exercise-item-image"
          />
        ) : null
      }
      // Right={children}
      Right={right}
    />
  );
};
