import { Exercise } from "app";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { appRoutes } from "../configs/routes";
import { ListItem } from "./ui/list-item";
import { usePreventRepeatPress } from "../hooks/use-prevent-repeat-press";
import { useTranslation } from "react-i18next";
import { upperCase } from "lodash";

export const ExerciseItem = ({
  item,
  index,
  right,
  setCount,
  opPress,
}: {
  item: Exercise | undefined;
  index: number;
  right?: React.ReactNode | null;
  setCount: number | undefined;
  opPress?: () => void;
}) => {
  const router = useRouter();
  const debouncedPress = usePreventRepeatPress();
  const { t } = useTranslation();

  if (!item) {
    return null;
  }

  return (
    <ListItem
      testID={`exercise-item-${item.id}`}
      label={`${item?.translations?.[0]?.name}${__DEV__ ? ` - ${index + 1}` : ""}`}
      labelClassName="text-lg font-bold"
      labelContainerClassName="ml-4"
      subLabel={setCount ? `${upperCase(t("sets"))}: ${setCount}` : undefined}
      subLabelClassName="text-sm text-gray-600 dark:text-gray-400"
      onPress={() =>
        debouncedPress(() => {
          if (opPress) {
            opPress?.();
            return;
          }
          router.push(appRoutes.exercises.detail(item.id.toString()));
        })
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
      // Right={children}
      Right={right}
    />
  );
};
