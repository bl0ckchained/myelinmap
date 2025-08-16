import React from 'react';
import { HabitRow } from '../../types/habit';
import { HabitPrediction, BehavioralInsight } from '../../lib/habitPredictions';
import styles from '../../styles/Dashboard.module.css';

interface HabitPredictionCardProps {
  habit: HabitRow;
  prediction: HabitPrediction;
  behavioralInsight: BehavioralInsight;
  onClick?: () => void;
}

export const HabitPredictionCard: React.FC<HabitPredictionCardProps> = ({
  habit,
  prediction,
  behavioralInsight,
  onClick
}) => {
  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return '#10b981';
    if (probability >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getFormationStageIcon = (stage: string) => {
    switch (stage) {
      case 'automatic': return '🧠';
      case 'reward': return '⭐';
      case 'routine': return '⚡';
      case 'cue': return '🔔';
      default: return '🎯';
    }
  };

  return (
    <div 
      className={styles.predictionCard} 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className={styles.predictionHeader}>
        <h3>{habit.name}</h3>
        <div 
          className={styles.probabilityBadge}
          style={{ backgroundColor: getProbabilityColor(prediction.completionProbability) }}
        >
          {prediction.completionProbability.toFixed(0)}%
        </div>
      </div>

      <div className={styles.predictionContent}>
        <div className={styles.predictionRow}>
          <span className={styles.label}>Predicted Streak:</span>
          <span className={styles.value}>{prediction.predictedStreak} days</span>
        </div>

        <div className={styles.predictionRow}>
          <span className={styles.label}>Formation Stage:</span>
          <span className={styles.value}>
            {getFormationStageIcon(behavioralInsight.formationStage)} {behavioralInsight.formationStage}
          </span>
        </div>

        <div className={styles.predictionRow}>
          <span className={styles.label}>Automaticity:</span>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${behavioralInsight.automaticityScore}%` }}
            />
          </div>
          <span className={styles.value}>{behavioralInsight.automaticityScore.toFixed(0)}%</span>
        </div>

        {prediction.riskFactors.length > 0 && (
          <div className={styles.riskFactors}>
            <span className={styles.label}>⚠️ Risk Factors:</span>
            <ul>
              {prediction.riskFactors.slice(0, 2).map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>
        )}

        {prediction.suggestedModifications.length > 0 && (
          <div className={styles.suggestions}>
            <span className={styles.label}>💡 Suggestions:</span>
            <ul>
              {prediction.suggestedModifications.slice(0, 2).map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
