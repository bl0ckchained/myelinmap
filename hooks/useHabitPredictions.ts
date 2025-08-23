// hooks/useHabitPredictions.ts
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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

const DEFAULT_STATE: HabitPredictionsData = {
  predictions: {},
  behavioralInsights: {},
  correlations: [],
  loading: true,
  error: null,
};

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  // allow empty/204
  if (res.status === 204) return {} as T;
  return (await res.json()) as T;
}

export const useHabitPredictions = (
  userId: string
): HabitPredictionsData & { refreshPredictions: () => Promise<void> } => {
  const [data, setData] = useState<HabitPredictionsData>(DEFAULT_STATE);

  // Keep a stable engine instance
  const predictionEngine = useMemo(
    () => HabitPredictionEngine.getInstance(),
    []
  );

  // Abort + race guards
  const inflightRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const fetchPredictions = useCallback(
    async (signal?: AbortSignal) => {
      if (!userId) {
        setData({ ...DEFAULT_STATE, loading: false, error: "Missing userId" });
        return;
      }

      const myReqId = ++requestIdRef.current;
      setData((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const [habits, progress, activities] = await Promise.all([
          fetchJson<HabitRow[]>(
            `/api/habits?user_id=${encodeURIComponent(userId)}`,
            signal
          ),
          fetchJson<Record<string, HabitProgress>>(
            `/api/habit-progress?user_id=${encodeURIComponent(userId)}`,
            signal
          ),
          fetchJson<DailyActivity[]>(
            `/api/daily-activities?user_id=${encodeURIComponent(userId)}`,
            signal
          ),
        ]);

        // If a newer request started, ignore these results
        if (myReqId !== requestIdRef.current) return;

        const safeHabits = Array.isArray(habits) ? habits : [];
        const safeProgress = progress ?? {};
        const safeActivities = Array.isArray(activities) ? activities : [];

        // Group activities by habit_id once
        const activitiesByHabit = new Map<string, DailyActivity[]>();
        for (const a of safeActivities) {
          const key = a.habit_id;
          if (!key) continue;
          const arr = activitiesByHabit.get(key);
          if (arr) arr.push(a);
          else activitiesByHabit.set(key, [a]);
        }

        const predictions: Record<string, HabitPrediction> = {};
        const behavioralInsights: Record<string, BehavioralInsight> = {};

        for (const habit of safeHabits) {
          const habitProgress = safeProgress[habit.id];
          if (!habitProgress) continue;

          const perHabitActivities = activitiesByHabit.get(habit.id) ?? [];

          predictions[habit.id] = predictionEngine.predictHabitSuccess(
            habit,
            habitProgress,
            perHabitActivities
          );

          behavioralInsights[habit.id] =
            predictionEngine.analyzeBehavioralPsychology(
              habit,
              habitProgress,
              perHabitActivities
            );
        }

        const correlations: HabitCorrelation[] =
          typeof predictionEngine.calculateHabitCorrelations === "function" &&
          safeHabits.length > 1
            ? predictionEngine.calculateHabitCorrelations(
                safeHabits,
                safeProgress,
                safeActivities
              )
            : [];

        setData({
          predictions,
          behavioralInsights,
          correlations,
          loading: false,
          error: null,
        });
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        if (requestIdRef.current !== myReqId) return;
        setData((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error
              ? err.message
              : "Unknown error occurred fetching predictions",
        }));
      }
    },
    [userId, predictionEngine]
  );

  // Load / reload
  useEffect(() => {
    // cancel any in-flight request
    inflightRef.current?.abort();
    const controller = new AbortController();
    inflightRef.current = controller;

    void fetchPredictions(controller.signal);

    return () => controller.abort();
  }, [fetchPredictions]);

  const refreshPredictions = useCallback(async () => {
    inflightRef.current?.abort();
    const controller = new AbortController();
    inflightRef.current = controller;
    await fetchPredictions(controller.signal);
  }, [fetchPredictions]);

  return { ...data, refreshPredictions };
};
