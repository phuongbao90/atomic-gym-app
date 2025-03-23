import { Exercise } from "@repo/app";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { appRoutes } from "../configs/routes";
import { ListItem } from "./ui/list-item";

export const ExerciseItem = ({ item }: { item: Exercise }) => {
  const router = useRouter();
  return (
    <ListItem
      label={item.name}
      labelClassName="text-lg font-bold"
      labelContainerClassName="ml-4"
      subLabel={item.category}
      subLabelClassName="text-sm"
      withBottomDivider
      onPress={() => router.push(appRoutes.exercise(item.id.toString()))}
      Left={
        item.images[0] ? (
          <Image
            source={item.images[0]}
            style={{
              width: 100,
              height: 100,
            }}
            contentFit="cover"
          />
        ) : null
      }
    />
  );
};
