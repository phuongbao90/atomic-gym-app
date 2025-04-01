import { useRouter } from "expo-router"
import {
  FlatList,
  Pressable,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { AppHeader } from "../../components/ui/app-header"
import { AppScreen } from "../../components/ui/app-screen"
import { useGetWorkoutPlansInGroups, WorkoutPlan } from "app"
import { useMemo } from "react"
import {
  SingleWorkoutPlanCard,
  WorkoutPlanCard,
} from "../../components/workout-plan-card"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { Divider } from "../../components/ui/divider"
import { AppButton } from "../../components/ui/app-button"
import { appRoutes } from "../../configs/routes"

export function WorkoutPlansTabScreen() {
  const router = useRouter()

  const { data } = useGetWorkoutPlansInGroups()
  const sections = useMemo(() => {
    if (!data) return []
    return [
      {
        title: "FEATURED",
        data: [data.isFeatured],
      },
      ...data.byCategory.map((item) => ({
        title: item.result.name,
        data: [item.result.data],
      })),
      {
        title: "SINGLE",
        data: [data.single],
      },
    ]
  }, [data])

  function renderSectionHeader({
    section,
  }: { section: (typeof sections)[number] }) {
    const data = section.data.flat()

    return (
      <>
        <SectionTitle title={section.title} />
        {section.title !== "SINGLE" ? (
          <FlatList
            data={data}
            horizontal
            renderItem={({ item }) => <WorkoutPlanCard item={item} />}
            style={{ flex: 1 }}
            contentContainerStyle={{
              gap: 12,
              paddingHorizontal: 12,
            }}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <View className="px-4 py-4 gap-4">
            {data?.length > 0 &&
              data.map((item) =>
                item ? (
                  <SingleWorkoutPlanCard key={item.id} item={item} />
                ) : null
              )}
          </View>
        )}
      </>
    )
  }

  return (
    <AppScreen name="workout-plans-screen">
      <AppHeader title="Workout Plans" />
      <SectionList
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderItem={() => null}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            <SectionTitle title="Exercises" />
            <Pressable>
              <View className="px-6 bg-black">
                <Divider />
                <View className="flex-row items-center gap-2 py-4">
                  <FontAwesome5 name="dumbbell" size={20} color="black" />
                  <Text className="text-lg text-gray-500">
                    View all 300+ exercises
                  </Text>
                </View>
                <Divider />
              </View>
            </Pressable>

            <View style={{ height: 40 }} />
          </>
        }
      />
      <View className="absolute bottom-6 right-6">
        <AppButton
          title="Build plan"
          onPress={() => {
            router.navigate(appRoutes.workoutPlans.create)
          }}
        />
      </View>
    </AppScreen>
  )
}

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <View className="px-6 py-4">
      <Text className="text-lg font-bold">{title}</Text>
    </View>
  )
}
