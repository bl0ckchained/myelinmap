import React from "react";
import type { HabitRow } from "../../types/habit";
import type { HabitPrediction, BehavioralInsight } from "../../lib/habitPredictions";
import styles from "../../styles/Dashboard.module.css";

interface HabitPredictionCardProps {
  habit: HabitRow;
  prediction: HabitPrediction;
  behavioralInsight: BehavioralInsight;
  onClick?: () => void;
}

const stageIcon = (stage: BehavioralInsight["formationStage"]) => {
  switch (stage) {
    case "automatic":
      return "🧠";
    case "reward":
      return "⭐";
    case "routine":
      return "⚡";
    case "cue":
      return "🔔";
    default:
      return "🎯";
  }
};

const probabilityColor = (p: number) => {
  if (p >= 80) return "#10b981"; // green
  if (p >= 60) return "#f59e0b"; // amber
  return "#ef4444"; // red
};

export const HabitPredictionCard: React.FC<HabitPredictionCardProps> = ({
  habit,
  prediction,
  behavioralInsight,
  onClick,
}) => {
  const clickable = Boolean(onClick);

  return (
    <div
      className={styles.predictionCard}
      onClick={onClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : -1}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      style={{ cursor: clickable ? "pointer" : "default" }}
      aria-label={clickable ? `Open details for ${habit.name}` : undefined}
    >
      <div className={styles.predictionHeader}>
        <h3>{habit.name}</h3>
        <div
          className={styles.probabilityBadge}
          style={{ backgroundColor: probabilityColor(prediction.completionProbability) }}
          title="Predicted completion probability"
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
            {stageIcon(behavioralInsight.formationStage)} {behavioralInsight.formationStage}
          </span>
        </div>

        <div className={styles.predictionRow}>
          <span className={styles.label}>Automaticity:</span>
          <div
            className={styles.progressBar}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(behavioralInsight.automaticityScore)}
            aria-label="Automaticity score"
          >
            <div
              className={styles.progressFill}
              style={{ width: `${Math.max(0, Math.min(100, behavioralInsight.automaticityScore))}%` }}
            />
          </div>
          <span className={styles.value}>
            {behavioralInsight.automaticityScore.toFixed(0)}%
          </span>
        </div>

        {prediction.riskFactors.length > 0 && (
          <div className={styles.riskFactors}>
            <span className={styles.label}>⚠️ Risk Factors:</span>
            <ul>
              {prediction.riskFactors.slice(0, 2).map((risk, i) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </div>
        )}

        {prediction.suggestedModifications.length > 0 && (
          <div className={styles.suggestions}>
            <span className={styles.label}>💡 Suggestions:</span>
            <ul>
              {prediction.suggestedModifications.slice(0, 2).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
