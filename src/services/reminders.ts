import { useEffect } from "react";
import { AppState, Linking, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { computeStats } from "./activityStore";
import { planReminders } from "./reminderPlan";
import { useAppStore } from "../store/useAppStore";
import { t } from "../i18n/core";

/** Native implementation (iOS/Android). The web build uses reminders.web.ts. */
export const remindersSupported = true;
const CHANNEL_ID = "reminders";

/** Asks for notification permission if needed. */
export async function ensureReminderPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

export function openNotificationSettings(): void {
  Linking.openSettings().catch(() => {});
}

/**
 * Replaces all scheduled reminders with a fresh plan reflecting the current
 * streak. Cheap and idempotent, so it runs whenever the app opens or closes.
 */
export async function rescheduleReminders(hour: number | null): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (hour == null) return;
  if (!(await Notifications.getPermissionsAsync()).granted) return;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: t("reminder.channel"),
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const stats = await computeStats();
  const plan = planReminders({ hour, streak: stats.currentStreak, practicedToday: stats.questionsToday > 0 });
  for (const reminder of plan) {
    await Notifications.scheduleNotificationAsync({
      content: { title: reminder.title, body: reminder.body, data: { url: "/learn" } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: reminder.date, channelId: CHANNEL_ID },
    });
  }
}

/**
 * Keeps reminders in step with play (rescheduled whenever the app comes to
 * the foreground or goes to the background) and opens the Learn tab when a
 * reminder is tapped. Mount once, in the root layout.
 */
export function useReminders(): void {
  const router = useRouter();
  const hydrated = useAppStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    const sync = () => rescheduleReminders(useAppStore.getState().reminderHour).catch(() => {});
    sync();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" || state === "background") sync();
    });
    return () => sub.remove();
  }, [hydrated]);

  useEffect(() => {
    const open = (response: Notifications.NotificationResponse | null) => {
      const url = response?.notification.request.content.data?.url;
      if (typeof url === "string") router.push(url as never);
    };
    Notifications.getLastNotificationResponseAsync().then(open).catch(() => {});
    const sub = Notifications.addNotificationResponseReceivedListener(open);
    return () => sub.remove();
  }, [router]);
}
