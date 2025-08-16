// components/predictions/HabitPredictionsDashboard.tsx
import React, { useMemo, useState, useCallback } from "react";
import { HabitRow } from "../../types/habit";
import { useHabitPredictions } from "../../hooks/useHabitPredictions";
import { useHabits } from "../../hooks/useHabits";
import { HabitPredictionCard } from "./HabitPredictionCard";
import { HabitPredictionDetailModal } from "./HabitPredictionDetailModal";
import styles from "../../styles/Dashboard.module.css";

interface HabitPredictionsDashboardProps {
  userId: string;
}

type FilterKind = "all" | "high-risk" | "high-potential";

export const HabitPredictionsDashboard: React.FC<HabitPredictionsDashboardProps> = ({
  userId,
}) => {
  const {
    predictions,
    behavioralInsights,
    loading: predictionsLoading,
    error: predictionsError,
    refreshPredictions,
  } = useHabitPredictions(userId);

  const {
    habits,
    loading: habitsLoading,
    error: habitsError,
  } = useHabits(userId);

  const [selectedHabit, setSelectedHabit] = useState<HabitRow | null>(null);
  const [filter, setFilter] = useState<FilterKind>("all");

  const loading = predictionsLoading || habitsLoading;
  const error = predictionsError || habitsError;

  const handleRetry = useCallback(() => {
    void refreshPredictions?.();
  }, [refreshPredictions]);

  const filteredPredictions = useMemo(() => {
    const entries = Object.entries(predictions ?? {});
    const filtered = entries.filter(([, prediction]) => {
      if (filter === "high-risk") return prediction.completionProbability < 60;
      if (filter === "high-potential")
        return prediction.completionProbability >= 80;
      return true;
    });
    filtered.sort(([, a], [, b]) => b.completionProbability - a.completionProbability);
    return filtered;
  }, [predictions, filter]);

  if (loading) {
    return (
      <div className={styles.predictionsDashboard}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner} />
          <p>Loading habit predictions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const message =
      typeof error === "string"
        ? error
        : (error as { message?: string })?.message ?? "Unknown error";
    return (
      <div className={styles.predictionsDashboard}>
        <div className={styles.errorMessage}>
          <p>Error loading predictions: {message}</p>
          <button
            type="button"
            onClick={handleRetry}
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasAny =
    filteredPredictions.length > 0 && (habits?.length ?? 0) > 0;

  return (
    <div className={styles.predictionsDashboard}>
      <div className={styles.predictionsHeader}>
        <h2>🔮 Habit Predictions</h2>
        <p>AI-powered insights into your habit formation journey</p>
      </div>

      <div className={styles.filterControls}>
        <button
          type="button"
          className={filter === "all" ? styles.activeFilter : ""}
          aria-pressed={filter === "all"}
          onClick={() => setFilter("all")}
        >
          All Habits
        </button>
        <button
          type="button"
          className={filter === "high-risk" ? styles.activeFilter : ""}
          aria-pressed={filter === "high-risk"}
          onClick={() => setFilter("high-risk")}
        >
          ⚠️ High Risk
        </button>
        <button
          type="button"
          className={filter === "high-potential" ? styles.activeFilter : ""}
          aria-pressed={filter === "high-potential"}
          onClick={() => setFilter("high-potential")}
        >
          ⭐ High Potential
        </button>
      </div>

      <div className={styles.predictionsGrid}>
        {hasAny ? (
          filteredPredictions.map(([habitId, prediction]) => {
            const habit = habits?.find((h) => h.id === habitId);
            const insight = behavioralInsights?.[habitId];
            if (!habit || !insight) return null;

            return (
              <HabitPredictionCard
                key={habitId}
                habit={habit}
                prediction={prediction}
                behavioralInsight={insight}
                onClick={() => setSelectedHabit(habit)}
              />
            );
          })
        ) : (
          <div className={styles.emptyState}>
            <p>
              No predictions to show yet. Try adding a habit and logging a few
              reps, then{" "}
              <button
                type="button"
                onClick={handleRetry}
                className={styles.linkButton}
              >
                refresh predictions
              </button>
              .
            </p>
          </div>
        )}
      </div>

      {selectedHabit && (
        <HabitPredictionDetailModal
          habit={selectedHabit}
          prediction={predictions?.[selectedHabit.id]}
          behavioralInsight={behavioralInsights?.[selectedHabit.id]}
          onClose={() => setSelectedHabit(null)}
        />
      )}
    </div>
  );
};
// End of components/predictions/HabitPredictionsDashboard.tsx