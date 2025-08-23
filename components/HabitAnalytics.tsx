// components/HabitAnalytics.tsx
import React from "react";
import { HabitRow } from "@/types/habit";

interface HabitAnalyticsProps {
  habits: HabitRow[];
  habitRepCount: number;
  streak: number;
  dailyCounts: number[]; // ideally length 7 (Mon..Sun)
}

export default function HabitAnalytics({
  habits,
  habitRepCount,
  streak,
  dailyCounts,
}: HabitAnalyticsProps) {
  const activeHabit = habits?.[0];

  const goal = activeHabit?.goal_reps ?? 0;
  const completionRate =
    goal > 0 ? Math.min(100, Math.round((habitRepCount / goal) * 100)) : 0;

  const habitStrength = Math.min(100, streak * 5 + completionRate);

  const baseWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const labels =
    dailyCounts.length === 7 ? baseWeek : baseWeek.slice(0, dailyCounts.length);

  const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.01)), var(--bg-1)",
        border: "var(--card-border)",
        borderRadius: "var(--radius-lg)",
        padding: 20,
        boxShadow: "var(--shadow-soft)",
      }}
      role="group"
      aria-label={title}
    >
      <h3 style={{ margin: "0 0 12px 0", color: "var(--ink-0)" }}>{title}</h3>
      {children}
    </div>
  );

  if (!activeHabit) {
    return (
      <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ color: "var(--ink-0)" }}>Habit Analytics</h2>
        <Card title="No habits yet">
          <p style={{ margin: 0, color: "var(--ink-1)" }}>
            Create a habit and log a few reps to unlock analytics.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ color: "var(--ink-0)" }}>Habit Analytics</h2>

      {/* Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        {/* Completion Rate */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(0,255,170,.28) 0%, rgba(139,211,255,.18) 100%)",
            color: "var(--ink-0)",
            padding: 20,
            borderRadius: 12,
            textAlign: "center",
            border: "1px solid rgba(255,255,255,.08)",
          }}
          role="group"
          aria-label="Completion rate"
        >
          <h3 style={{ margin: "0 0 10px 0" }}>Completion Rate</h3>
          <div style={{ fontSize: "2em", fontWeight: 800 }}>{completionRate}%</div>
          <div style={{ fontSize: ".9em", opacity: 0.85 }}>
            {habitRepCount} / {goal} reps
          </div>
        </div>

        {/* Habit Strength */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(217,167,255,.28) 0%, rgba(255,107,107,.20) 100%)",
            color: "var(--ink-0)",
            padding: 20,
            borderRadius: 12,
            textAlign: "center",
            border: "1px solid rgba(255,255,255,.08)",
          }}
          role="group"
          aria-label="Habit strength"
        >
          <h3 style={{ margin: "0 0 10px 0" }}>Habit Strength</h3>
          <div style={{ fontSize: "2em", fontWeight: 800 }}>{habitStrength}%</div>
          <div style={{ fontSize: ".9em", opacity: 0.85 }}>
            Based on streak &amp; consistency
          </div>
        </div>

        {/* Streak */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(139,211,255,.24) 0%, rgba(0,242,254,.18) 100%)",
            color: "var(--ink-0)",
            padding: 20,
            borderRadius: 12,
            textAlign: "center",
            border: "1px solid rgba(255,255,255,.08)",
          }}
          role="group"
          aria-label="Current streak"
        >
          <h3 style={{ margin: "0 0 10px 0" }}>Current Streak</h3>
          <div style={{ fontSize: "2em", fontWeight: 800 }}>{streak}</div>
          <div style={{ fontSize: ".9em", opacity: 0.85 }}>
            {streak === 1 ? "day" : "days"} in a row
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <Card title="Weekly Progress">
        <div
          style={{ display: "flex", alignItems: "end", height: 110, gap: 10 }}
          aria-label="Weekly progress bar chart"
          role="img"
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
                  background:
                    count > 0
                      ? "linear-gradient(180deg, rgba(0,255,170,.7), rgba(0,255,170,.45))"
                      : "rgba(255,255,255,.12)",
                  height: `${Math.max(10, count * 40)}px`,
                  borderRadius: "6px 6px 0 0",
                  minHeight: 10,
                  transition: "height 160ms ease",
                }}
                title={`${labels[index % labels.length]}: ${count} rep${
                  count === 1 ? "" : "s"
                }`}
              />
              <div style={{ fontSize: ".8em", marginTop: 6, color: "var(--ink-2)" }}>
                {labels[index % labels.length]}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Progress Timeline (placeholder milestones) */}
      <Card title="Progress Timeline">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div
            style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--ok)" }}
            aria-hidden
          />
          <span style={{ color: "var(--ink-1)" }}>Started habit</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div
            style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--warn)" }}
            aria-hidden
          />
          <span style={{ color: "var(--ink-1)" }}>First week completed</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--danger)" }}
            aria-hidden
          />
          <span style={{ color: "var(--ink-1)" }}>Current progress</span>
        </div>
      </Card>
    </div>
  );
}
