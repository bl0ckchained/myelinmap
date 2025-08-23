// components/analytics/HabitAnalyticsDashboard.tsx
import React, { useState, useCallback, useId } from "react";
import { useEnhancedAnalytics } from "../../hooks/useEnhancedAnalytics";
import { NeuralPathwayViz } from "./NeuralPathwayViz";
import { HabitCorrelationMatrix } from "./HabitCorrelationMatrix";
import styles from "../../styles/Dashboard.module.css";

interface HabitAnalyticsDashboardProps {
  userId: string;
}

type Tab = "overview" | "neural" | "correlation";

export const HabitAnalyticsDashboard: React.FC<HabitAnalyticsDashboardProps> = ({
  userId,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedHabit, setSelectedHabit] = useState<string | undefined>();

  const {
    habits,
    progress,
    dailyReps,
    analytics,
    loading,
    error,
    refreshAnalytics,
  } = useEnhancedAnalytics(userId);

  const handleRefresh = useCallback(() => {
    void refreshAnalytics?.();
  }, [refreshAnalytics]);

  // ARIA IDs for tabs
  const tabsId = useId();
  const tabIds: Record<Tab, string> = {
    overview: `${tabsId}-tab-overview`,
    neural: `${tabsId}-tab-neural`,
    correlation: `${tabsId}-tab-correlation`,
  };
  const panelIds: Record<Tab, string> = {
    overview: `${tabsId}-panel-overview`,
    neural: `${tabsId}-panel-neural`,
    correlation: `${tabsId}-panel-correlation`,
  };

  if (loading) {
    return (
      <div className={styles.analyticsDashboard}>
        <div className={styles.loading}>Loading enhanced analytics…</div>
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
          className={styles.tabNavigation}
          role="tablist"
          aria-label="Analytics views"
        >
          <button
            id={tabIds.overview}
            role="tab"
            aria-selected={activeTab === "overview"}
            aria-controls={panelIds.overview}
            className={activeTab === "overview" ? styles.activeTab : ""}
            onClick={() => setActiveTab("overview")}
            type="button"
          >
            Overview
          </button>
          <button
            id={tabIds.neural}
            role="tab"
            aria-selected={activeTab === "neural"}
            aria-controls={panelIds.neural}
            className={activeTab === "neural" ? styles.activeTab : ""}
            onClick={() => setActiveTab("neural")}
            type="button"
          >
            Neural Pathways
          </button>
          <button
            id={tabIds.correlation}
            role="tab"
            aria-selected={activeTab === "correlation"}
            aria-controls={panelIds.correlation}
            className={activeTab === "correlation" ? styles.activeTab : ""}
            onClick={() => setActiveTab("correlation")}
            type="button"
          >
            Correlations
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading}
            type="button"
            aria-busy={loading ? true : undefined}
            title="Refresh analytics"
            className={styles.refreshButton}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      <div className={styles.dashboardContent}>
        {/* Overview */}
        <section
          id={panelIds.overview}
          role="tabpanel"
          aria-labelledby={tabIds.overview}
          hidden={activeTab !== "overview"}
          className={styles.overviewSection}
        >
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
                {analytics.longestStreak != null
                  ? `${analytics.longestStreak} day${
                      analytics.longestStreak === 1 ? "" : "s"
                    }`
                  : "—"}
              </p>
            </div>
            <div className={styles.metricCard}>
              <h3>Myelin Score</h3>
              <p className={styles.metricValue}>
                {analytics.myelinScore != null
                  ? analytics.myelinScore.toFixed(1)
                  : "—"}
              </p>
            </div>
          </div>

          <div className={styles.habitList}>
            <h3>Habit Performance</h3>

            {habits.length === 0 && (
              <div className={styles.emptyState}>
                No habits yet. Create one to start seeing insights.
              </div>
            )}

            {habits.map((habit) => {
              const habitProgress = progress[habit.id];
              const selected = selectedHabit === habit.id;

              return (
                <div
                  key={habit.id}
                  className={`${styles.habitItem} ${
                    selected ? styles.selected : ""
                  }`}
                  onClick={() =>
                    setSelectedHabit(selected ? undefined : habit.id)
                  }
                  role="button"
                  aria-pressed={selected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedHabit(selected ? undefined : habit.id);
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
        </section>

        {/* Neural */}
        <section
          id={panelIds.neural}
          role="tabpanel"
          aria-labelledby={tabIds.neural}
          hidden={activeTab !== "neural"}
        >
          <NeuralPathwayViz
            habits={habits}
            progressData={progress}
            selectedHabit={selectedHabit}
          />
        </section>

        {/* Correlations */}
        <section
          id={panelIds.correlation}
          role="tabpanel"
          aria-labelledby={tabIds.correlation}
          hidden={activeTab !== "correlation"}
        >
          <HabitCorrelationMatrix
            habits={habits}
            progressData={progress}
            dailyReps={dailyReps}
          />
        </section>
      </div>
    </div>
  );
};

