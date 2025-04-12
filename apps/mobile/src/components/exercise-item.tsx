import { Exercise } from "app";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { appRoutes } from "../configs/routes";
import { ListItem } from "./ui/list-item";

export const ExerciseItem = ({
  item,
  index,
}: {
  item: Exercise;
  index: number;
}) => {
  const router = useRouter();

  return (
    <ListItem
      testID={`exercise-item-${item.id}`}
      label={`${item?.translations?.[0]?.name}${__DEV__ ? ` - ${index + 1}` : ""}`}
      labelClassName="text-lg font-bold"
      labelContainerClassName="ml-4"
      subLabel={`${item.primaryMuscle?.[0]?.translations?.[0]?.name}`}
      subLabelClassName="text-sm"
      onPress={() =>
        router.push(appRoutes.exercises.detail(item.id.toString()))
      }
      Left={
        item.images[0] ? (
          <Image
            source={item.images[0]}
            style={{
              width: 100,
              height: 100,
            }}
            contentFit="cover"
            testID="exercise-item-image"
          />
        ) : null
      }
    />
  );
};
