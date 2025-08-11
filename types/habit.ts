export interface HabitRow {
  id: string;
  user_id: string;
  name: string;
  goal_reps: number;
  wrap_size: number;
  created_at: string;
}

export interface HabitProgress {
  habit_id: string;
  total_reps: number;
  current_streak: number;
  longest_streak: number;
  completion_rate: number;
  last_rep_date: string | null;
}

export interface DailyActivity {
  date: string;
  rep_count: number;
  habit_id: string;
}

export interface HabitAnalytics {
  habit: HabitRow;
  progress: HabitProgress;
  weekly_activity: DailyActivity[];
  monthly_trend: {
    month: string;
    total_reps: number;
    average_daily: number;
  }[];
}
