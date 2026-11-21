import { t } from "../i18n/core";
import { dailyNumber } from "../quiz/daily";
import { localDateString } from "../gamification/streaks";

export interface PlannedReminder {
  date: Date;
  title: string;
  body: string;
}

/** Notifications are planned a few days out, so one still arrives if the app isn't opened for a while. */
export const REMINDER_DAYS_AHEAD = 4;

/**
 * The next few daily reminders at `hour`. Today's is skipped once the player
 * has practiced. The one that lands on the last day a streak can still be
 * saved says so; the rest point at that day's Daily.
 */
export function planReminders({
  hour,
  streak,
  practicedToday,
  now = new Date(),
}: {
  hour: number;
  streak: number;
  practicedToday: boolean;
  now?: Date;
}): PlannedReminder[] {
  const reminders: PlannedReminder[] = [];
  for (let day = 0; day < REMINDER_DAYS_AHEAD; day++) {
    const date = new Date(now);
    date.setDate(now.getDate() + day);
    date.setHours(hour, 0, 0, 0);
    if (date <= now || (day === 0 && practicedToday)) continue;

    // A streak survives until the end of the day after the last practice.
    const streakAtRisk = streak > 0 && day === (practicedToday ? 1 : 0);
    const daily = dailyNumber(localDateString(date));
    reminders.push(
      streakAtRisk
        ? { date, title: t("reminder.streakTitle", { streak }), body: t("reminder.streakBody", { daily }) }
        : { date, title: t("reminder.dailyTitle", { daily }), body: t("reminder.dailyBody") }
    );
  }
  return reminders;
}
