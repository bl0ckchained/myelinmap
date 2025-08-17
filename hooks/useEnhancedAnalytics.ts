import { useState, useEffect, useCallback } from 'react';
import { HabitRow, HabitProgress } from '../types/habit';
import { 
  calculateEnhancedAnalytics, 
  generateInsights,
  DailyReps 
} from '../lib/habitAnalytics';

interface EnhancedAnalyticsData {
  habits: HabitRow[];
  progress: Record<string, HabitProgress>;
  dailyReps: DailyReps;
  analytics: ReturnType<typeof calculateEnhancedAnalytics>;
  insights: string[];
  loading: boolean;
  error: string | null;
}

export const useEnhancedAnalytics = (userId: string): EnhancedAnalyticsData & {
  refreshAnalytics: () => Promise<void>;
} => {
  const [data, setData] = useState<EnhancedAnalyticsData>({
    habits: [],
    progress: {},
    dailyReps: {},
    analytics: {
      averageCompletionRate: 0,
      longestStreak: 0,
      myelinScore: 0,
      habitStrengths: {},
      weeklyTrends: []
    },
    insights: [],
    loading: true,
    error: null
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch habits
      const habitsResponse = await fetch(`/api/habits?user_id=${userId}`);
      if (!habitsResponse.ok) throw new Error('Failed to fetch habits');
      const habits: HabitRow[] = await habitsResponse.json();

      // Fetch progress
      const progressResponse = await fetch(`/api/habit-progress?user_id=${userId}`);
      if (!progressResponse.ok) throw new Error('Failed to fetch progress');
      const progress: Record<string, HabitProgress> = await progressResponse.json();

      // Fetch daily reps
      const repsResponse = await fetch(`/api/daily-reps?user_id=${userId}`);
      if (!repsResponse.ok) throw new Error('Failed to fetch daily reps');
      const dailyReps: DailyReps = await repsResponse.json();

      // Calculate analytics
      const analytics = calculateEnhancedAnalytics(habits, progress, dailyReps);
      const insights = generateInsights(analytics);

      setData({
        habits,
        progress,
        dailyReps,
        analytics,
        insights,
        loading: false,
        error: null
      });
    } catch (error) {
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  }, [userId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const refreshAnalytics = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    ...data,
    refreshAnalytics
  };
};
