import React, { useEffect, useRef, useId } from "react";
import type { HabitRow } from "../../types/habit";
import type { HabitPrediction, BehavioralInsight } from "../../lib/habitPredictions";
import styles from "../../styles/Dashboard.module.css";

interface HabitPredictionDetailModalProps {
  habit: HabitRow;
  prediction: HabitPrediction;
  behavioralInsight: BehavioralInsight;
  onClose: () => void;
}

const stageDescription = (stage: BehavioralInsight["formationStage"]) => {
  switch (stage) {
    case "automatic":
      return "Your habit has become automatic — you perform it without conscious thought.";
    case "reward":
      return "You're in the reward phase — the habit is becoming intrinsically rewarding.";
    case "routine":
      return "You're building the routine — consistent execution is key.";
    case "cue":
      return "You're establishing the cue → response relationship.";
    default:
      return "Early stages of habit formation.";
  }
};

const riskLevelFor = (prob: number) => {
  if (prob >= 80) return { level: "Low", color: "#10b981" };   // green
  if (prob >= 60) return { level: "Medium", color: "#f59e0b" }; // amber
  return { level: "High", color: "#ef4444" };                   // red
};

export const HabitPredictionDetailModal: React.FC<HabitPredictionDetailModalProps> = ({
  habit,
  prediction,
  behavioralInsight,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const risk = riskLevelFor(prediction.completionProbability);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Focus dialog on mount (simple focus trap)
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  // Derived helper
  const timeToAutomaticityDays = Math.max(0, 66 - prediction.predictedStreak);

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className={styles.modalCard}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          // Enter/Space on close button area is handled by the button itself
          if (e.key === "Escape") onClose();
        }}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 id={titleId} className={styles.modalTitle}>
            {habit.name} — Detailed Prediction
          </h2>
          <button
            type="button"
            className={styles.modalClose}
            aria-label="Close"
            onClick={onClose}
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* Summary strip */}
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {/* Success Probability */}
            <div className="card" style={{ textAlign: "center" }}>
              <h3 style={{ marginBottom: 8 }}>Success Probability</h3>
              <div
                style={{
                  width: 120,
                  height: 120,
                  margin: "8px auto",
                  borderRadius: "50%",
                  border: `5px solid ${risk.color}`,
                  display: "grid",
                  placeItems: "center",
                }}
                aria-label="Predicted completion probability"
              >
                <span style={{ fontSize: 28, fontWeight: 800 }}>
                  {prediction.completionProbability.toFixed(0)}%
                </span>
              </div>
              <p style={{ color: risk.color, fontWeight: 700 }}>{risk.level} Risk</p>
            </div>

            {/* Formation Stage */}
            <div className="card">
              <h3 style={{ marginBottom: 8 }}>Formation Stage</h3>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 28 }}>
                  {behavioralInsight.formationStage === "automatic"
                    ? "🧠"
                    : behavioralInsight.formationStage === "reward"
                    ? "⭐"
                    : behavioralInsight.formationStage === "routine"
                    ? "⚡"
                    : behavioralInsight.formationStage === "cue"
                    ? "🔔"
                    : "🎯"}
                </span>
                <p style={{ margin: 0 }}>
                  {stageDescription(behavioralInsight.formationStage)}
                </p>
              </div>
            </div>

            {/* Automaticity */}
            <div className="card">
              <h3 style={{ marginBottom: 8 }}>Automaticity</h3>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(behavioralInsight.automaticityScore)}
                aria-label="Automaticity score"
                style={{
                  width: "100%",
                  height: 12,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, behavioralInsight.automaticityScore),
                    )}%`,
                    height: "100%",
                    background:
                      "linear-gradient(90deg, rgba(16,185,129,0.9), rgba(52,211,153,0.8))",
                  }}
                />
              </div>
              <p style={{ marginTop: 8 }}>
                {behavioralInsight.automaticityScore.toFixed(0)}% automatic
              </p>
            </div>
          </div>

          {/* Detailed Insights */}
          <div className="card">
            <h3 style={{ marginBottom: 8 }}>Detailed Insights</h3>

            <div style={{ marginBottom: 12 }}>
              <h4 style={{ margin: "8px 0" }}>🎯 Predicted Outcomes</h4>
              <ul className="prose">
                <li>Predicted streak: {prediction.predictedStreak} days</li>
                <li>
                  Expected completion rate: {prediction.completionProbability.toFixed(0)}%
                </li>
                <li>Time to automaticity: {timeToAutomaticityDays} days remaining</li>
              </ul>
            </div>

            <div style={{ marginBottom: 12 }}>
              <h4 style={{ margin: "8px 0" }}>⚠️ Risk Factors</h4>
              {prediction.riskFactors.length > 0 ? (
                <ul className="prose">
                  {prediction.riskFactors.map((riskItem, i) => (
                    <li key={i}>{riskItem}</li>
                  ))}
                </ul>
              ) : (
                <p className="muted">No significant risk factors identified.</p>
              )}
            </div>

            <div style={{ marginBottom: 12 }}>
              <h4 style={{ margin: "8px 0" }}>💡 Optimization Suggestions</h4>
              {prediction.suggestedModifications.length > 0 ? (
                <ul className="prose">
                  {prediction.suggestedModifications.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className="muted">Your habit is well-optimized. Keep up the great work!</p>
              )}
            </div>

            <div>
              <h4 style={{ margin: "8px 0" }}>🧠 Behavioral Psychology</h4>
              <div className="grid" style={{ gap: 8 }}>
                <p>
                  <strong>Trigger Effectiveness:</strong>{" "}
                  {behavioralInsight.triggerEffectiveness.toFixed(0)}%
                </p>
                <p>
                  <strong>Reward Impact:</strong>{" "}
                  {behavioralInsight.rewardImpact.toFixed(0)}%
                </p>
                <p>
                  <strong>Automaticity Score:</strong>{" "}
                  {behavioralInsight.automaticityScore.toFixed(0)}%
                </p>
                <p>
                  <strong>Formation Stage:</strong> {behavioralInsight.formationStage}
                </p>
                <p>
                  <strong>Psychological Barriers:</strong>{" "}
                  {behavioralInsight.psychologicalBarriers.length > 0
                    ? behavioralInsight.psychologicalBarriers.join(", ")
                    : "None identified"}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* End Body */}
      </div>
    </div>
  );
};
