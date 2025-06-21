import { useEffect } from "react";
import { Platform } from "react-native";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
  EventType,
  Notification,
  TimestampTrigger,
  TriggerType,
} from "@notifee/react-native";

// --- Constants & Types ---
const NOTIFICATION_CHANNEL_ID = "default";
const NOTIFICATION_CHANNEL_NAME = "Default Channel";

/**
 * A more specific type for the notification data payload.
 * Helps ensure type safety when handling notification data.
 */
export type NotificationData = {
  screen?: string;
  id?: string;
  [key: string]: string | undefined;
};

// --- State Flag ---
// Prevents re-creating the channel if the hook is re-rendered.
let channelCreated = false;

// --- Standalone Functions (replacing static methods) ---

/**
 * Creates the default notification channel for Android.
 * It's safe to call this multiple times thanks to the internal flag.
 */
const createNotificationChannel = async (): Promise<void> => {
  if (Platform.OS === "android" && !channelCreated) {
    try {
      await notifee.createChannel({
        id: NOTIFICATION_CHANNEL_ID,
        name: NOTIFICATION_CHANNEL_NAME,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        sound: "default",
      });
      channelCreated = true;
      console.log(
        "[useNotificationSetup] Notification channel created/verified."
      );
    } catch (error) {
      console.error(
        "[useNotificationSetup] Failed to create notification channel:",
        error
      );
    }
  }
};

/**
 * Displays a notification using Notifee from a remote message payload.
 * @param remoteMessage - The remote message received from FCM.
 */
export const displayNotification = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
): Promise<void> => {
  try {
    const notification: Notification = {
      // Add fallbacks for title and body to prevent errors
      title: remoteMessage.notification?.title ?? "New Notification",
      body: remoteMessage.notification?.body ?? "",
      data: remoteMessage.data,
      android: {
        channelId: NOTIFICATION_CHANNEL_ID,
        pressAction: {
          id: "default",
        },
      },
      ios: {
        sound: "default",
        // You can add attachments or other iOS specific options here
      },
    };

    console.log("[displayNotification] Displaying notification:", notification);
    await notifee.displayNotification(notification);
  } catch (error) {
    console.error(
      "[displayNotification] Failed to display notification:",
      error
    );
  }
};

/**
 * Retrieves the FCM registration token for the device.
 * @returns The FCM token string, or null if permissions are denied.
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const settings = await notifee.getNotificationSettings();
    if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
      console.warn("[getFCMToken] Notification permissions not granted.");
      return null;
    }
    const token = await messaging().getToken();
    console.log("[getFCMToken] FCM Token retrieved:", token);
    return token;
  } catch (error) {
    console.error("[getFCMToken] Failed to get FCM token:", error);
    return null;
  }
};

/**
 * Schedules a local notification to be displayed at a future time.
 */
export const scheduleLocalNotification = async (
  title: string,
  body: string,
  date: Date,
  data?: NotificationData
): Promise<string> => {
  // Prevent scheduling notifications for a past date
  if (date.getTime() <= Date.now()) {
    throw new Error("Cannot schedule a notification for a date in the past.");
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
  };

  const notificationId = await notifee.createTriggerNotification(
    {
      title,
      body,
      data: data as unknown as Record<string, string>,
      android: { channelId: NOTIFICATION_CHANNEL_ID },
    },
    trigger
  );
  console.log(
    `[scheduleLocalNotification] Notification scheduled with ID: ${notificationId}`
  );
  return notificationId;
};

/**
 * Cancels a previously scheduled local notification.
 */
export const cancelScheduledNotification = async (
  notificationId: string
): Promise<void> => {
  await notifee.cancelNotification(notificationId);
  console.log(`[cancelScheduledNotification] Canceled: ${notificationId}`);
};

// --- The Main Custom Hook ---

type NotificationHandler = (notification?: Notification) => void;

/**
 * A custom hook to set up all notification listeners and handle permissions.
 * This should be used in your root layout component (e.g., `_layout.tsx`).
 * @param onNotificationOpened - A callback that fires when a user presses a notification.
 * Typically used for navigation.
 */
export const useNotificationSetup = (
  onNotificationOpened: NotificationHandler
) => {
  useEffect(() => {
    const initialize = async () => {
      // 1. Create channel
      await createNotificationChannel();

      // 2. Request permissions and check status
      const settings = await notifee.requestPermission();
      const enabled =
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
        settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;
      if (!enabled) {
        console.warn(
          "[useNotificationSetup] User denied notification permissions."
        );
        return; // Exit setup if permissions are not granted
      }

      // 3. Check for initial notification that opened the app
      const initialNotification = await notifee.getInitialNotification();
      if (initialNotification) {
        console.log(
          "[useNotificationSetup] App opened by initial notification."
        );
        onNotificationOpened(initialNotification.notification);
      }
    };

    initialize();

    // --- Set up listeners ---

    // 4. Listener for foreground FCM messages
    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage) => {
        console.log(
          "[useNotificationSetup] FCM Message received in foreground."
        );
        displayNotification(remoteMessage);
      }
    );

    // 5. Listener for Notifee foreground events (notification press)
    const unsubscribeNotifeeForeground = notifee.onForegroundEvent(
      ({ type, detail }) => {
        if (type === EventType.PRESS) {
          console.log(
            "[useNotificationSetup] User pressed notification in foreground."
          );
          onNotificationOpened(detail.notification);
        }
      }
    );

    // 6. Listener for Notifee background events (notification press)
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log(
          "[useNotificationSetup] User pressed notification in background.",
          detail.notification
        );
        // This log is a good place to add analytics for background notification presses.
        // The onNotificationOpened callback is handled by getInitialNotification
        // when the app re-opens from a quit state.
      }
    });

    // --- Return cleanup function ---
    return () => {
      unsubscribeOnMessage();
      unsubscribeNotifeeForeground();
    };
  }, [onNotificationOpened]);
};
