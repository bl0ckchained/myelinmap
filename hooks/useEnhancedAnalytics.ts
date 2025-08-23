// hooks/useEnhancedAnalytics.ts
import { useState, useEffect, useCallback, useRef } from "react";
import type { HabitRow, HabitProgress } from "../types/habit";
import {
  calculateEnhancedAnalytics,
  generateInsights,
  type DailyReps,
} from "../lib/habitAnalytics";

interface EnhancedAnalyticsData {
  habits: HabitRow[];
  progress: Record<string, HabitProgress>;
  dailyReps: DailyReps;
  analytics: ReturnType<typeof calculateEnhancedAnalytics>;
  insights: string[];
  loading: boolean;
  error: string | null;
}

const DEFAULT_STATE: EnhancedAnalyticsData = {
  habits: [],
  progress: {},
  dailyReps: {},
  analytics: {
    averageCompletionRate: 0,
    longestStreak: 0,
    myelinScore: 0,
    habitStrengths: {},
    weeklyTrends: [],
  },
  insights: [],
  loading: true,
  error: null,
};

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  // Allow 204 / empty responses to coerce to sensible defaults
  if (res.status === 204) return {} as T;
  return (await res.json()) as T;
}

export const useEnhancedAnalytics = (
  userId: string,
): EnhancedAnalyticsData & { refreshAnalytics: () => Promise<void> } => {
  const [data, setData] = useState<EnhancedAnalyticsData>(DEFAULT_STATE);
  const requestIdRef = useRef(0); // guards against race conditions
  const inflightRef = useRef<AbortController | null>(null);

  const fetchAnalytics = useCallback(
    async (signal?: AbortSignal) => {
      if (!userId) {
        // No user yet — reset to defaults
        setData((prev) => ({ ...DEFAULT_STATE, loading: false }));
        return;
      }

      const myReqId = ++requestIdRef.current;
      setData((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const [habits, progress, dailyReps] = await Promise.all([
          fetchJson<HabitRow[]>(`/api/habits?user_id=${encodeURIComponent(userId)}`, signal),
          fetchJson<Record<string, HabitProgress>>(
            `/api/habit-progress?user_id=${encodeURIComponent(userId)}`,
            signal,
          ),
          fetchJson<DailyReps>(`/api/daily-reps?user_id=${encodeURIComponent(userId)}`, signal),
        ]);

        // If a newer request started, ignore this result
        if (myReqId !== requestIdRef.current) return;

        const analytics = calculateEnhancedAnalytics(habits ?? [], progress ?? {}, dailyReps ?? {});
        const insights = generateInsights(analytics);

        setData({
          habits: habits ?? [],
          progress: progress ?? {},
          dailyReps: dailyReps ?? {},
          analytics,
          insights,
          loading: false,
          error: null,
        });
      } catch (err) {
        // Ignore abort errors
        if ((err as { name?: string })?.name === "AbortError") return;

        if (myReqId !== requestIdRef.current) return;
        setData((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error occurred",
        }));
      }
    },
    [userId],
  );

  useEffect(() => {
    // cancel any in-flight request when userId changes or on unmount
    inflightRef.current?.abort();
    const controller = new AbortController();
    inflightRef.current = controller;

    void fetchAnalytics(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchAnalytics]);

  const refreshAnalytics = useCallback(async () => {
    // cancel previous and start fresh
    inflightRef.current?.abort();
    const controller = new AbortController();
    inflightRef.current = controller;
    await fetchAnalytics(controller.signal);
  }, [fetchAnalytics]);

  return { ...data, refreshAnalytics };
};
