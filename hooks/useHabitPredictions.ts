// hooks/useHabitPredictions.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import type { HabitRow, HabitProgress, DailyActivity } from "../types/habit";
import {
  HabitPredictionEngine,
  type HabitPrediction,
  type BehavioralInsight,
  type HabitCorrelation,
} from "../lib/habitPredictions";

interface HabitPredictionsData {
  predictions: Record<string, HabitPrediction>;
  behavioralInsights: Record<string, BehavioralInsight>;
  correlations: HabitCorrelation[];
  loading: boolean;
  error: string | null;
}

export const useHabitPredictions = (
  userId: string
): HabitPredictionsData & { refreshPredictions: () => Promise<void> } => {
  const [data, setData] = useState<HabitPredictionsData>({
    predictions: {},
    behavioralInsights: {},
    correlations: [],
    loading: true,
    error: null,
  });

  // Keep a stable engine instance
  const predictionEngine = useMemo(
    () => HabitPredictionEngine.getInstance(),
    []
  );

  const fetchPredictions = useCallback(async () => {
    if (!userId) {
      setData((prev) => ({ ...prev, loading: false, error: "Missing userId" }));
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    setData((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Fetch in parallel
      const [habitsRes, progressRes, activitiesRes] = await Promise.all([
        fetch(`/api/habits?user_id=${encodeURIComponent(userId)}`, {
          signal,
          headers: { Accept: "application/json" },
          cache: "no-store",
        }),
        fetch(`/api/habit-progress?user_id=${encodeURIComponent(userId)}`, {
          signal,
          headers: { Accept: "application/json" },
          cache: "no-store",
        }),
        fetch(`/api/daily-activities?user_id=${encodeURIComponent(userId)}`, {
          signal,
          headers: { Accept: "application/json" },
          cache: "no-store",
        }),
      ]);

      if (!habitsRes.ok) throw new Error("Failed to fetch habits");
      if (!progressRes.ok) throw new Error("Failed to fetch progress");
      if (!activitiesRes.ok) throw new Error("Failed to fetch daily activities");

      const [habitsJson, progressJson, activitiesJson] = await Promise.all([
        habitsRes.json(),
        progressRes.json(),
        activitiesRes.json(),
      ]);

      // Narrow types defensively
      const habits = (Array.isArray(habitsJson) ? habitsJson : []) as HabitRow[];
      const progress = (progressJson ?? {}) as Record<string, HabitProgress>;
      const dailyActivities = (Array.isArray(activitiesJson)
        ? activitiesJson
        : []) as DailyActivity[];

      const predictions: Record<string, HabitPrediction> = {};
      const behavioralInsights: Record<string, BehavioralInsight> = {};

      for (const habit of habits) {
        const habitProgress = progress[habit.id];
        if (!habitProgress) continue;

        const perHabitActivities = dailyActivities.filter(
          (a) => a.habit_id === habit.id
        );

        // Engine calls
        predictions[habit.id] = predictionEngine.predictHabitSuccess(
          habit,
          habitProgress,
          perHabitActivities
        );

        behavioralInsights[habit.id] = predictionEngine.analyzeBehavioralPsychology(
          habit,
          habitProgress,
          perHabitActivities
        );
      }

      // Correlations (guard if engine method is optional)
      const correlations: HabitCorrelation[] =
        typeof predictionEngine.calculateHabitCorrelations === "function"
          ? predictionEngine.calculateHabitCorrelations(
              habits,
              progress,
              dailyActivities
            )
          : [];

      // Only set state if still mounted / not aborted
      if (!signal.aborted) {
        setData({
          predictions,
          behavioralInsights,
          correlations,
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return; // ignore aborts
      setData((prev) => ({
        ...prev,
        loading: false,
        error:
          err instanceof Error ? err.message : "Unknown error occurred fetching predictions",
      }));
    }

    // Return a cleanup function so React can abort if this invocation is superseded
    return () => controller.abort();
  }, [userId, predictionEngine]);

  useEffect(() => {
    let active = true;
    (async () => {
      const cleanup = await fetchPredictions();
      // if fetchPredictions returned a cleanup (it will), call it when effect ends
      if (!active && typeof cleanup === "function") cleanup();
    })();
    return () => {
      active = false;
    };
  }, [fetchPredictions]);

  const refreshPredictions = useCallback(async () => {
    await fetchPredictions();
  }, [fetchPredictions]);

  return { ...data, refreshPredictions };
};
