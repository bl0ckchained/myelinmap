// components/analytics/HabitAnalyticsDashboard.tsx
import React, { useState, useCallback } from "react";
import { useEnhancedAnalytics } from "../../hooks/useEnhancedAnalytics";
import { NeuralPathwayViz } from "./NeuralPathwayViz";
import { HabitCorrelationMatrix } from "./HabitCorrelationMatrix";
import styles from "../../styles/Dashboard.module.css";

interface HabitAnalyticsDashboardProps {
  userId: string;
}

export const HabitAnalyticsDashboard: React.FC<HabitAnalyticsDashboardProps> = ({
  userId,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "neural" | "correlation">(
    "overview",
  );
  const [selectedHabit, setSelectedHabit] = useState<string | undefined>();

  const { habits, progress, dailyReps, analytics, loading, error, refreshAnalytics } =
    useEnhancedAnalytics(userId);

  const handleRefresh = useCallback(() => {
    // explicitly use the hook's refresh so ESLint is happy and you get a manual reload
    void refreshAnalytics?.();
  }, [refreshAnalytics]);

  if (loading) {
    return (
      <div className={styles.analyticsDashboard}>
        <div className={styles.loading}>Loading enhanced analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.analyticsDashboard}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.analyticsDashboard}>
      <div className={styles.dashboardHeader}>
        <h2>Enhanced Habit Analytics</h2>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div className={styles.tabNavigation}>
            <button
              className={activeTab === "overview" ? styles.activeTab : ""}
              onClick={() => setActiveTab("overview")}
              type="button"
            >
              Overview
            </button>
            <button
              className={activeTab === "neural" ? styles.activeTab : ""}
              onClick={() => setActiveTab("neural")}
              type="button"
            >
              Neural Pathways
            </button>
            <button
              className={activeTab === "correlation" ? styles.activeTab : ""}
              onClick={() => setActiveTab("correlation")}
              type="button"
            >
              Correlations
            </button>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            type="button"
            aria-busy={loading ? true : undefined}
            title="Refresh analytics"
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "#0b1220",
              color: "#e5e7eb",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      <div className={styles.dashboardContent}>
        {activeTab === "overview" && (
          <div className={styles.overviewSection}>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <h3>Total Habits</h3>
                <p className={styles.metricValue}>{habits.length}</p>
              </div>
              <div className={styles.metricCard}>
                <h3>Average Completion Rate</h3>
                <p className={styles.metricValue}>
                  {analytics.averageCompletionRate != null
                    ? `${analytics.averageCompletionRate.toFixed(1)}%`
                    : "—"}
                </p>
              </div>
              <div className={styles.metricCard}>
                <h3>Longest Streak</h3>
                <p className={styles.metricValue}>
                  {analytics.longestStreak != null ? `${analytics.longestStreak} days` : "—"}
                </p>
              </div>
              <div className={styles.metricCard}>
                <h3>Myelin Score</h3>
                <p className={styles.metricValue}>
                  {analytics.myelinScore != null ? analytics.myelinScore.toFixed(1) : "—"}
                </p>
              </div>
            </div>

            <div className={styles.habitList}>
              <h3>Habit Performance</h3>
              {habits.map((habit) => {
                const habitProgress = progress[habit.id];
                return (
                  <div
                    key={habit.id}
                    className={`${styles.habitItem} ${
                      selectedHabit === habit.id ? styles.selected : ""
                    }`}
                    onClick={() =>
                      setSelectedHabit(
                        selectedHabit === habit.id ? undefined : habit.id,
                      )
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedHabit(
                          selectedHabit === habit.id ? undefined : habit.id,
                        );
                      }
                    }}
                  >
                    <span>{habit.name}</span>
                    <div className={styles.habitStats}>
                      <span>
                        {habitProgress?.completion_rate != null
                          ? `${habitProgress.completion_rate.toFixed(1)}%`
                          : "—"}
                      </span>
                      <span>
                        {habitProgress?.current_streak != null
                          ? `${habitProgress.current_streak} day${
                              habitProgress.current_streak === 1 ? "" : "s"
                            } streak`
                          : "—"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "neural" && (
          <NeuralPathwayViz
            habits={habits}
            progressData={progress}
            selectedHabit={selectedHabit}
          />
        )}

        {activeTab === "correlation" && (
          <HabitCorrelationMatrix
            habits={habits}
            progressData={progress}
            dailyReps={dailyReps}
          />
        )}
      </div>
    </div>
  );
};
// End of components/analytics/HabitAnalyticsDashboard.tsx
