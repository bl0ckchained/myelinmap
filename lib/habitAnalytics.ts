// lib/habitAnalytics.ts
import type { HabitRow, HabitProgress } from "../types/habit";

/** Rollup analytics across a user's habits. */
export interface EnhancedAnalytics {
  averageCompletionRate: number; // percent 0–100
  longestStreak: number; // days
  myelinScore: number; // percent 0–100
  habitStrengths: Record<string, number>; // per-habit strength (0–100)
  weeklyTrends: {
    week: string; // label like "Jan 12"
    completionRate: number; // percent 0–100
    habitCount: number; // number of habit-days in bucket
  }[];
}

/** Daily reps per habit, e.g. { habitId: [{ date: '2025-01-12', reps: 2 }, ...] } */
export interface DailyReps {
  [habitId: string]: {
    date: string; // parsable by Date
    reps: number; // >= 0
  }[];
}

/* ---------- tiny utils ---------- */
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Local YYYY-MM-DD (avoids UTC shifting from toISOString). */
const localYMD = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/** Start of local week (Sunday) for a given date string. */
const getWeekStart = (dateString: string): string => {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "1970-01-01"; // guard
  const day = d.getDay(); // 0..6, Sunday=0
  const wk = new Date(d);
  wk.setHours(0, 0, 0, 0);
  wk.setDate(wk.getDate() - day); // back to Sunday
  return localYMD(wk);
};

/* ---------- public API ---------- */

export const calculateEnhancedAnalytics = (
  habits: HabitRow[],
  progress: Record<string, HabitProgress>,
  dailyReps: DailyReps,
): EnhancedAnalytics => {
  const habitIds = Object.keys(progress);

  // Average completion rate
  const totalCompletion = habitIds.reduce((sum, id) => sum + (progress[id]?.completion_rate ?? 0), 0);
  const averageCompletionRate = habitIds.length > 0 ? totalCompletion / habitIds.length : 0;

  // Longest streak
  const longestStreak = habitIds.length
    ? Math.max(...habitIds.map((id) => progress[id]?.current_streak ?? 0))
    : 0;

  // Myelin score (consistency + streak)
  const myelinScore =
    habitIds.reduce((sum, id) => {
      const p = progress[id];
      if (!p) return sum;
      const consistency = (p.completion_rate ?? 0) / 100;
      const streakFactor = Math.min((p.current_streak ?? 0) / 30, 1);
      const strength = (consistency * 0.7 + streakFactor * 0.3) * 100;
      return sum + strength;
    }, 0) / Math.max(habitIds.length, 1);

  // Individual habit strengths
  const habitStrengths: Record<string, number> = {};
  for (const id of habitIds) {
    const p = progress[id];
    if (!p) continue;
    const consistency = (p.completion_rate ?? 0) / 100;
    const streakFactor = Math.min((p.current_streak ?? 0) / 30, 1);
    habitStrengths[id] = (consistency * 0.7 + streakFactor * 0.3) * 100;
  }

  // Weekly trends (last ~8 local weeks)
  const weeklyTrends = calculateWeeklyTrends(dailyReps);

  return {
    averageCompletionRate: clamp(averageCompletionRate, 0, 100),
    longestStreak: Math.max(0, Math.round(longestStreak)),
    myelinScore: clamp(myelinScore, 0, 100),
    habitStrengths,
    weeklyTrends,
  };
};

/* ---------- internals ---------- */

const calculateWeeklyTrends = (dailyReps: DailyReps): EnhancedAnalytics["weeklyTrends"] => {
  const weeks = new Map<string, { completed: number; total: number }>();

  // Aggregate by local week start
  Object.values(dailyReps).forEach((entries) => {
    for (const { date, reps } of entries) {
      const weekKey = getWeekStart(date);
      const bucket = weeks.get(weekKey) ?? { completed: 0, total: 0 };
      bucket.total += 1;
      if ((reps ?? 0) > 0) bucket.completed += 1;
      weeks.set(weekKey, bucket);
    }
  });

  // Sort by week asc, keep last 8, format label in a stable way
  return Array.from(weeks.entries())
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .slice(-8)
    .map(([week, data]) => {
      const d = new Date(week);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const completionRate = data.total > 0 ? (data.completed / data.total) * 100 : 0;
      return {
        week: label,
        completionRate: clamp(completionRate, 0, 100),
        habitCount: data.total,
      };
    });
};

export const generateInsights = (analytics: EnhancedAnalytics): string[] => {
  const insights: string[] = [];

  // Consistency
  if (analytics.averageCompletionRate > 80) {
    insights.push("Excellent consistency! Your habits are well-established.");
  } else if (analytics.averageCompletionRate > 60) {
    insights.push("Good progress! Focus on consistency to strengthen your neural pathways.");
  } else {
    insights.push("Consider starting with fewer habits to build stronger foundations.");
  }

  // Streaks
  if (analytics.longestStreak > 21) {
    insights.push("You've built strong neural pathways — habits are becoming automatic!");
  } else if (analytics.longestStreak > 7) {
    insights.push("Keep going! You're building momentum in your habit formation.");
  }

  // Myelin score
  if (analytics.myelinScore > 75) {
    insights.push("Your myelin pathways are highly developed — excellent neural efficiency!");
  } else if (analytics.myelinScore > 50) {
    insights.push("Good myelin development — continue reinforcing these pathways.");
  }

  return insights;
};

export const calculateHabitStrength = (
  habit: HabitRow,
  progress: HabitProgress,
  dailyReps: { date: string; reps: number }[],
): number => {
  if (!progress) return 0;

  const consistency = (progress.completion_rate ?? 0) / 100;
  const streakFactor = Math.min((progress.current_streak ?? 0) / 30, 1);

  // Frequency: how many logged days in the last 30 entries (or fewer)
  const frequencyFactor = Math.min(dailyReps.length / 30, 1);

  // Slightly penalize very large goals/wraps (harder to complete), capped
  const goalPenalty = Math.min(0.15, Math.max(0, (habit.goal_reps - 21) / 200));
  const wrapPenalty = Math.min(0.1, Math.max(0, (habit.wrap_size - 7) / 100));

  const raw = consistency * 0.5 + streakFactor * 0.3 + frequencyFactor * 0.2 - goalPenalty - wrapPenalty;
  return clamp(raw, 0, 1) * 100;
};
// 0–100
