import { useTranslation } from "react-i18next";
import { AppHeader } from "../../../src/components/ui/app-header";
import { AppScreen } from "../../../src/components/ui/app-screen";
import { AppText } from "../../../src/components/ui/app-text";
import { router, useLocalSearchParams } from "expo-router";
import { AppTouchable } from "../../../src/components/ui/app-touchable";
import { Platform, View } from "react-native";
import {
  useUpdateWorkoutSession,
  useWorkoutSessionDetail,
} from "app/src/query/workout-session/workout-session.hooks";
import dayjs from "dayjs";
import { AppScrollView } from "../../../src/components/ui/app-scrollview";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { formatTimeObjectToSeconds } from "../../utils/convert-to-hour-minute-second";
import { TimerPickerModal } from "react-native-timer-picker";
import { useAppSelector } from "../../stores/redux-store";
import {
  convertToHourMinuteSecond,
  convertToTimeObject,
} from "../../utils/convert-to-hour-minute-second";
import { cn } from "../../utils/cn";

export function EditSessionDateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: workoutSession, refetch } = useWorkoutSessionDetail(id);
  const [date, setDate] = useState(workoutSession?.performedAt);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { mutate: updateWorkoutSession, isPending } = useUpdateWorkoutSession();

  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";
  const [showPicker, setShowPicker] = useState(false);
  const [duration, setDuration] = useState(workoutSession?.duration);
  const theme = useAppSelector((state) => state.app.theme);
  const language = useAppSelector((state) => state.app.language);

  const isDisabled =
    !date ||
    !duration ||
    (workoutSession?.performedAt === date &&
      workoutSession?.duration === duration);

  return (
    <AppScreen name="edit-session-date-screen" isLoading={isPending}>
      <AppHeader
        title={t("edit_session")}
        withBackButton
        Right={
          <AppTouchable
            disabled={isDisabled}
            onPress={() => {
              updateWorkoutSession(
                {
                  id,
                  body: {
                    performedAt: date,
                    duration,
                  },
                },
                {
                  onSuccess: () => {
                    refetch();
                    router.back();
                  },
                }
              );
            }}
          >
            <AppText
              className={cn({
                "text-gray-600 dark:text-gray-400": isDisabled,
              })}
            >
              {t("save")}
            </AppText>
          </AppTouchable>
        }
      />

      <AppScrollView
        contentContainerStyle={{
          paddingHorizontal: 12,
          marginTop: 12,
        }}
      >
        <View className="gap-2 mb-6">
          <AppText className="text-sm text-gray-700 dark:text-gray-400">
            {t("date_of_session")}
          </AppText>

          <AppTouchable
            className="self-start bg-neutral-700 px-4 py-2 rounded-md"
            onPress={() => {
              if (isAndroid) {
                DateTimePickerAndroid.open({
                  value: date ? new Date(date) : new Date(),
                  onChange: (_event, selectedDate) => {
                    if (selectedDate) {
                      setDate(selectedDate.toISOString());
                    }
                  },
                  mode: "date",
                  is24Hour: true,
                  maximumDate: new Date(),
                });
              }
              if (isIOS) {
                setShowDatePicker(true);
              }
            }}
          >
            <AppText className="text-sm text-white ">
              {dayjs(date).format("ddd, DD MMMM YYYY")}
            </AppText>
          </AppTouchable>
        </View>

        <View className="gap-2">
          <AppText className="text-sm text-gray-700 dark:text-gray-400">
            {t("duration_of_session")}
          </AppText>
          <AppTouchable
            className="self-start bg-neutral-700 px-4 py-2 rounded-md"
            onPress={() => {
              setShowPicker(true);
            }}
          >
            <AppText className="text-md text-white ">
              {convertToHourMinuteSecond(duration ?? 0)}
            </AppText>
          </AppTouchable>
        </View>
      </AppScrollView>
      {showDatePicker && isIOS && (
        <DateTimePicker
          value={date ? new Date(date) : new Date()}
          mode="date"
          is24Hour={true}
          onChange={(_event, selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate.toISOString());
              setShowDatePicker(false);
            }
          }}
          maximumDate={new Date()}
          locale={language === "vi" ? "vi-VN" : "en-US"}
        />
      )}
      <TimerPickerModal
        visible={showPicker}
        setIsVisible={setShowPicker}
        onConfirm={(pickedDuration) => {
          setDuration(formatTimeObjectToSeconds(pickedDuration));
          setShowPicker(false);
        }}
        onCancel={() => setShowPicker(false)}
        closeOnOverlayPress
        styles={{ theme: theme }}
        modalProps={{ overlayOpacity: 0.4 }}
        initialValue={convertToTimeObject(duration ?? 0)}
        confirmButtonText={t("confirm")}
        cancelButtonText={t("cancel")}
      />
    </AppScreen>
  );
}
