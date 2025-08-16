import React, { useMemo } from 'react';
import { HabitRow, HabitProgress } from '../../types/habit';
import styles from '../../styles/Dashboard.module.css';

interface HabitCorrelationMatrixProps {
  habits: HabitRow[];
  progressData: Record<string, HabitProgress>;
  dailyReps: {
    [habitId: string]: {
      date: string;
      reps: number;
    }[];
  };
}

export const HabitCorrelationMatrix: React.FC<HabitCorrelationMatrixProps> = ({
  habits,
  progressData,
  dailyReps
}) => {
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

  const calculateCorrelation = (
    habit1: HabitRow,
    habit2: HabitRow,
    dailyReps: { [habitId: string]: { date: string; reps: number }[] }
  ): number => {
    const reps1 = dailyReps[habit1.id] || [];
    const reps2 = dailyReps[habit2.id] || [];
    
    const commonDates = new Set(
      reps1.map(r => r.date).filter(date => 
        reps2.some(r => r.date === date)
      )
    );

    if (commonDates.size === 0) return 0;

    let matches = 0;
    commonDates.forEach(date => {
      const rep1 = reps1.find(r => r.date === date)?.reps || 0;
      const rep2 = reps2.find(r => r.date === date)?.reps || 0;
      
      if ((rep1 > 0 && rep2 > 0) || (rep1 === 0 && rep2 === 0)) {
        matches++;
      }
    });

    return matches / commonDates.size;
  };

  const getCorrelationColor = (value: number): string => {
    const intensity = Math.floor(Math.abs(value) * 255);
    if (value > 0) {
      return `rgb(${255 - intensity}, ${255}, ${255 - intensity})`;
    } else {
      return `rgb(${255}, ${255 - intensity}, ${255 - intensity})`;
    }
  };

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
        Shows how often habits are completed together. 
        Green indicates positive correlation, red indicates negative.
      </p>
      
      <div className={styles.matrixWrapper}>
        <table className={styles.correlationTable}>
          <thead>
            <tr>
              <th></th>
              {habits.map(habit => (
                <th key={habit.id} title={habit.name}>
                  {habit.name.substring(0, 3).toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, i) => (
              <tr key={habit.id}>
                <td title={habit.name}>
                  {habit.name.substring(0, 3).toUpperCase()}
                </td>
                {correlationMatrix[i]?.map((value, j) => (
                  <td 
                    key={`${i}-${j}`}
                    style={{ 
                      backgroundColor: getCorrelationColor(value),
                      color: Math.abs(value) > 0.5 ? '#fff' : '#333'
                    }}
                    title={`${habits[i].name} ↔ ${habits[j].name}: ${(value * 100).toFixed(0)}%`}
                  >
                    {(value * 100).toFixed(0)}%
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className={styles.matrixLegend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.positiveCorr}`}></div>
          <span>Often done together</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.negativeCorr}`}></div>
          <span>Rarely done together</span>
        </div>
      </div>
    </div>
  );
};
