import { planReminders, REMINDER_DAYS_AHEAD } from "../reminderPlan";
import { setCurrentLanguage } from "../../i18n/core";

// Local time, 7:30 in the morning.
const morning = new Date(2026, 10, 21, 7, 30);
const evening = new Date(2026, 10, 21, 21, 0);

describe("planReminders", () => {
  afterEach(() => setCurrentLanguage("en"));

  it("plans one reminder a day at the chosen hour", () => {
    const plan = planReminders({ hour: 18, streak: 0, practicedToday: false, now: morning });
    expect(plan).toHaveLength(REMINDER_DAYS_AHEAD);
    plan.forEach((r, i) => {
      expect(r.date.getDate()).toBe(21 + i);
      expect(r.date.getHours()).toBe(18);
      expect(r.date.getMinutes()).toBe(0);
    });
    expect(plan[0].title).toMatch(/^🌍 Daily #\d+ is ready$/);
  });

  it("skips today once the player has practiced", () => {
    const plan = planReminders({ hour: 18, streak: 3, practicedToday: true, now: morning });
    expect(plan[0].date.getDate()).toBe(22);
    expect(plan).toHaveLength(REMINDER_DAYS_AHEAD - 1);
  });

  it("skips a time that has already passed today", () => {
    const plan = planReminders({ hour: 18, streak: 0, practicedToday: false, now: evening });
    expect(plan[0].date.getDate()).toBe(22);
  });

  it("warns about the streak only on the last day it can be saved", () => {
    const notYet = planReminders({ hour: 18, streak: 5, practicedToday: false, now: morning });
    expect(notYet[0].title).toBe("🔥 Keep your 5-day streak alive");
    expect(notYet.slice(1).every((r) => !r.title.includes("streak"))).toBe(true);

    const practiced = planReminders({ hour: 18, streak: 5, practicedToday: true, now: morning });
    expect(practiced[0].title).toBe("🔥 Keep your 5-day streak alive"); // tomorrow
    expect(practiced.slice(1).every((r) => !r.title.includes("streak"))).toBe(true);
  });

  it("numbers each day's Daily", () => {
    const plan = planReminders({ hour: 8, streak: 0, practicedToday: false, now: new Date(2026, 10, 21, 6, 0) });
    const numbers = plan.map((r) => Number(r.title.match(/#(\d+)/)?.[1]));
    expect(numbers).toEqual(numbers.map((_, i) => numbers[0] + i));
  });

  it("writes the text in the current language", () => {
    setCurrentLanguage("es");
    const plan = planReminders({ hour: 18, streak: 0, practicedToday: false, now: morning });
    expect(plan[0].title).not.toMatch(/is ready/);
  });
});
