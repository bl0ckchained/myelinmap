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
import FloatingCoach from "@/components/FloatingCoach";
import DashboardJournalWidget from "@/components/DashboardJournalWidget";

// New magical UI components
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import styles from "@/styles/Dashboard.module.css";

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
   Enhanced Modal Component
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
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <Card
        variant="glass"
        className={styles.modalCard}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close"
            className={styles.modalClose}
          >
            ✕
          </Button>
        </div>
        {children}
      </Card>
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
  const [dailyCounts, setDailyCounts] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0,
  ]);
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
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
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
        if (!insertError && initialData)
          setUserData(initialData as UserRepsRow);
      } else if (!error && data) {
        setUserData(data as UserRepsRow);
      }
    };

    fetchUserData();

    const subscription = supabase
      .channel(`user_reps:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_reps",
          filter: `user_id=eq.${user.id}`,
        },
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
        (events ?? []).map((e) =>
          new Date(e.ts as string).toISOString().slice(0, 10)
        )
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
      "Label the win: 'I am someone who reps even when it's hard.'",
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

  const tabsData = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "visualizer", label: "Visualizer", icon: "🧬" },
    { id: "coach", label: "Coach", icon: "🧠" },
    { id: "history", label: "History", icon: "📈" },
  ];

  return (
    <div className={styles.dashboard}>
      <Head>
        <title>Dashboard | Myelin Map</title>
      </Head>

      <Header
        title="Your Dashboard 📈"
        subtitle="A visual record of your comeback"
      />

      <main className={styles.container}>
        {user ? (
          <>
            {/* Enhanced Tabs with Sign Out */}
            <div className={styles.tabsContainer}>
              <Tabs
                tabs={tabsData}
                activeTab={active}
                onTabChange={(tabId) => setActive(tabId as Tab)}
                variant="magical"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className={styles.signOutButton}
              >
                Sign Out
              </Button>
            </div>

            {active === "overview" && (
              <>
                <div className={styles.overviewGrid}>
                  {/* Stats + Habit card (left) */}
                  <Card variant="magical" className={styles.statsCard}>
                    <div className={styles.welcomeSection}>
                      <h2 className={styles.title}>Welcome Back 🧠</h2>
                      <p className={styles.userEmail}>
                        Email: <strong>{user.email}</strong>
                      </p>

                      {/* Habit selector + actions */}
                      <div className={styles.habitControls}>
                        <label htmlFor="habit" className={styles.habitLabel}>
                          Active habit:
                        </label>
                        <select
                          id="habit"
                          value={activeHabitId ?? ""}
                          onChange={(e) => setActiveHabitId(e.target.value)}
                          className={styles.habitSelect}
                        >
                          {habits.map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.name} (goal {h.goal_reps})
                            </option>
                          ))}
                        </select>

                        <div className={styles.habitActions}>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setCreateOpen(true)}
                          >
                            + New Habit
                          </Button>

                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={openEditForActive}
                            disabled={!activeHabitId}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>

                      {/* The loop + neural field */}
                      <div className={styles.visualSection}>
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

                      <div className={styles.visualSection}>
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

                      {/* Streak ring */}
                      <div className={styles.streakContainer}>
                        <div className={styles.streakRing}>
                          <svg width="72" height="72" viewBox="0 0 72 72">
                            <defs>
                              <filter id="glow">
                                <feGaussianBlur
                                  stdDeviation="2.5"
                                  result="coloredBlur"
                                />
                                <feMerge>
                                  <feMergeNode in="coloredBlur" />
                                  <feMergeNode in="SourceGraphic" />
                                </feMerge>
                              </filter>
                            </defs>
                            <circle
                              cx="36"
                              cy="36"
                              r="30"
                              stroke="#1f2937"
                              strokeWidth="8"
                              fill="none"
                            />
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
                                  strokeDasharray={`${dash} ${
                                    circumference - dash
                                  }`}
                                  strokeLinecap="round"
                                  transform="rotate(-90 36 36)"
                                  filter={streak > 0 ? "url(#glow)" : undefined}
                                />
                              );
                            })()}
                          </svg>
                        </div>
                        <div className={styles.streakInfo}>
                          <div className={styles.streakNumber}>
                            {streak} day{streak === 1 ? "" : "s"} streak
                          </div>
                          <div className={styles.streakText}>
                            {streak > 0
                              ? "You came back. That's braver than never missing."
                              : "Today can be day one. One tiny rep."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Coach card (right) */}
                  <Card variant="default" className={`${styles.coachCard} ${styles.coachSection}`}>
                    <h2 className={styles.coachTitle}>Coach & Quick Rep</h2>
                    <p className={styles.coachSubtitle}>
                      Private coach plus a one-tap rep. Gentle, practical,
                      always on your side.
                    </p>

                    {/* Embedded habit-aware coach */}
                    {(() => {
                      const h =
                        habits.find((x) => x.id === activeHabitId) ?? null;
                      const extra = h
                        ? `Active habit: ${h.name} (wrap ${Math.max(
                            1,
                            h.wrap_size
                          )}). Total reps: ${habitRepCount}. Offer tiny, specific implementation intentions. Normalize lapses; suggest one tiny rep.`
                        : `No active habit selected. Encourage choosing a tiny habit and planning an implementation intention.`;

                      return (
                        <FloatingCoach
                          variant="embedded"
                          storageKey="coach_chatlog"
                          systemContextExtra={extra}
                          onLogRep={logRep}
                          height={260}
                          title="Coach (private)"
                        />
                      );
                    })()}

                    <div className={styles.repSection}>
                      <h3 className={styles.repTitle}>Log a Rep</h3>
                      <p className={styles.repSubtitle}>
                        This is how new wiring takes root.
                      </p>
                      <Button
                        variant="primary"
                        onClick={logRep}
                        disabled={loading || !activeHabitId}
                        loading={loading}
                        className={styles.repButton}
                      >
                        {loading ? "Logging..." : "Log Rep"}
                      </Button>
                      {nudge && (
                        <p className={styles.nudgeText}>{nudge}</p>
                      )}
                      {!activeHabitId && (
                        <p className={styles.loadingText}>
                          Creating your first habit… if this persists, refresh.
                        </p>
                      )}
                    </div>
                  </Card>

                  {/* Journal widget (spans both columns) */}
                  <div className={styles.journalCard}>
                    <DashboardJournalWidget />
                  </div>
                </div>

                {/* 7-day sparkline (full width) */}
                <Card variant="default" className={`${styles.fullWidthCard} ${styles.sparklineContainer}`}>
                  <h3 className={styles.sparklineTitle}>Last 7 Days</h3>
                  <svg
                    width="100%"
                    height="48"
                    viewBox="0 0 140 48"
                    preserveAspectRatio="none"
                    className={styles.sparklineSvg}
                  >
                    {(() => {
                      const max = Math.max(1, ...dailyCounts);
                      const stepX = 140 / 6;
                      const pts = dailyCounts
                        .map((v, i) => `${i * stepX},${46 - (v / max) * 42}`)
                        .join(" ");
                      return (
                        <>
                          <polyline
                            points={pts}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                          />
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
                  <small className={styles.sparklineNote}>
                    Counts reflect days with activity. One tiny rep is enough
                    to light up a day.
                  </small>
                </Card>

                {/* Habit Analytics Section */}
                <Card variant="default" className={styles.fullWidthCard}>
                  <HabitAnalytics
                    habits={habits}
                    habitRepCount={habitRepCount}
                    streak={streak}
                    dailyCounts={dailyCounts}
                  />
                </Card>
              </>
            )}

            {active === "visualizer" && (
              <Card variant="default" className={styles.placeholderSection}>
                <h2 className={styles.placeholderTitle}>Your Neural Visualizer 🧬</h2>
                <p className={styles.placeholderText}>
                  This view grows with your reps. (Dashboard-only visualizer —
                  keep the fruit tree on Home.)
                </p>
                <div className={styles.placeholderContent}>
                  <span>Visualizer placeholder — plug in your component</span>
                </div>
              </Card>
            )}

            {active === "coach" && (
              <Card variant="default" className={styles.placeholderSection}>
                <h2 className={styles.placeholderTitle}>Your Personal Coach 🧠</h2>
                <p className={styles.placeholderText}>
                  The public FloatingCoach stays on all pages. This private
                  space can reflect your data and goals.
                </p>
                <Card variant="glass">
                  <p>
                    "Based on your last rep on{" "}
                    <strong>
                      {userData.last_rep
                        ? new Date(userData.last_rep).toLocaleDateString()
                        : "—"}
                    </strong>
                    , here's a micro-win for today:{" "}
                    <em>2-minute breath reset + 1 tiny rep after coffee.</em>"
                  </p>
                </Card>
              </Card>
            )}

            {active === "history" && (
              <Card variant="default" className={styles.placeholderSection}>
                <h2 className={styles.placeholderTitle}>History & Insights</h2>
                <p className={styles.placeholderText}>
                  We'll populate this with daily reps, weekly trends, and
                  milestones once we add the events table.
                </p>
                <ul>
                  <li>Milestones (3, 7, 21, 42, 66 days)</li>
                  <li>Week-over-week improvements</li>
                  <li>Correlation with mood/craving (future)</li>
                </ul>
              </Card>
            )}

            <p className={styles.inspirationalQuote}>
              "You are not broken. You are becoming."
            </p>
          </>
        ) : (
          <Card variant="glass" className={styles.signInSection}>
            <h2 className={styles.signInTitle}>Sign In Required</h2>
            <p className={styles.signInText}>
              Please <Link href="/signin" className={styles.signInLink}>sign in here</Link> to access your
              dashboard.
            </p>
          </Card>
        )}
      </main>

      {/* Create & Edit Modals */}
      <Modal
        open={createOpen}
        title="Create a habit"
        onClose={() => setCreateOpen(false)}
      >
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

          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <Button
              variant="secondary"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateHabit}
            >
              Create
            </Button>
          </div>

          <p style={{ color: "#9ca3af", margin: "6px 0 0" }}>
            Start small is smart. You can always change this later.
          </p>
        </div>
      </Modal>

      <Modal
        open={editOpen}
        title="Edit habit"
        onClose={() => setEditOpen(false)}
      >
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

          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <Button
              variant="secondary"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveEdit}
            >
              Save
            </Button>
          </div>

          <p style={{ color: "#9ca3af", margin: "6px 0 0" }}>
            You can change goals as you grow. Progress isn&apos;t linear — it&apos;s kind.
          </p>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
