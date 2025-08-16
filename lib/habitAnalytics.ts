import { HabitRow, HabitProgress } from '../types/habit';

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
  
  // Calculate average completion rate
  const totalCompletion = habitIds.reduce((sum, id) => {
    return sum + (progress[id]?.completion_rate || 0);
  }, 0);
  const averageCompletionRate = habitIds.length > 0 ? totalCompletion / habitIds.length : 0;

  // Find longest streak
  const longestStreak = Math.max(...habitIds.map(id => progress[id]?.current_streak || 0));

  // Calculate myelin score (based on consistency and streak)
  const myelinScore = habitIds.reduce((sum, id) => {
    const habitProgress = progress[id];
    if (!habitProgress) return sum;
    
    const consistency = habitProgress.completion_rate / 100;
    const streakFactor = Math.min(habitProgress.current_streak / 30, 1);
    const habitStrength = (consistency * 0.7 + streakFactor * 0.3) * 100;
    
    return sum + habitStrength;
  }, 0) / Math.max(habitIds.length, 1);

  // Calculate individual habit strengths
  const habitStrengths: Record<string, number> = {};
  habitIds.forEach(id => {
    const habitProgress = progress[id];
    if (habitProgress) {
      const consistency = habitProgress.completion_rate / 100;
      const streakFactor = Math.min(habitProgress.current_streak / 30, 1);
      habitStrengths[id] = (consistency * 0.7 + streakFactor * 0.3) * 100;
    }
  });

  // Calculate weekly trends
  const weeklyTrends = calculateWeeklyTrends(dailyReps, habits);

  return {
    averageCompletionRate,
    longestStreak,
    myelinScore,
    habitStrengths,
    weeklyTrends
  };
};

const calculateWeeklyTrends = (
  dailyReps: DailyReps,
  habits: HabitRow[]
): EnhancedAnalytics['weeklyTrends'] => {
  const weeks = new Map<string, { completed: number; total: number }>();

  Object.entries(dailyReps).forEach(([habitId, reps]) => {
    reps.forEach(({ date, reps: repCount }) => {
      const week = getWeekStart(date);
      if (!weeks.has(week)) {
        weeks.set(week, { completed: 0, total: 0 });
      }
      
      const weekData = weeks.get(week)!;
      weekData.total++;
      if (repCount > 0) {
        weekData.completed++;
      }
    });
  });

  return Array.from(weeks.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8) // Last 8 weeks
    .map(([week, data]) => ({
      week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0,
      habitCount: data.total
    }));
};

const getWeekStart = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDay();
  const diff = date.getDate() - day;
  const weekStart = new Date(date.setDate(diff));
  return weekStart.toISOString().split('T')[0];
};

export const generateInsights = (
  analytics: EnhancedAnalytics,
  habits: HabitRow[]
): string[] => {
  const insights: string[] = [];

  if (analytics.averageCompletionRate > 80) {
    insights.push("Excellent consistency! Your habits are well-established.");
  } else if (analytics.averageCompletionRate > 60) {
    insights.push("Good progress! Focus on consistency to strengthen your neural pathways.");
  } else {
    insights.push("Consider starting with fewer habits to build stronger foundations.");
  }

  if (analytics.longestStreak > 21) {
    insights.push("You've built strong neural pathways - habits are becoming automatic!");
  } else if (analytics.longestStreak > 7) {
    insights.push("Keep going! You're building momentum in your habit formation.");
  }

  if (analytics.myelinScore > 75) {
    insights.push("Your myelin pathways are highly developed - excellent neural efficiency!");
  } else if (analytics.myelinScore > 50) {
    insights.push("Good myelin development - continue reinforcing these pathways.");
  }

  return insights;
};

export const calculateHabitStrength = (
  habit: HabitRow,
  progress: HabitProgress,
  dailyReps: { date: string; reps: number }[]
): number => {
  if (!progress) return 0;

  const consistency = progress.completion_rate / 100;
  const streakFactor = Math.min(progress.current_streak / 30, 1);
  const frequencyFactor = Math.min(dailyReps.length / 30, 1);
  
  return (consistency * 0.5 + streakFactor * 0.3 + frequencyFactor * 0.2) * 100;
};
