import { capitalize } from "lodash";
import notifee, { AndroidImportance } from "@notifee/react-native";
import { useTranslation } from "react-i18next";

export const useWorkoutSessionNotification = () => {
  const { t } = useTranslation();

  const notifyRestTime = async (restTime: number) => {
    await notifee.requestPermission();

    await notifee.stopForegroundService();

    const channelId = await notifee.createChannel({
      id: "rest-time", // same ID so it replaces & updates
      name: "Rest Timer",
      importance: AndroidImportance.NONE,
      sound: "default",
    });

    await notifee.displayNotification({
      id: "rest-time", // same ID so it replaces & updates
      title: capitalize(t("rest")),
      data: {
        restTime,
      },

      android: {
        channelId,
        asForegroundService: true,
        ongoing: true,
        autoCancel: false,
        showChronometer: true,
        chronometerDirection: "down", // now a countdown
        timestamp: Date.now() + restTime * 1000,
        sound: "default",
      },
    });
  };

  const cancelRestTimeNotification = async () => {
    await notifee.cancelNotification("workout");
    await notifee.stopForegroundService();
  };

  //   const notifyWorkoutSessionStart = async () => {
  //     await notifee.requestPermission();

  //     await notifee.stopForegroundService();

  //     const channelId = await notifee.createChannel({
  //       id: "activate-workout-session", // same ID so it replaces & updates
  //       name: "Workout in progress",
  //       importance: AndroidImportance.NONE,
  //     });

  //     await notifee.displayNotification({
  //       id: "activate-workout-session",
  //       title: capitalize(t("workout_in_progress")),
  //       android: {
  //         channelId,
  //         asForegroundService: true,
  //         ongoing: true,
  //         autoCancel: false,
  //         showChronometer: true,
  //         chronometerDirection: "up",
  //         timestamp: Date.now(),
  //       },
  //     });
  //   };

  //   const cancelWorkoutSessionNotification = async () => {
  //     await notifee.stopForegroundService();
  //     await notifee.cancelNotification("activate-workout-session");
  //   };

  return {
    notifyRestTime,
    cancelRestTimeNotification,
    // notifyWorkoutSessionStart,
    // cancelWorkoutSessionNotification,
  };
};
