import { capitalizeString } from "app";
import { cva } from "class-variance-authority";
import { Fragment } from "react";
import { View } from "react-native";
import { AppText } from "../../../components/ui/app-text";
import { Divider } from "../../../components/ui/divider";
import {
  CalendarIcon,
  ChartIcon,
  CrosshairsIcon,
} from "../../../components/ui/expo-icon";
import { ListItem } from "../../../components/ui/list-item";
import { WorkoutItem } from "../../../components/workout-item";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { WorkoutPlanItemResponseSchema } from "app-config";

const mapCategory = cva("", {
  variants: {
    category: {
      STRENGTH: "gain_strength",
      ENDURANCE: "improve_endurance",
      BALANCE: "improve_balance",
      FLEXIBILITY: "improve_flexibility",
      LOOSE_WEIGHT: "loose_weight",
    },
  },
});

export const PlanInfo = ({
  item,
}: {
  item: z.infer<typeof WorkoutPlanItemResponseSchema> | undefined;
}) => {
  const { t } = useTranslation();

  if (!item) return null;

  const description = item?.description;

  return (
    <View className="mt-4">
      {description && (
        <Fragment>
          <AppText>{item?.description}</AppText>
          <Divider className="my-2" />
        </Fragment>
      )}

      {item?.goal && (
        <Fragment>
          <ListItem
            Left={<CrosshairsIcon size={22} />}
            label={t(mapCategory({ category: item?.goal }))}
          />
          <Divider className="my-2" />
        </Fragment>
      )}

      {item?.level && (
        <Fragment>
          <ListItem
            Left={<ChartIcon />}
            label={`${item.level ? capitalizeString(t(item.level)) : ""}`}
          />
          <Divider className="my-2" />
        </Fragment>
      )}

      {!!item.workoutTemplates?.length && (
        <>
          <ListItem
            Left={<CalendarIcon />}
            label={`${t(
              item.workoutTemplates?.length > 1
                ? "days_per_week"
                : "day_per_week",
              {
                count: item.workoutTemplates?.length,
              }
            )}`}
          />
          <Divider className="my-2" />
        </>
      )}

      <AppText className="text-lg font-bold mb-4">{t("workouts")}</AppText>
      <View className="gap-4">
        {Number(item?.workoutTemplates?.length) > 0 ? (
          item.workoutTemplates?.map((workoutTemplate, index) => (
            <Fragment key={workoutTemplate.id}>
              <WorkoutItem
                workoutTemplate={workoutTemplate}
                index={index}
                isPremiumPlan={item.isPremium ?? false}
              />
            </Fragment>
          ))
        ) : (
          <AppText className="text-center text-gray-500">empty</AppText>
        )}
      </View>
    </View>
  );
};
