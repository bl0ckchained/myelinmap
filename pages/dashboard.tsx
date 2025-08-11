// pages/dashboard.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { User, type PostgrestError } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import HabitLoop from "@/components/HabitLoop";
import NeuralField from "@/components/NeuralField";
import HabitAnalytics from "@/components/HabitAnalytics";

// OPTIONAL: if you already have a visualizer component, import it here:
// import Visualizer from "@/components/Visualizer";

/** Tabs for the dashboard UI */
type Tab = "overview" | "visualizer" | "coach" | "history";

/** Narrow row type for your existing totals table (user_reps) */
type UserRepsRow = {
  user_id: string;
  reps: number;
  last_rep: string | null;
};

/** Row type for the new 'habits' table */
type HabitRow = {
  id: string;
  user_id: string;
  name: string;
  goal_reps: number;
  wrap_size: number;
  created_at: string;
};

/** Typed realtime payload helper (no 'any') */
type UpdatePayload<T> = {
  eventType: "INSERT" | "UPDATE" | "DELETE" | "SELECT";
  new: T | null;
  old: T | null;
};

/* ===========================
   Tiny Modal Component
   =========================== */
function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#0f172a",
          color: "#e5e7eb",
          borderRadius: 12,
          border: "1px solid #233147",
          boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
          padding: "16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "transparent",
              border: "none",
              color: "#9ca3af",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function Dashboard() {
  /** --- Auth & core page state --- */
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<{
    reps: number;
    last_rep: string | null;
  }>({
    reps: 0,
    last_rep: null,
  });
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<Tab>("overview");

  /** --- Lightweight counts from your original implementation (kept) --- */
  const [dailyCounts, setDailyCounts] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [streak, setStreak] = useState<number>(0);
  const [nudge, setNudge] = useState<string>("");

  /** --- Habits state & progress for active habit --- */
  const [habits, setHabits] = useState<HabitRow[]>([]);
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);
  const [habitRepCount, setHabitRepCount] = useState<number>(0); // total reps for active habit

  /** --- HabitLoop / NeuralField animation triggers --- */
  const [loopPulse, setLoopPulse] = useState(0); // bump after each rep
  const [wrapBurst, setWrapBurst] = useState(false); // true briefly when a wrap completes

  /* ===========================
     Create/Edit modal state
     =========================== */
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  // create form
  const [newName, setNewName] = useState("Breath reset");
  const [newGoal, setNewGoal] = useState<number>(21);
  const [newWrap, setNewWrap] = useState<number>(7);
  // edit form
  const [editName, setEditName] = useState("");
  const [editGoal, setEditGoal] = useState<number>(21);
  const [editWrap, setEditWrap] = useState<number>(7);
  const clampInt = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, Math.floor(v)));

  /** ---------------------------
   *  Effects & Handlers
   * -------------------------- */

  /** Watch authentication state */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  /** Fetch user totals (user_reps) + subscribe to updates (kept, with better typing) */
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("user_reps")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // PGRST116 = No rows found with .single()
      if ((error as PostgrestError | null)?.code === "PGRST116") {
        const { data: initialData, error: insertError } = await supabase
          .from("user_reps")
          .insert({ user_id: user.id, reps: 0, last_rep: null })
          .select()
          .single();
        if (!insertError && initialData) setUserData(initialData as UserRepsRow);
      } else if (!error && data) {
        setUserData(data as UserRepsRow);
      }
    };

    fetchUserData();

    const subscription = supabase
      .channel(`user_reps:${user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "user_reps", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const p = payload as unknown as UpdatePayload<UserRepsRow>;
          if (p.eventType === "UPDATE" && p.new) {
            setUserData((prev) => ({ ...prev, ...p.new }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  /** KEPT: minimal streak + last-7-days based on last_rep (overwritten later by precise values) */
  useEffect(() => {
    if (!user) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const arr = Array(7).fill(0);

    if (userData.last_rep) {
      const lr = new Date(userData.last_rep);
      lr.setHours(0, 0, 0, 0);
      const diffDays = Math.round((today.getTime() - lr.getTime()) / 86400000);
      if (diffDays === 0) arr[6] = 1; // crude: mark today if last_rep is today
      setStreak(diffDays === 0 ? 1 : 0);
    } else {
      setStreak(0);
    }

    setDailyCounts(arr);
  }, [user, userData.last_rep]);

  /** Load user habits (or auto-create a default one) */
  useEffect(() => {
    if (!user) return;

    const loadHabits = async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("id, user_id, name, goal_reps, wrap_size, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Load habits error:", error);
        return;
      }

      if (!data || data.length === 0) {
        // create a gentle default so first-time users see something meaningful
        const { data: created, error: insErr } = await supabase
          .from("habits")
          .insert({
            user_id: user.id,
            name: "Breath reset",
            goal_reps: 21,
            wrap_size: 7,
          })
          .select()
          .single();

        if (!insErr && created) {
          const row = created as HabitRow;
          setHabits([row]);
          setActiveHabitId(row.id);
        }
      } else {
        const rows = data as HabitRow[];
        setHabits(rows);
        setActiveHabitId(rows[0].id);
      }
    };

    loadHabits();
  }, [user]);

  /**
   * Accurate: Compute streak (distinct days with rep_events),
   * last-7-days counts, and progress for the ACTIVE habit.
   */
  useEffect(() => {
    if (!user) return;

    const compute = async () => {
      // --- Streak + last 7 days from rep_events ---
      const since60 = new Date();
      since60.setDate(since60.getDate() - 60);

      const { data: events, error: evErr } = await supabase
        .from("rep_events")
        .select("ts")
        .eq("user_id", user.id)
        .gte("ts", since60.toISOString())
        .order("ts", { ascending: false });

      if (evErr) {
        console.error("rep_events streak error:", evErr);
      }

      const dayKeys = new Set(
        (events ?? []).map((e) => new Date(e.ts as string).toISOString().slice(0, 10))
      );

      // streak: walk backward from today while dates exist
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let s = 0;
      for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        if (dayKeys.has(key)) s++;
        else break;
      }
      setStreak(s);

      // last 7 days mini-series
      const arr7 = Array(7).fill(0);
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        const key = d.toISOString().slice(0, 10);
        arr7[i] = dayKeys.has(key) ? 1 : 0;
      }
      setDailyCounts(arr7);

      // --- Active habit progress ---
      if (!activeHabitId) return;

      const { count, error: cntErr } = await supabase
        .from("rep_events")
        .select("id", { count: "exact", head: true })
        .eq("habit_id", activeHabitId);

      if (cntErr) {
        console.error("rep_events count error:", cntErr);
        return;
      }

      const total = typeof count === "number" ? count : 0;
      setHabitRepCount(total);
      // (No extra local wrap/pct state to update here — UI computes from habitRepCount)
    };

    compute();
  }, [user, activeHabitId, habits, userData.last_rep]);

  /**
   * Log a rep:
   * - Inserts into rep_events (accurate history/streaks)
   * - Updates user_reps totals (kept)
   * - Triggers HabitLoop pulse + wrap celebration
   */
  const logRep = async () => {
    if (!user || !activeHabitId) return;
    setLoading(true);

    // 1) write event for analytics/streaks
    const { error: evErr } = await supabase
      .from("rep_events")
      .insert({ user_id: user.id, habit_id: activeHabitId });

    if (evErr) {
      console.error("Error inserting rep_event:", evErr);
      setLoading(false);
      return;
    }

    // trigger visual pulses & wrap celebration
    setLoopPulse((n) => n + 1);
    {
      const activeHabit = habits.find((h) => h.id === activeHabitId);
      if (activeHabit) {
        const size = Math.max(1, activeHabit.wrap_size);
        const nextTotal = habitRepCount + 1;
        if (nextTotal % size === 0) {
          setWrapBurst(true);
          setTimeout(() => setWrapBurst(false), 1000);
        }
      }
    }

    // 2) bump totals table (kept logic)
    const newRepCount = userData.reps + 1;
    const now = new Date();

    const { error: updErr } = await supabase
      .from("user_reps")
      .update({ reps: newRepCount, last_rep: now.toISOString() })
      .eq("user_id", user.id);

    setLoading(false);

    if (updErr) {
      console.error("Error updating user_reps:", updErr);
      return;
    }

    // gentle implementation-intention nudges
    const nudges = [
      "Nice. When will you do the next one? Pick a time.",
      "Stack it to a trigger you already do (coffee? doorway?).",
      "Small + consistent > perfect. One more tiny rep later today.",
      "Label the win: “I am someone who reps even when it’s hard.”",
    ];
    setNudge(nudges[Math.floor(Math.random() * nudges.length)]);

    // local UI refresh (no full reload)
    setUserData((prev) => ({
      ...prev,
      reps: newRepCount,
      last_rep: now.toISOString(),
    }));
    // optimistically bump progress for active habit
    setHabitRepCount((c) => c + 1);
  };

  /** Habit create/edit handlers */
  const handleCreateHabit = async () => {
    if (!user) return;
    const name = newName.trim().slice(0, 80);
    const goal = clampInt(newGoal, 1, 9999);
    const wrap = clampInt(newWrap, 1, 9999);
    if (!name) return;

    const { data, error } = await supabase
      .from("habits")
      .insert({ user_id: user.id, name, goal_reps: goal, wrap_size: wrap })
      .select()
      .single();

    if (error) {
      console.error("create habit error:", error);
      return;
    }

    const row = data as HabitRow;
    setHabits((prev) => [...prev, row]);
    setActiveHabitId(row.id);
    setCreateOpen(false);
    // reset counts for the new active habit
    setHabitRepCount(0);
  };

  const openEditForActive = () => {
    const h = habits.find((x) => x.id === activeHabitId);
    if (!h) return;
    setEditName(h.name);
    setEditGoal(h.goal_reps);
    setEditWrap(h.wrap_size);
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!activeHabitId) return;
    const name = editName.trim().slice(0, 80);
    const goal = clampInt(editGoal, 1, 9999);
    const wrap = clampInt(editWrap, 1, 9999);

    const { data, error } = await supabase
      .from("habits")
      .update({ name, goal_reps: goal, wrap_size: wrap })
      .eq("id", activeHabitId)
      .select()
      .single();

    if (error) {
      console.error("update habit error:", error);
      return;
    }

    const updated = data as HabitRow;
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
    setEditOpen(false);
    // no extra local wrap/pct state to maintain
  };

  /** Sign out (kept) */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserData({ reps: 0, last_rep: null });
  };

  return (
    <>
      <Head>
        <title>Dashboard | Myelin Map</title>
      </Head>

      <Header title="Your Dashboard 📈" subtitle="A visual record of your comeback" />

      <main style={{ minHeight: "70vh", padding: "2rem" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {user ? (
            <>
              {/* Tabs */}
              <nav
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { id: "overview", label: "Overview" },
                  { id: "visualizer", label: "Visualizer" },
                  { id: "coach", label: "Coach" },
                  { id: "history", label: "History" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActive(t.id as Tab)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      background: active === t.id ? "#111" : "#f8f8f8",
                      color: active === t.id ? "#fff" : "#333",
                      cursor: "pointer",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
                <div style={{ flex: 1 }} />
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Sign Out
                </button>
              </nav>

              {active === "overview" && (
                <>
                  <section
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                      marginBottom: 16,
                    }}
                  >
                    {/* Stats + Habit card */}
                    <div
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: 12,
                        padding: 16,
                      }}
                    >
                      <h2 style={{ marginTop: 0 }}>Welcome Back 🧠</h2>
                      <p style={{ margin: "8px 0 12px" }}>
                        Email: <strong>{user.email}</strong>
                      </p>

                      {/* Habit selector + actions */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          margin: "4px 0 14px",
                          flexWrap: "wrap",
                        }}
                      >
                        <label htmlFor="habit" style={{ color: "#6b7280" }}>
                          Active habit:
                        </label>
                        <select
                          id="habit"
                          value={activeHabitId ?? ""}
                          onChange={(e) => setActiveHabitId(e.target.value)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "1px solid #374151",
                            background: "#0f172a",
                            color: "#e5e7eb",
                          }}
                        >
                          {habits.map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.name} (goal {h.goal_reps})
                            </option>
                          ))}
                        </select>

                        {/* + New Habit */}
                        <button
                          onClick={() => setCreateOpen(true)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "1px solid #374151",
                            background: "#0b1220",
                            color: "#e5e7eb",
                            cursor: "pointer",
                          }}
                        >
                          + New Habit
                        </button>

                        {/* Edit current */}
                        <button
                          onClick={openEditForActive}
                          disabled={!activeHabitId}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "1px solid #374151",
                            background: "#0b1220",
                            color: "#e5e7eb",
                            cursor: !activeHabitId ? "not-allowed" : "pointer",
                            opacity: !activeHabitId ? 0.6 : 1,
                          }}
                        >
                          Edit
                        </button>
                      </div>

                      {/* The loop + neural field */}
                      <div style={{ marginTop: 16 }}>
                        {(() => {
                          const h = habits.find((x) => x.id === activeHabitId);
                          if (!h) return null;
                          return (
                            <HabitLoop
                              repCount={habitRepCount}
                              wrapSize={Math.max(1, h.wrap_size)}
                              trigger={loopPulse}
                              celebrate={wrapBurst}
                              title={`${h.name} — Habit Loop`}
                            />
                          );
                        })()}
                      </div>

                      <div style={{ marginTop: 16 }}>
                        {(() => {
                          const h = habits.find((x) => x.id === activeHabitId);
                          if (!h) return null;
                          return (
                            <NeuralField
                              repCount={habitRepCount}
                              wrapSize={Math.max(1, h.wrap_size)}
                              pulseKey={loopPulse}
                              height={260}
                            />
                          );
                        })()}
                      </div>

                      {/* Streak ring (gentle glow) */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginTop: 12,
                        }}
                      >
                        <svg width="72" height="72" viewBox="0 0 72 72">
                          <defs>
                            <filter id="glow">
                              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                              <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>
                          {/* background ring */}
                          <circle cx="36" cy="36" r="30" stroke="#1f2937" strokeWidth="8" fill="none" />
                          {/* progress ring (cap visualization at 30) */}
                          {(() => {
                            const cap = 30;
                            const pct = Math.min(1, streak / cap);
                            const circumference = 2 * Math.PI * 30;
                            const dash = pct * circumference;
                            return (
                              <circle
                                cx="36"
                                cy="36"
                                r="30"
                                stroke="#fbbf24"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${dash} ${circumference - dash}`}
                                strokeLinecap="round"
                                transform="rotate(-90 36 36)"
                                filter={streak > 0 ? "url(#glow)" : undefined}
                              />
                            );
                          })()}
                        </svg>
                        <div>
                          <div style={{ fontSize: 18, fontWeight: 700 }}>
                            {streak} day{streak === 1 ? "" : "s"} streak
                          </div>
                          <div style={{ color: "#6b7280" }}>
                            {streak > 0
                              ? "You came back. That’s braver than never missing."
                              : "Today can be day one. One tiny rep."}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Log a rep (powers rep_events + totals) */}
                    <div
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: 12,
                        padding: 16,
                        background: "#f7f7f7",
                      }}
                    >
                      <h2 style={{ marginTop: 0 }}>Log a Rep</h2>
                      <p style={{ marginTop: 0 }}>
                        This is how you wire new habits into your brain.
                      </p>
                      <button
                        onClick={logRep}
                        disabled={loading || !activeHabitId}
                        style={{
                          padding: "10px 20px",
                          cursor: loading ? "not-allowed" : "pointer",
                        }}
                      >
                        {loading ? "Logging..." : "Log Rep"}
                      </button>
                      {nudge && <p style={{ marginTop: 10, color: "#0f766e" }}>{nudge}</p>}
                      {!activeHabitId && (
                        <p style={{ marginTop: 8, color: "#9CA3AF" }}>
                          Creating your first habit… if this persists, refresh.
                        </p>
                      )}
                    </div>

                    {/* 7-day sparkline (full width) */}
                    <div
                      style={{
                        gridColumn: "1 / -1",
                        border: "1px solid #ccc",
                        borderRadius: 12,
                        padding: 16,
                      }}
                    >
                      <p style={{ marginTop: 0 }}>
                        <strong>Last 7 Days</strong>
                      </p>
                      <svg
                        width="100%"
                        height="48"
                        viewBox="0 0 140 48"
                        preserveAspectRatio="none"
                        style={{
                          background: "#fafafa",
                          borderRadius: 8,
                          border: "1px solid #eee",
                        }}
                      >
                        {(() => {
                          const max = Math.max(1, ...dailyCounts);
                          const stepX = 140 / 6;
                          const pts = dailyCounts
                            .map((v, i) => `${i * stepX},${46 - (v / max) * 42}`)
                            .join(" ");
                          return (
                            <>
                              <polyline points={pts} fill="none" stroke="#10b981" strokeWidth="2" />
                              {dailyCounts.map((v, i) => (
                                <circle
                                  key={i}
                                  cx={i * stepX}
                                  cy={46 - (v / Math.max(1, max)) * 42}
                                  r="2.5"
                                  fill="#10b981"
                                />
                              ))}
                            </>
                          );
                        })()}
                      </svg>
                      <small style={{ color: "#666" }}>
                        Counts reflect days with activity. One tiny rep is enough to light up a day.
                      </small>
                    </div>
                  </section>

                  {/* Habit Analytics Section */}
                  <section
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: 12,
                      padding: 16,
                      background: "#fff",
                      marginTop: 16,
                    }}
                  >
                    <HabitAnalytics
                      habits={habits}
                      habitRepCount={habitRepCount}
                      streak={streak}
                      dailyCounts={dailyCounts}
                    />
                  </section>
                </>
              )}

              {active === "visualizer" && (
                <section
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <h2 style={{ marginTop: 0 }}>Your Neural Visualizer 🧬</h2>
                  <p style={{ marginTop: 0, color: "#555" }}>
                    This view grows with your reps. (Dashboard-only visualizer — keep the fruit tree on Home.)
                  </p>
                  <div
                    style={{
                      height: 360,
                      border: "1px dashed #bbb",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* <Visualizer reps={userData.reps} lastRep={userData.last_rep} /> */}
                    <span style={{ color: "#777" }}>Visualizer placeholder — plug in your component</span>
                  </div>
                </section>
              )}

              {active === "coach" && (
                <section
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <h2 style={{ marginTop: 0 }}>Your Personal Coach 🧠</h2>
                  <p style={{ marginTop: 0, color: "#555" }}>
                    The public FloatingCoach stays on all pages. This private space can reflect your data and goals.
                  </p>
                  <div
                    style={{
                      border: "1px solid #eee",
                      borderRadius: 10,
                      padding: 12,
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      “Based on your last rep on{" "}
                      <strong>
                        {userData.last_rep ? new Date(userData.last_rep).toLocaleDateString() : "—"}
                      </strong>
                      , here’s a micro-win for today: <em>2-minute breath reset + 1 tiny rep after coffee.</em>”
                    </p>
                  </div>
                </section>
              )}

              {active === "history" && (
                <section
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <h2 style={{ marginTop: 0 }}>History & Insights</h2>
                  <p style={{ color: "#555" }}>
                    We’ll populate this with daily reps, weekly trends, and milestones once we add the events table.
                  </p>
                  <ul style={{ marginTop: 8 }}>
                    <li>Milestones (3, 7, 21, 42, 66 days)</li>
                    <li>Week-over-week improvements</li>
                    <li>Correlation with mood/craving (future)</li>
                  </ul>
                </section>
              )}
            </>
          ) : (
            <section
              style={{
                border: "1px solid #ccc",
                borderRadius: 12,
                padding: 24,
                textAlign: "center",
              }}
            >
              <h2>Sign In Required</h2>
              <p>
                Please <Link href="/signin">sign in here</Link> to access your dashboard.
              </p>
            </section>
          )}

          <p style={{ marginTop: 24, textAlign: "center", fontStyle: "italic" }}>
            “You are not broken. You are becoming.”
          </p>
        </div>
      </main>

      {/* Create & Edit Modals */}
      <Modal open={createOpen} title="Create a habit" onClose={() => setCreateOpen(false)}>
        <div style={{ display: "grid", gap: 10 }}>
          <label>
            <div style={{ color: "#9ca3af", marginBottom: 4 }}>Name</div>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Breath reset"
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #233147",
                background: "#0b1220",
                color: "#e5e7eb",
              }}
            />
          </label>
          <label>
            <div style={{ color: "#9ca3af", marginBottom: 4 }}>Goal reps</div>
            <input
              type="number"
              min={1}
              value={newGoal}
              onChange={(e) => setNewGoal(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #233147",
                background: "#0b1220",
                color: "#e5e7eb",
              }}
            />
          </label>
          <label>
            <div style={{ color: "#9ca3af", marginBottom: 4 }}>Wrap size</div>
            <input
              type="number"
              min={1}
              value={newWrap}
              onChange={(e) => setNewWrap(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #233147",
                background: "#0b1220",
                color: "#e5e7eb",
              }}
            />
          </label>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
            <button
              onClick={() => setCreateOpen(false)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: "#1f2937",
                color: "#e5e7eb",
                border: "1px solid #374151",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateHabit}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: "#10b981",
                color: "#062019",
                fontWeight: 700,
              }}
            >
              Create
            </button>
          </div>

          <p style={{ color: "#9ca3af", margin: "6px 0 0" }}>
            Start small is smart. You can always change this later.
          </p>
        </div>
      </Modal>

      <Modal open={editOpen} title="Edit habit" onClose={() => setEditOpen(false)}>
        <div style={{ display: "grid", gap: 10 }}>
          <label>
            <div style={{ color: "#9ca3af", marginBottom: 4 }}>Name</div>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #233147",
                background: "#0b1220",
                color: "#e5e7eb",
              }}
            />
          </label>
          <label>
            <div style={{ color: "#9ca3af", marginBottom: 4 }}>Goal reps</div>
            <input
              type="number"
              min={1}
              value={editGoal}
              onChange={(e) => setEditGoal(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #233147",
                background: "#0b1220",
                color: "#e5e7eb",
              }}
            />
          </label>
          <label>
            <div style={{ color: "#9ca3af", marginBottom: 4 }}>Wrap size</div>
            <input
              type="number"
              min={1}
              value={editWrap}
              onChange={(e) => setEditWrap(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #233147",
                background: "#0b1220",
                color: "#e5e7eb",
              }}
            />
          </label>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
            <button
              onClick={() => setEditOpen(false)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: "#1f2937",
                color: "#e5e7eb",
                border: "1px solid #374151",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: "#34d399",
                color: "#062019",
                fontWeight: 700,
              }}
            >
              Save
            </button>
          </div>

          <p style={{ color: "#9ca3af", margin: "6px 0 0" }}>
            You can change goals as you grow. Progress isn’t linear — it’s kind.
          </p>
        </div>
      </Modal>

      <Footer />

      {/* Small style niceties */}
      <style jsx>{`
        @media (max-width: 820px) {
          section[style*="grid-template-columns"] {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}

