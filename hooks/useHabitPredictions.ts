import { useState, useEffect, useCallback } from 'react';
import { HabitRow, HabitProgress, DailyActivity } from '../types/habit';
import { HabitPredictionEngine, HabitPrediction, BehavioralInsight, HabitCorrelation } from '../lib/habitPredictions';

interface HabitPredictionsData {
  predictions: Record<string, HabitPrediction>;
  behavioralInsights: Record<string, BehavioralInsight>;
  correlations: HabitCorrelation[];
  loading: boolean;
  error: string | null;
}

export const useHabitPredictions = (userId: string): HabitPredictionsData & {
  refreshPredictions: () => Promise<void>;
} => {
  const [data, setData] = useState<HabitPredictionsData>({
    predictions: {},
    behavioralInsights: {},
    correlations: [],
    loading: true,
    error: null
  });

  const predictionEngine = HabitPredictionEngine.getInstance();

  const fetchPredictions = useCallback(async () => {
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

      // Fetch daily activities
      const activitiesResponse = await fetch(`/api/daily-activities?user_id=${userId}`);
      if (!activitiesResponse.ok) throw new Error('Failed to fetch daily activities');
      const dailyActivities: DailyActivity[] = await activitiesResponse.json();

      // Generate predictions
      const predictions: Record<string, HabitPrediction> = {};
      const behavioralInsights: Record<string, BehavioralInsight> = {};

      habits.forEach(habit => {
        const habitProgress = progress[habit.id];
        if (habitProgress) {
          const prediction = predictionEngine.predictHabitSuccess(
            habit,
            habitProgress,
            dailyActivities.filter(a => a.habit_id === habit.id)
          );
          predictions[habit.id] = prediction;

          const insight = predictionEngine.analyzeBehavioralPsychology(
            habit,
            habitProgress,
            dailyActivities.filter(a => a.habit_id === habit.id)
          );
          behavioralInsights[habit.id] = insight;
        }
      });

      // Calculate correlations
      const correlations = predictionEngine.calculateHabitCorrelations(
        habits,
        progress,
        dailyActivities
      );

      setData({
        predictions,
        behavioralInsights,
        correlations,
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
    fetchPredictions();
  }, [fetchPredictions]);

  const refreshPredictions = useCallback(async () => {
    await fetchPredictions();
  }, [fetchPredictions]);

  return {
    ...data,
    refreshPredictions
  };
};
