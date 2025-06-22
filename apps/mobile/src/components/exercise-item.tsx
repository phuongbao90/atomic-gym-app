import { useRouter } from "expo-router";
import { appRoutes } from "app-config";
import { ListItem } from "./ui/list-item";
import { usePreventRepeatPress } from "../hooks/use-prevent-repeat-press";
import { useTranslation } from "react-i18next";
import { upperCase } from "lodash";
import { z } from "zod";
import { ExerciseItemSchema } from "app-config";
import { AppImage } from "./ui/app-image";

export const ExerciseItem = ({
  item,
  index,
  right,
  setCount,
  opPress,
}: {
  item: z.infer<typeof ExerciseItemSchema> | undefined;
  index: number;
  right?: React.ReactNode | null;
  setCount: number | undefined;
  opPress?: () => void;
}) => {
  // console.log("🚀 ~ item:", JSON.stringify(item, null, 2));
  const router = useRouter();
  const debouncedPress = usePreventRepeatPress();
  const { t } = useTranslation();

  if (!item) {
    return null;
  }

  return (
    <ListItem
      testID={`exercise-item-${item.id}`}
      label={`${item?.name}${__DEV__ ? ` - ${index + 1}` : ""}`}
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
          <AppImage
            // source={item.images[0]}
            uri={item.images[0]}
            style={{
              width: 100,
              height: 100,
            }}
            contentFit="cover"
            testID="exercise-item-image"
            cachePolicy={"memory-disk"}
          />
        ) : null
      }
      // Right={children}
      Right={right}
    />
  );
};
