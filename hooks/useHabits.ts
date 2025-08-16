import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Habit } from '../types/habit';

export const useHabits = (userId: string) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHabits(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch habits');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchHabits();
    }
  }, [fetchHabits, userId]);

  const addHabit = useCallback(async (habit: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('habits')
      .insert([{ ...habit, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setHabits(prev => [data, ...prev]);
    }
    return data;
  }, [userId]);

  const updateHabit = useCallback(async (id: string, updates: Partial<Habit>) => {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setHabits(prev => prev.map(h => h.id === id ? data : h));
    }
    return data;
  }, []);

  const deleteHabit = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const habitsMemo = useMemo(() => habits, [habits]);

  return {
    habits: habitsMemo,
    loading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    refetch: fetchHabits
  };
};
