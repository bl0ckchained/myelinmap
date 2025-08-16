// components/HabitAnalytics.tsx
import React from "react";
import { HabitRow } from "@/types/habit";

interface HabitAnalyticsProps {
  habits: HabitRow[];
  habitRepCount: number;
  streak: number;
  dailyCounts: number[]; // expected length: 7 (Mon..Sun), but we guard anyway
}

export default function HabitAnalytics({
  habits,
  habitRepCount,
  streak,
  dailyCounts,
}: HabitAnalyticsProps) {
  // Use first habit as "active" for now; safe if list empty
  const activeHabit = habits?.[0];

  // Prevent division by zero and cap at 100
  const goal = activeHabit?.goal_reps ?? 0;
  const completionRate =
    goal > 0 ? Math.min(100, Math.round((habitRepCount / goal) * 100)) : 0;

  // Simple strength heuristic (cap 100)
  const habitStrength = Math.min(100, streak * 5 + completionRate);

  // Label exactly as many days as we have data for
  const baseWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const labels =
    dailyCounts.length === 7 ? baseWeek : baseWeek.slice(0, dailyCounts.length);

  if (!activeHabit) {
    return (
      <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
        <h2>Habit Analytics</h2>
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <p style={{ margin: 0, color: "#374151" }}>
            No habits yet. Create a habit and log a few reps to unlock analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h2>Habit Analytics</h2>

      {/* Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        {/* Completion Rate Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: 20,
            borderRadius: 12,
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>Completion Rate</h3>
          <div style={{ fontSize: "2em", fontWeight: "bold" }}>
            {completionRate}%
          </div>
          <div style={{ fontSize: "0.9em", opacity: 0.8 }}>
            {habitRepCount} / {goal} reps
          </div>
        </div>

        {/* Habit Strength Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            color: "white",
            padding: 20,
            borderRadius: 12,
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>Habit Strength</h3>
          <div style={{ fontSize: "2em", fontWeight: "bold" }}>
            {habitStrength}%
          </div>
          <div style={{ fontSize: "0.9em", opacity: 0.8 }}>
            Based on streak &amp; consistency
          </div>
        </div>

        {/* Streak Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            color: "white",
            padding: 20,
            borderRadius: 12,
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>Current Streak</h3>
          <div style={{ fontSize: "2em", fontWeight: "bold" }}>{streak}</div>
          <div style={{ fontSize: "0.9em", opacity: 0.8 }}>
            {streak === 1 ? "day" : "days"} in a row
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <h3 style={{ margin: "0 0 15px 0" }}>Weekly Progress</h3>
        <div
          style={{ display: "flex", alignItems: "end", height: 100, gap: 10 }}
          aria-label="Weekly progress bar chart"
        >
          {dailyCounts.map((count, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
              }}
            >
              <div
                style={{
                  width: "100%",
                  background: count > 0 ? "#10b981" : "#e5e7eb",
                  height: `${Math.max(10, count * 40)}px`,
                  borderRadius: "4px 4px 0 0",
                  minHeight: 10,
                  transition: "height 160ms ease",
                }}
                title={`${labels[index % labels.length]}: ${count} rep${
                  count === 1 ? "" : "s"
                }`}
              />
              <div
                style={{
                  fontSize: "0.8em",
                  marginTop: 5,
                  color: "#6b7280",
                }}
              >
                {labels[index % labels.length]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Timeline (placeholder milestones) */}
      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h3 style={{ margin: "0 0 15px 0" }}>Progress Timeline</h3>

        <div
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#10b981",
            }}
          />
          <span>Started habit</span>
        </div>

        <div
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#fbbf24",
            }}
          />
          <span>First week completed</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#ef4444",
            }}
          />
          <span>Current progress</span>
        </div>
      </div>
    </div>
  );
}
// End of components/HabitAnalytics.tsx