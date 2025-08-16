import React from 'react';
import { HabitRow } from '../../types/habit';
import { HabitPrediction, BehavioralInsight } from '../../lib/habitPredictions';
import styles from '../../styles/Dashboard.module.css';

interface HabitPredictionDetailModalProps {
  habit: HabitRow;
  prediction: HabitPrediction;
  behavioralInsight: BehavioralInsight;
  onClose: () => void;
}

export const HabitPredictionDetailModal: React.FC<HabitPredictionDetailModalProps> = ({
  habit,
  prediction,
  behavioralInsight,
  onClose
}) => {
  const getStageDescription = (stage: string) => {
    switch (stage) {
      case 'automatic':
        return 'Your habit has become automatic - you perform it without conscious thought';
      case 'reward':
        return 'You\'re in the reward phase - the habit is becoming intrinsically rewarding';
      case 'routine':
        return 'You\'re building the routine - consistent execution is key';
      case 'cue':
        return 'You\'re establishing the cue-response relationship';
      default:
        return 'Early stages of habit formation';
    }
  };

  const getRiskLevel = (probability: number) => {
    if (probability >= 80) return { level: 'Low', color: '#10b981' };
    if (probability >= 60) return { level: 'Medium', color: '#f59e0b' };
    return { level: 'High', color: '#ef4444' };
  };

  const riskLevel = getRiskLevel(prediction.completionProbability);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{habit.name} - Detailed Prediction</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.predictionSummary}>
            <div className={styles.summaryCard}>
              <h3>Success Probability</h3>
              <div 
                className={styles.probabilityCircle}
                style={{ borderColor: riskLevel.color }}
              >
                <span className={styles.probabilityText}>
                  {prediction.completionProbability.toFixed(0)}%
                </span>
              </div>
              <p className={styles.riskLevel} style={{ color: riskLevel.color }}>
                {riskLevel.level} Risk
              </p>
            </div>

            <div className={styles.summaryCard}>
              <h3>Formation Stage</h3>
              <div className={styles.stageInfo}>
                <span className={styles.stageIcon}>
                  {behavioralInsight.formationStage === 'automatic' ? '🧠' :
                   behavioralInsight.formationStage === 'reward' ? '⭐' :
                   behavioralInsight.formationStage === 'routine' ? '⚡' :
                   behavioralInsight.formationStage === 'cue' ? '🔔' : '🎯'}
                </span>
                <p>{getStageDescription(behavioralInsight.formationStage)}</p>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <h3>Automaticity Score</h3>
              <div className={styles.automaticityGauge}>
                <div 
                  className={styles.gaugeFill}
                  style={{ width: `${behavioralInsight.automaticityScore}%` }}
                />
              </div>
              <p>{behavioralInsight.automaticityScore.toFixed(0)}% automatic</p>
            </div>
          </div>

          <div className={styles.detailedInsights}>
            <h3>Detailed Insights</h3>
            
            <div className={styles.insightSection}>
              <h4>🎯 Predicted Outcomes</h4>
              <ul>
                <li>Predicted streak: {prediction.predictedStreak} days</li>
                <li>Expected completion rate: {prediction.completionProbability.toFixed(0)}%</li>
                <li>Time to automaticity: {Math.max(0, 66 - prediction.predictedStreak)} days remaining</li>
              </ul>
            </div>

            <div className={styles.insightSection}>
              <h4>⚠️ Risk Factors</h4>
              {prediction.riskFactors.length > 0 ? (
                <ul>
                  {prediction.riskFactors.map((risk, index) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
              ) : (
                <p>No significant risk factors identified.</p>
              )}
            </div>

            <div className={styles.insightSection}>
              <h4>💡 Optimization Suggestions</h4>
              {prediction.suggestedModifications.length > 0 ? (
                <ul>
                  {prediction.suggestedModifications.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              ) : (
                <p>Your habit is well-optimized. Keep up the great work!</p>
              )}
            </div>

            <div className={styles.insightSection}>
              <h4>🧠 Behavioral Psychology</h4>
              <p><strong>Trigger Effectiveness:</strong> {behavioralInsight.triggerEffectiveness.toFixed(0)}%</p>
              <p><strong>Reward Impact:</strong> {behavioralInsight.rewardImpact.toFixed(0)}%</p>
              <p><strong>Automaticity Score:</strong> {behavioralInsight.automaticityScore.toFixed(0)}%</p>
              <p><strong>Formation Stage:</strong> {behavioralInsight.formationStage}</p>
              <p><strong>Psychological Barriers:</strong> {behavioralInsight.psychologicalBarriers.join(', ') || 'None identified'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
