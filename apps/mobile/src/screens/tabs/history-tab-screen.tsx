import { RefreshControl, View } from "react-native";
import { AppScreen } from "../../components/ui/app-screen";
import { AppText } from "../../components/ui/app-text";
import { Calendar } from "react-native-calendars";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../stores/redux-store";
import {
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  twColors,
} from "../../styles/themes";
import { useCallback, useMemo } from "react";
import { useWorkoutSessionHistory } from "app";
import { LegendList } from "@legendapp/list";
import { AppTouchable } from "../../components/ui/app-touchable";
import { useRouter } from "expo-router";
import { appRoutes } from "app-config";
import { dayjs } from "../../lib/dayjs";
import { z } from "zod";
import { WorkoutSessionHistoryItemSchema } from "app-config";

export const HistoryTabScreen = () => {
  const { t } = useTranslation();
  const theme = useAppSelector((s) => s.app.theme);
  const language = useAppSelector((s) => s.app.language);
  const router = useRouter();

  const {
    data: workoutSessionHistory,
    isRefetching,
    refetch,
  } = useWorkoutSessionHistory();
  // console.log(
  //   "🚀 ~ HistoryTabScreen ~ workoutSessionHistory:",
  //   JSON.stringify(workoutSessionHistory, null, 2)
  // );

  const calendarData = useCalendarData(workoutSessionHistory);

  const renderItem = useCallback(
    ({ item }: { item: z.infer<typeof WorkoutSessionHistoryItemSchema> }) => {
      // console.log("🚀 ~ renderItem ~ item:", item?.workoutTemplate?.name);
      return (
        <AppTouchable onPress={() => handleNavigate(item.id)}>
          <View className="h-20 mx-4 border-b border-gray-200 flex-row justify-between items-center">
            <View>
              <AppText className="text-sm">
                {item?.completedAt
                  ? dayjs(item?.completedAt)?.format("ddd, DD MMM")
                  : ""}
              </AppText>
              <AppText className="text-lg">
                {item?.workoutTemplate?.name ?? ""}
              </AppText>
            </View>
          </View>
        </AppTouchable>
      );
    },
    []
  );

  const handleNavigate = (id: string) => {
    router.navigate(appRoutes.workoutSession.detail(id));
  };

  return (
    <AppScreen name="history-tab-screen" safeAreaEdges={["top"]}>
      <View className="my-4 ml-4">
        <AppText className="text-3xl">{t("history")}</AppText>
      </View>

      <LegendList
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListHeaderComponent={
          <Calendar
            key={theme + language}
            style={{
              height: 350,
              marginBottom: 20,
            }}
            firstDay={1}
            hideExtraDays
            theme={{
              backgroundColor: theme === "dark" ? twColors.slate[700] : "#fff", // background color of the outer
              calendarBackground:
                theme === "dark" ? twColors.slate[700] : "#fff", // background color of the inner
              monthTextColor: theme === "dark" ? twColors.slate[300] : "#000",
              dayTextColor: theme === "dark" ? twColors.slate[300] : "#000", // text color of the day
              textSectionTitleColor:
                theme === "dark" ? twColors.slate[100] : "#000", // name of the day
              //
              // textSectionTitleDisabledColor:
              //   theme === "dark" ? twColors.slate[100] : "#fff",
              // selectedDayBackgroundColor: "#00adf5",
              // selectedDayTextColor: "red",
              // todayTextColor: "#00adf5",
              // textDisabledColor: "#d9e1e8",
              // dotColor: "#00adf5",
              // selectedDotColor: "red",
              // arrowColor: "orange",
              // disabledArrowColor: "#d9e1e8",
              // indicatorColor: "blue",
              // textDayFontFamily: "monospace",
              // textMonthFontFamily: "monospace",
              // textDayHeaderFontFamily: "monospace",
              // textDayFontWeight: "300",
              // textMonthFontWeight: "bold",
              // textDayHeaderFontWeight: "300",
              // textDayFontSize: 16,
              // textMonthFontSize: 16,
              // textDayHeaderFontSize: 16,
            }}
            markingType="dot"
            onDayPress={(...day) => {
              console.log(day);
            }}
            {...calendarData}
          />
        }
        data={workoutSessionHistory || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={70}
      />
    </AppScreen>
  );
};

const useCalendarData = (
  workoutSessionHistory:
    | z.infer<typeof WorkoutSessionHistoryItemSchema>[]
    | undefined
) => {
  const theme = useAppSelector((s) => s.app.theme);
  const markedDates = useMemo(() => {
    if (!workoutSessionHistory || workoutSessionHistory.length === 0) return {};
    return workoutSessionHistory?.reduce(
      (acc, cur) => {
        const date = cur.completedAt
          ? dayjs(cur.completedAt)?.format("YYYY-MM-DD")
          : undefined;
        if (!date) return acc;
        if (!acc[date]) {
          //   "2025-05-01": {
          //     marked: true,
          //     dotColor: theme === "dark" ? PRIMARY_COLOR : PRIMARY_COLOR_DARK,
          //   },

          acc[date] = {
            marked: true,
            dotColor: theme === "dark" ? PRIMARY_COLOR : PRIMARY_COLOR_DARK,
          };
        }
        return acc;
      },
      {} as Record<
        string,
        {
          marked: true;
          dotColor: string;
        }
      >
    );
  }, [workoutSessionHistory, theme]);

  return {
    markedDates,
  };
};
