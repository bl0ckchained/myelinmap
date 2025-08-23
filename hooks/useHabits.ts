// hooks/useHabits.ts
import { useState, useEffect, useCallback, useRef } from "react";
import type { HabitRow } from "../types/habit";

interface HabitsData {
  habits: HabitRow[];
  loading: boolean;
  error: string | null;
}

const DEFAULT_STATE: HabitsData = {
  habits: [],
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
  if (res.status === 204) return [] as unknown as T;
  return (await res.json()) as T;
}

export const useHabits = (
  userId: string
): HabitsData & { refreshHabits: () => Promise<void> } => {
  const [state, setState] = useState<HabitsData>(DEFAULT_STATE);

  // abort + race guards
  const inflightRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!userId) {
        setState({ habits: [], loading: false, error: "Missing userId" });
        return;
      }

      const myReqId = ++requestIdRef.current;
      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        const habits = await fetchJson<HabitRow[]>(
          `/api/habits?user_id=${encodeURIComponent(userId)}`,
          signal
        );

        if (myReqId !== requestIdRef.current) return; // stale response

        setState({
          habits: Array.isArray(habits) ? habits : [],
          loading: false,
          error: null,
        });
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") return;
        if (requestIdRef.current !== myReqId) return;
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load habits",
        }));
      }
    },
    [userId]
  );

  useEffect(() => {
    inflightRef.current?.abort();
    const controller = new AbortController();
    inflightRef.current = controller;

    void load(controller.signal);

    return () => controller.abort();
  }, [load]);

  const refreshHabits = useCallback(async () => {
    inflightRef.current?.abort();
    const controller = new AbortController();
    inflightRef.current = controller;
    await load(controller.signal);
  }, [load]);

  return { ...state, refreshHabits };
};
