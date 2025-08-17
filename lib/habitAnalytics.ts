import { HabitRow, HabitProgress } from "../types/habit";

export interface EnhancedAnalytics {
  averageCompletionRate: number;
  longestStreak: number;
  myelinScore: number;
  habitStrengths: Record<string, number>;
  weeklyTrends: {
    week: string;
    completionRate: number;
    habitCount: number;
  }[];
}

export interface DailyReps {
  [habitId: string]: {
    date: string;
    reps: number;
  }[];
}

export const calculateEnhancedAnalytics = (
  habits: HabitRow[],
  progress: Record<string, HabitProgress>,
  dailyReps: DailyReps
): EnhancedAnalytics => {
  const habitIds = Object.keys(progress);

  // Average completion rate
  const totalCompletion = habitIds.reduce(
    (sum, id) => sum + (progress[id]?.completion_rate ?? 0),
    0
  );
  const averageCompletionRate =
    habitIds.length > 0 ? totalCompletion / habitIds.length : 0;

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

  // Weekly trends (last ~8 weeks)
  const weeklyTrends = calculateWeeklyTrends(dailyReps);

  return {
    averageCompletionRate,
    longestStreak,
    myelinScore,
    habitStrengths,
    weeklyTrends,
  };
};

const calculateWeeklyTrends = (
  dailyReps: DailyReps
): EnhancedAnalytics["weeklyTrends"] => {
  const weeks = new Map<string, { completed: number; total: number }>();

  // Iterate values to avoid unused habitId
  Object.values(dailyReps).forEach((reps) => {
    reps.forEach(({ date, reps: repCount }) => {
      const weekKey = getWeekStart(date);
      if (!weeks.has(weekKey)) {
        weeks.set(weekKey, { completed: 0, total: 0 });
      }
      const w = weeks.get(weekKey)!;
      w.total += 1;
      if (repCount > 0) w.completed += 1;
    });
  });

  return Array.from(weeks.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([week, data]) => ({
      week: new Date(week).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0,
      habitCount: data.total,
    }));
};

const getWeekStart = (dateString: string): string => {
  const d = new Date(dateString);
  // Normalize to local week start (Sunday=0)
  const day = d.getDay();
  const diff = d.getDate() - day; // back to Sunday
  const weekStart = new Date(d);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.toISOString().split("T")[0];
};

export const generateInsights = (analytics: EnhancedAnalytics): string[] => {
  const insights: string[] = [];

  if (analytics.averageCompletionRate > 80) {
    insights.push("Excellent consistency! Your habits are well-established.");
  } else if (analytics.averageCompletionRate > 60) {
    insights.push(
      "Good progress! Focus on consistency to strengthen your neural pathways."
    );
  } else {
    insights.push(
      "Consider starting with fewer habits to build stronger foundations."
    );
  }

  if (analytics.longestStreak > 21) {
    insights.push(
      "You've built strong neural pathways — habits are becoming automatic!"
    );
  } else if (analytics.longestStreak > 7) {
    insights.push(
      "Keep going! You're building momentum in your habit formation."
    );
  }

  if (analytics.myelinScore > 75) {
    insights.push(
      "Your myelin pathways are highly developed — excellent neural efficiency!"
    );
  } else if (analytics.myelinScore > 50) {
    insights.push("Good myelin development — continue reinforcing these pathways.");
  }

  return insights;
};

export const calculateHabitStrength = (
  habit: HabitRow,
  progress: HabitProgress,
  dailyReps: { date: string; reps: number }[]
): number => {
  if (!progress) return 0;

  const consistency = (progress.completion_rate ?? 0) / 100;
  const streakFactor = Math.min((progress.current_streak ?? 0) / 30, 1);
  const frequencyFactor = Math.min(dailyReps.length / 30, 1);

  // Use habit fields so the param isn't “unused”
  // Slightly penalize very large goals/wraps (harder to complete) but cap gently.
  const goalPenalty = Math.min(0.15, Math.max(0, (habit.goal_reps - 21) / 200));
  const wrapPenalty = Math.min(0.1, Math.max(0, (habit.wrap_size - 7) / 100));

  const raw =
    consistency * 0.5 + streakFactor * 0.3 + frequencyFactor * 0.2 - goalPenalty - wrapPenalty;

  return Math.max(0, Math.min(1, raw)) * 100;
};
