import Entypo from "@expo/vector-icons/Entypo"
import { Workout } from "app"
import { View, Text } from "react-native"
import { ExpoIcon } from "./ui/expo-icon"

const Badge = ({ label }: { label: string }) => {
  return (
    <View className="px-5 py-1 bg-primary rounded-2xl">
      <Text className="text-dark">{label}</Text>
    </View>
  )
}

export const WorkoutItem = ({
  workout,
  index,
  isPremiumPlan,
}: {
  workout: Workout & { _count: { exercises: number } }
  index: number
  isPremiumPlan: boolean
}) => {
  return (
    <View className="flex-row items-center bg-slate-200 rounded-lg py-3 px-2">
      <Badge label={`Day ${index + 1}`} />
      <View className="mx-4 flex-1">
        <Text numberOfLines={1} style={{ flex: 1 }}>
          {workout.name}
        </Text>
        {!!workout?._count?.exercises && (
          <Text>{`${workout._count.exercises} exercise${
            workout._count.exercises > 1 ? "s" : ""
          }`}</Text>
        )}
      </View>
      {isPremiumPlan && (
        // <Entypo name="lock" size={18} color="gray" className="ml-auto" />
        <ExpoIcon
          name="lock"
          size={18}
          color="gray"
          library="entypo"
          className="ml-auto"
        />
      )}
    </View>
  )
}
