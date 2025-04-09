import { Workout, WorkoutPlan } from "app";
import { capitalizeString } from "app";
import { cva } from "class-variance-authority";
import { Fragment } from "react";
import { View } from "react-native";
import { AppText } from "../../../components/ui/app-text";
import { Divider } from "../../../components/ui/divider";
import { ExpoIcon } from "../../../components/ui/expo-icon";
import { ListItem } from "../../../components/ui/list-item";
import { WorkoutItem } from "../../../components/workout-item";
import { useTranslation } from "react-i18next";

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
  item: WorkoutPlan | undefined;
}) => {
  const { t } = useTranslation();

  if (!item) return null;
  return (
    <View className="mt-4">
      <AppText>{item?.translations?.[0]?.description}</AppText>

      <Divider className="my-2" />

      <ListItem
        Left={<ExpoIcon library="fontAwesome6" name="crosshairs" size={22} />}
        label={t(mapCategory({ category: item?.category }))}
      />
      <Divider className="my-2" />
      <ListItem
        Left={<ExpoIcon library="materialIcons" name="show-chart" size={24} />}
        label={`${item.level ? capitalizeString(t(item.level)) : ""}`}
      />
      <Divider className="my-2" />
      {!!item.workouts?.length && (
        <>
          <ListItem
            Left={
              <ExpoIcon
                library="materialIcons"
                name="calendar-month"
                size={24}
              />
            }
            label={`${t(
              item.workouts?.length > 1 ? "days_per_week" : "day_per_week",
              {
                count: item.workouts?.length,
              }
            )}`}
          />
          <Divider className="my-2" />
        </>
      )}

      <AppText className="text-lg font-bold mb-4">{t("workouts")}</AppText>
      <View className="gap-4">
        {Number(item?.workouts?.length) > 0 ? (
          item.workouts?.map((workout, index) => (
            <Fragment key={workout.id}>
              <WorkoutItem
                workout={workout as Workout & { _count: { exercises: number } }}
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
