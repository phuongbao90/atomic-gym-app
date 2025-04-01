import { Workout, WorkoutPlan } from "app"
import { Text, View } from "react-native"
import { AppScrollView } from "../../../components/ui/app-scrollview"
import { Divider } from "../../../components/ui/divider"
import { ListItem } from "../../../components/ui/list-item"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { capitalizeString } from "app"
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6"
import { WorkoutItem } from "../../../components/workout-item"
import { cva } from "class-variance-authority"
import { ExpoIcon } from "../../../components/ui/expo-icon"
import { AppText } from "../../../components/ui/app-text"
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated"
import { ReanimatedScrollEvent } from "react-native-reanimated/lib/typescript/hook/commonTypes"

const mapCategory = cva("", {
  variants: {
    category: {
      STRENGTH: "Gain strength",
      ENDURANCE: "Improve endurance",
      BALANCE: "Improve balance",
      FLEXIBILITY: "Improve flexibility",
      LOOSE_WEIGHT: "Loose weight",
    },
  },
})

export const PlanInfo = ({
  item,
}: {
  item: WorkoutPlan | undefined
}) => {
  if (!item) return null
  return (
    <View className="mt-4">
      <AppText>{item?.description}</AppText>

      <Divider className="my-2" />

      <ListItem
        Left={<ExpoIcon library="fontAwesome6" name="crosshairs" size={22} />}
        label={mapCategory({ category: item?.category })}
      />
      <Divider className="my-2" />
      <ListItem
        Left={<ExpoIcon library="materialIcons" name="show-chart" size={24} />}
        label={`${capitalizeString(item.level)}`}
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
            label={`${Number(item.workouts?.length)} days per week`}
          />
          <Divider className="my-2" />
        </>
      )}

      <AppText className="text-lg font-bold mb-4">Workouts</AppText>
      <View className="gap-4">
        {item.workouts?.map((workout, index) => (
          <WorkoutItem
            key={workout.id}
            workout={workout as Workout & { _count: { exercises: number } }}
            index={index}
            isPremiumPlan={item.isPremium ?? false}
          />
        ))}
      </View>
    </View>
  )
}
