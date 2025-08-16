// components/analytics/HabitCorrelationMatrix.tsx
import React, { useMemo } from "react";
import { HabitRow, HabitProgress } from "../../types/habit";
import styles from "../../styles/Dashboard.module.css";

interface HabitCorrelationMatrixProps {
  habits: HabitRow[];
  progressData: Record<string, HabitProgress>;
  dailyReps: {
    [habitId: string]: { date: string; reps: number }[];
  };
}

export const HabitCorrelationMatrix: React.FC<HabitCorrelationMatrixProps> = ({
  habits,
  progressData,
  dailyReps,
}) => {
  // Use progressData for UX context (and to avoid unused-var warning)
  const habitsWithProgress = useMemo(
    () => habits.filter((h) => progressData[h.id] != null),
    [habits, progressData]
  );

  const correlationMatrix = useMemo(() => {
    if (habits.length < 2) return [];

    const matrix: number[][] = [];

    for (let i = 0; i < habits.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < habits.length; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          matrix[i][j] = calculateCorrelation(habits[i], habits[j], dailyReps);
        }
      }
    }

    return matrix;
  }, [habits, dailyReps]);

  function calculateCorrelation(
    habit1: HabitRow,
    habit2: HabitRow,
    repsByHabit: { [habitId: string]: { date: string; reps: number }[] }
  ): number {
    const reps1 = repsByHabit[habit1.id] || [];
    const reps2 = repsByHabit[habit2.id] || [];

    if (reps1.length === 0 || reps2.length === 0) return 0;

    // Build quick lookup maps for O(1) access by date
    const map1 = new Map<string, number>(reps1.map((r) => [r.date, r.reps]));
    const map2 = new Map<string, number>(reps2.map((r) => [r.date, r.reps]));

    // Intersect dates
    const dates =
      reps1.length < reps2.length
        ? reps1.map((r) => r.date)
        : reps2.map((r) => r.date);

    let common = 0;
    let matches = 0;

    for (const d of dates) {
      const a = map1.get(d);
      const b = map2.get(d);
      if (a == null || b == null) continue;
      common++;
      // Simple co-occurrence score: both done (>0) or both skipped (===0)
      if ((a > 0 && b > 0) || (a === 0 && b === 0)) matches++;
    }

    if (common === 0) return 0;
    return matches / common;
  }

  function getCorrelationColor(value: number): string {
    // Green-ish for positive, Red-ish for negative (value ∈ [0..1] in our scoring)
    const intensity = Math.floor(Math.min(1, Math.max(0, Math.abs(value))) * 255);
    if (value >= 0) {
      // more green as it goes up
      return `rgb(${255 - intensity}, 255, ${255 - intensity})`;
    } else {
      // more red as it goes down (we don't really produce negatives here, but keep logic consistent)
      return `rgb(255, ${255 - intensity}, ${255 - intensity})`;
    }
  }

  if (habits.length < 2) {
    return (
      <div className={styles.correlationMatrixContainer}>
        <h3>Habit Correlation Matrix</h3>
        <p className={styles.insufficientData}>
          Add at least 2 habits to see correlations.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.correlationMatrixContainer}>
      <h3>Habit Correlation Matrix</h3>
      <p className={styles.matrixDescription}>
        Shows how often habits are completed together on the same day. Green indicates
        stronger co-occurrence.
      </p>
      <p className={styles.matrixMeta}>
        Based on {habitsWithProgress.length} tracked habit
        {habitsWithProgress.length === 1 ? "" : "s"} with progress data.
      </p>

      <div className={styles.matrixWrapper}>
        <table
          className={styles.correlationTable}
          aria-label="Habit correlation co-occurrence matrix"
        >
          <thead>
            <tr>
              <th scope="col" />
              {habits.map((habit) => (
                <th key={habit.id} scope="col" title={habit.name}>
                  {habit.name.substring(0, 3).toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, i) => (
              <tr key={habit.id}>
                <th scope="row" title={habit.name}>
                  {habit.name.substring(0, 3).toUpperCase()}
                </th>
                {correlationMatrix[i]?.map((value, j) => {
                  const bg = getCorrelationColor(value);
                  const highContrast = Math.abs(value) > 0.5;
                  return (
                    <td
                      key={`${i}-${j}`}
                      style={{
                        backgroundColor: bg,
                        color: highContrast ? "#fff" : "#333",
                        textAlign: "center",
                      }}
                      title={`${habits[i].name} ↔ ${habits[j].name}: ${(value * 100).toFixed(0)}%`}
                    >
                      {(value * 100).toFixed(0)}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.matrixLegend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.positiveCorr}`} />
          <span>Often done together</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.negativeCorr}`} />
          <span>Rarely done together</span>
        </div>
      </div>
    </div>
  );
};

