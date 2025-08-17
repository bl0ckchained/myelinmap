// hooks/useHabits.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import type { HabitRow } from "../types/habit";

type NewHabit = Pick<HabitRow, "name" | "goal_reps" | "wrap_size">;
type HabitUpdate = Partial<NewHabit>;

export const useHabits = (userId: string) => {
  const [habits, setHabits] = useState<HabitRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("habits")
        .select("id, user_id, name, goal_reps, wrap_size, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHabits((data as HabitRow[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch habits");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchHabits();
  }, [fetchHabits]);

  const addHabit = useCallback(
    async (habit: NewHabit) => {
      if (!userId) throw new Error("Missing userId");

      const { data, error } = await supabase
        .from("habits")
        .insert([{ ...habit, user_id: userId }])
        .select("id, user_id, name, goal_reps, wrap_size, created_at")
        .single();

      if (error) throw error;
      const row = data as HabitRow;
      setHabits((prev) => [row, ...prev]);
      return row;
    },
    [userId]
  );

  const updateHabit = useCallback(async (id: string, updates: HabitUpdate) => {
    const { data, error } = await supabase
      .from("habits")
      .update(updates)
      .eq("id", id)
      .select("id, user_id, name, goal_reps, wrap_size, created_at")
      .single();

    if (error) throw error;
    const row = data as HabitRow;
    setHabits((prev) => prev.map((h) => (h.id === id ? row : h)));
    return row;
  }, []);

  const deleteHabit = useCallback(async (id: string) => {
    const { error } = await supabase.from("habits").delete().eq("id", id);
    if (error) throw error;
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  return {
    habits: useMemo(() => habits, [habits]),
    loading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    refetch: fetchHabits,
  };
};
