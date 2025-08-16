import React, { useState } from 'react';
import { HabitRow } from '../../types/habit';
import { useHabitPredictions } from '../../hooks/useHabitPredictions';
import { HabitPredictionCard } from './HabitPredictionCard';
import { HabitPredictionDetailModal } from './HabitPredictionDetailModal';
import styles from '../../styles/Dashboard.module.css';

interface HabitPredictionsDashboardProps {
  userId: string;
}

export const HabitPredictionsDashboard: React.FC<HabitPredictionsDashboardProps> = ({
  userId
}) => {
  const { predictions, behavioralInsights, correlations, loading, error, refreshPredictions } = useHabitPredictions(userId);
  const [selectedHabit, setSelectedHabit] = useState<HabitRow | null>(null);
  const [filter, setFilter] = useState<'all' | 'high-risk' | 'high-potential'>('all');

  if (loading) {
    return (
      <div className={styles.predictionsDashboard}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Loading habit predictions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.predictionsDashboard}>
        <div className={styles.errorMessage}>
          <p>Error loading predictions: {error}</p>
          <button onClick={refreshPredictions} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredPredictions = Object.entries(predictions)
    .filter(([habitId, prediction]) => {
      if (filter === 'high-risk') return prediction.completionProbability < 60;
      if (filter === 'high-potential') return prediction.completionProbability >= 80;
      return true;
    })
    .sort(([, a], [, b]) => b.completionProbability - a.completionProbability);

  return (
    <div className={styles.predictionsDashboard}>
      <div className={styles.predictionsHeader}>
        <h2>🔮 Habit Predictions</h2>
        <p>AI-powered insights into your habit formation journey</p>
      </div>

      <div className={styles.filterControls}>
        <button 
          className={filter === 'all' ? styles.activeFilter : ''}
          onClick={() => setFilter('all')}
        >
          All Habits
        </button>
        <button 
          className={filter === 'high-risk' ? styles.activeFilter : ''}
          onClick={() => setFilter('high-risk')}
        >
          ⚠️ High Risk
        </button>
        <button 
          className={filter === 'high-potential' ? styles.activeFilter : ''}
          onClick={() => setFilter('high-potential')}
        >
          ⭐ High Potential
        </button>
      </div>

      <div className={styles.predictionsGrid}>
        {filteredPredictions.map(([habitId, prediction]) => {
          const habit = selectedHabit; // This would need to be fetched properly
          const insight = behavioralInsights[habitId];
          
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
        })}
      </div>

      {selectedHabit && (
        <HabitPredictionDetailModal
          habit={selectedHabit}
          prediction={predictions[selectedHabit.id]}
          behavioralInsight={behavioralInsights[selectedHabit.id]}
          onClose={() => setSelectedHabit(null)}
        />
      )}
    </div>
  );
};
