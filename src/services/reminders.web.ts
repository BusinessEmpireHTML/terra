/** Web has no local notifications; reminders are an iOS/Android feature. */
export const remindersSupported = false;
export async function ensureReminderPermission(): Promise<boolean> {
  return false;
}
export function openNotificationSettings(): void {}
export async function rescheduleReminders(_hour: number | null): Promise<void> {}
export function useReminders(): void {}
