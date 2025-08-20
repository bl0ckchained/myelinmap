import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Head from "next/head";
import { User, type PostgrestError } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import HabitLoop from "@/components/HabitLoop";
import NeuralField from "@/components/NeuralField";
import MyelinVisualizer from "@/components/MyelinVisualizer";
import HabitAnalytics from "@/components/HabitAnalytics";
import FloatingCoach from "@/components/FloatingCoach";
import DashboardJournalWidget from "@/components/DashboardJournalWidget";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";

type Tab = "overview" | "visualizer" | "coach" | "history";
type UserRepsRow = {
  user_id: string;
  reps: number;
  last_rep: string | null;
};
type HabitRow = {
  id: string;
  user_id: string;
  name: string;
  goal_reps: number;
  wrap_size: number;
  created_at: string;
};
type UpdatePayload<T> = {
  eventType: "INSERT" | "UPDATE" | "DELETE" | "SELECT";
  new: T | null;
  old: T | null;
};

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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <Card
        variant="glass"
        className="max-w-md w-full p-6 bg-gradient-to-br from-blue-900/80 to-purple-900/80 backdrop-blur-lg"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-300 hover:text-white"
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
  const [dailyCounts, setDailyCounts] = useState<number[]>(Array(7).fill(0));
  const [monthlyCounts, setMonthlyCounts] = useState<number[]>(Array(30).fill(0));
  const [streak, setStreak] = useState<number>(0);
  const [nudge, setNudge] = useState<string>("");
  const [habits, setHabits] = useState<HabitRow[]>([]);
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);
  const [habitRepCount, setHabitRepCount] = useState<number>(0);
  const [loopPulse, setLoopPulse] = useState(0);
  const [wrapBurst, setWrapBurst] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newName, setNewName] = useState("Breath reset");
  const [newGoal, setNewGoal] = useState<number>(21);
  const [newWrap, setNewWrap] = useState<number>(7);
  const [editName, setEditName] = useState("");
  const [editGoal, setEditGoal] = useState<number>(21);
  const [editWrap, setEditWrap] = useState<number>(7);

  // New: Affirmation state
  const affirmations = useMemo(
    () => [
      "I am enough, exactly as I am.",
      "Every small step is rewiring my future.",
      "I am healing, one kind choice at a time.",
      "My past does not define my potential.",
    ],
    []
  );
  const [dailyAffirmation, setDailyAffirmation] = useState<string>("");

  const clampInt = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, Math.floor(v)));

  // New: Set daily affirmation
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const index = new Date().getDate() % affirmations.length;
    setDailyAffirmation(affirmations[index]);
  }, [affirmations]);

  // Existing effects (unchanged, but memoized where possible)
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

  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("user_reps")
        .select("*")
        .eq("user_id", user.id)
        .single();
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

  useEffect(() => {
    if (!user) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const arr = Array(7).fill(0);
    if (userData.last_rep) {
      const lr = new Date(userData.last_rep);
      lr.setHours(0, 0, 0, 0);
      const diffDays = Math.round((today.getTime() - lr.getTime()) / 86400000);
      if (diffDays === 0) arr[6] = 1;
      setStreak(diffDays === 0 ? 1 : 0);
    } else {
      setStreak(0);
    }
    setDailyCounts(arr);
  }, [user, userData.last_rep]);

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

  useEffect(() => {
    if (!user) return;
    const compute = async () => {
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
      const arr7 = Array(7).fill(0);
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        const key = d.toISOString().slice(0, 10);
        arr7[i] = dayKeys.has(key) ? 1 : 0;
      }
      setDailyCounts(arr7);
      const arr30 = Array(30).fill(0);
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - (29 - i));
        const key = d.toISOString().slice(0, 10);
        arr30[i] = dayKeys.has(key) ? 1 : 0;
      }
      setMonthlyCounts(arr30);
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
    };
    compute();
  }, [user, activeHabitId, habits, userData.last_rep]);

  const logRep = async () => {
    if (!user || !activeHabitId) return;
    setLoading(true);
    const { error: evErr } = await supabase
      .from("rep_events")
      .insert({ user_id: user.id, habit_id: activeHabitId });
    if (evErr) {
      console.error("Error inserting rep_event:", evErr);
      setLoading(false);
      return;
    }
    setLoopPulse((n) => n + 1);
    const activeHabit = habits.find((h) => h.id === activeHabitId);
    if (activeHabit) {
      const size = Math.max(1, activeHabit.wrap_size);
      const nextTotal = habitRepCount + 1;
      if (nextTotal % size === 0) {
        setWrapBurst(true);
        setTimeout(() => setWrapBurst(false), 1000);
      }
    }
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
    const nudges = [
      "Nice. When will you do the next one? Pick a time.",
      "Stack it to a trigger you already do (coffee? doorway?).",
      "Small + consistent > perfect. One more tiny rep later today.",
      "Label the win: 'I am someone who reps even when it's hard.'",
    ];
    setNudge(nudges[Math.floor(Math.random() * nudges.length)]);
    setUserData((prev) => ({
      ...prev,
      reps: newRepCount,
      last_rep: now.toISOString(),
    }));
    setHabitRepCount((c) => c + 1);
  };

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
  };

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
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 text-white font-sans">
      <Head>
        <title>Dashboard | Myelin Map</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      </Head>
      <Header
        title="Your Dashboard 🌟"
        subtitle="A sanctuary for your comeback"
      />
      <main className="container mx-auto px-4 py-8">
        {user ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <Tabs
                tabs={tabsData}
                activeTab={active}
                onTabChange={(tabId) => setActive(tabId as Tab)}
                variant="magical"
                className="transition-all duration-300"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-300 hover:text-white"
              >
                Sign Out
              </Button>
            </div>
            {active === "overview" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card className="bg-gradient-to-br from-blue-800/80 to-purple-800/80 backdrop-blur-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Welcome Back 🧠</h2>
                    <p className="text-gray-300 mb-4">
                      Email: <strong>{user.email}</strong>
                    </p>
                    <div className="mb-4">
                      <label htmlFor="habit" className="block text-gray-300 mb-2">
                        Active habit:
                      </label>
                      <select
                        id="habit"
                        value={activeHabitId ?? ""}
                        onChange={(e) => setActiveHabitId(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        {habits.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.name} (goal {h.goal_reps})
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2 mt-2">
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
                    <div className="space-y-6">
                      {(() => {
                        const h = habits.find((x) => x.id === activeHabitId);
                        if (!h) return null;
                        return (
                          <>
                            <HabitLoop
                              repCount={habitRepCount}
                              wrapSize={Math.max(1, h.wrap_size)}
                              trigger={loopPulse}
                              celebrate={wrapBurst}
                              title={`${h.name} — Habit Loop`}
                            />
                            <MyelinVisualizer
                              repCount={habitRepCount}
                              wrapSize={Math.max(1, h.wrap_size)}
                              pulseKey={loopPulse}
                              height={280}
                              title={`${h.name} — Myelin Network`}
                            />
                          </>
                        );
                      })()}
                    </div>
                    <div className="flex items-center mt-6">
                      <div className="relative">
                        <svg width="72" height="72" viewBox="0 0 72 72" aria-label={`Streak: ${streak} days`}>
                          <defs>
                            <filter id="glow">
                              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
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
                                strokeDasharray={`${dash} ${circumference - dash}`}
                                strokeLinecap="round"
                                transform="rotate(-90 36 36)"
                                filter={streak > 0 ? "url(#glow)" : undefined}
                                className="transition-all duration-500"
                              />
                            );
                          })()}
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-lg font-semibold">
                          {streak} day{streak === 1 ? "" : "s"} streak
                        </div>
                        <div className="text-gray-400">
                          {streak > 0
                            ? "You came back. That's braver than never missing."
                            : "Today can be day one. One tiny rep."}
                        </div>
                      </div>
                    </div>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-800/80 to-purple-800/80 backdrop-blur-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Coach & Quick Rep</h2>
                    <p className="text-gray-300 mb-4">
                      Private coach plus a one-tap rep. Gentle, practical, always on your side.
                    </p>
                    {(() => {
                      const h = habits.find((x) => x.id === activeHabitId) ?? null;
                      const extra = h
                        ? `Active habit: ${h.name} (wrap ${Math.max(1, h.wrap_size)}). Total reps: ${habitRepCount}. Offer tiny, specific implementation intentions. Normalize lapses; suggest one tiny rep.`
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
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Log a Rep</h3>
                      <p className="text-gray-400 mb-2">
                        This is how new wiring takes root.
                      </p>
                      <Button
                        variant="primary"
                        onClick={logRep}
                        disabled={loading || !activeHabitId}
                        loading={loading}
                        className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-all duration-300"
                      >
                        {loading ? "Logging..." : "Log Rep"}
                      </Button>
                      {nudge && <p className="text-gray-300 mt-2">{nudge}</p>}
                      {!activeHabitId && (
                        <p className="text-gray-400 mt-2">
                          Creating your first habit… if this persists, refresh.
                        </p>
                      )}
                    </div>
                    {/* New: Affirmation Widget */}
                    <div className="mt-6 p-4 bg-blue-900/50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Daily Affirmation</h3>
                      <p className="text-gray-200 italic">"{dailyAffirmation}"</p>
                    </div>
                  </Card>
                  <div className="col-span-1 md:col-span-2">
                    <DashboardJournalWidget />
                  </div>
                </div>
                <Card className="bg-gray-800/80 p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-2">Last 7 Days</h3>
                  <svg
                    width="100%"
                    height="48"
                    viewBox="0 0 140 48"
                    preserveAspectRatio="none"
                    className="mb-2"
                    aria-label="Last 7 days activity"
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
                            className="transition-all duration-500"
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
                  <small className="text-gray-400">
                    Counts reflect days with activity. One tiny rep is enough to light up a day.
                  </small>
                </Card>
                <Card className="bg-gray-800/80 p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-2">Last 30 Days</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {monthlyCounts.map((hasActivity, i) => {
                      const today = new Date();
                      const date = new Date(today);
                      date.setDate(today.getDate() - (29 - i));
                      const dayOfMonth = date.getDate();
                      const isToday = i === 29;
                      return (
                        <div
                          key={i}
                          className={`p-2 rounded text-center ${
                            hasActivity ? "bg-green-500" : "bg-gray-700"
                          } ${isToday ? "ring-2 ring-yellow-400" : ""}`}
                          title={`${date.toLocaleDateString()} - ${
                            hasActivity ? "Active" : "No activity"
                          }`}
                        >
                          <span>{dayOfMonth}</span>
                          {hasActivity && <div className="w-1 h-1 bg-white rounded-full mx-auto mt-1" />}
                        </div>
                      );
                    })}
                  </div>
                  <small className="text-gray-400 mt-2 block">
                    Your habit journey over the past month. Each dot represents a day with activity.
                  </small>
                </Card>
                <Card className="bg-gray-800/80 p-6">
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
              <div className="space-y-6">
                {(() => {
                  const h = habits.find((x) => x.id === activeHabitId);
                  if (!h)
                    return (
                      <Card className="bg-gray-800/80 p-6">
                        <h2 className="text-xl font-semibold mb-2">Select a Habit</h2>
                        <p className="text-gray-300">
                          Choose an active habit to see your neural network visualization.
                        </p>
                      </Card>
                    );
                  return (
                    <MyelinVisualizer
                      repCount={habitRepCount}
                      wrapSize={Math.max(1, h.wrap_size)}
                      pulseKey={loopPulse}
                      height={400}
                      title={`${h.name} — Advanced Myelin Network`}
                    />
                  );
                })()}
                {(() => {
                  const h = habits.find((x) => x.id === activeHabitId);
                  if (!h) return null;
                  return (
                    <Card className="bg-gray-800/80 p-6">
                      <h3 className="text-lg font-semibold mb-2">Classic Neural Field View</h3>
                      <NeuralField
                        repCount={habitRepCount}
                        wrapSize={Math.max(1, h.wrap_size)}
                        pulseKey={loopPulse}
                        height={260}
                      />
                    </Card>
                  );
                })()}
              </div>
            )}
            {active === "coach" && (
              <Card className="bg-gray-800/80 p-6">
                <h2 className="text-xl font-semibold mb-2">Your Personal Coach 🧠</h2>
                <p className="text-gray-300 mb-4">
                  The public FloatingCoach stays on all pages. This private space can reflect your data and goals.
                </p>
                <Card className="bg-blue-900/50 p-4">
                  <p>
                    Based on your last rep on{" "}
                    <strong>
                      {userData.last_rep
                        ? new Date(userData.last_rep).toLocaleDateString()
                        : "—"}
                    </strong>
                    , here's a micro-win for today:{" "}
                    <em>2-minute breath reset + 1 tiny rep after coffee.</em>
                  </p>
                </Card>
              </Card>
            )}
            {active === "history" && (
              <Card className="bg-gray-800/80 p-6">
                <h2 className="text-xl font-semibold mb-2">History & Insights</h2>
                <p className="text-gray-300 mb-4">
                  We'll populate this with daily reps, weekly trends, and milestones once we add the events table.
                </p>
                <ul className="list-disc pl-5 text-gray-300">
                  <li>Milestones (3, 7, 21, 42, 66 days)</li>
                  <li>Week-over-week improvements</li>
                  <li>Correlation with mood/craving (future)</li>
                </ul>
              </Card>
            )}
            <p className="text-center text-gray-300 italic mt-8">
              &ldquo;You are not broken. You are becoming.&rdquo;
            </p>
          </>
        ) : (
          <Card className="bg-gradient-to-br from-blue-800/80 to-purple-800/80 backdrop-blur-md p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-gray-300">
              Please{" "}
              <Link href="/signin" className="text-yellow-400 hover:underline">
                sign in here
              </Link>{" "}
              to access your dashboard.
            </p>
          </Card>
        )}
      </main>
      <Modal open={createOpen} title="Create a habit" onClose={() => setCreateOpen(false)}>
        <div className="grid gap-4">
          <label>
            <div className="text-gray-300 mb-1">Name</div>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Breath reset"
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>
          <label>
            <div className="text-gray-300 mb-1">Goal reps</div>
            <input
              type="number"
              min={1}
              value={newGoal}
              onChange={(e) => setNewGoal(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>
          <label>
            <div className="text-gray-300 mb-1">Wrap size</div>
            <input
              type="number"
              min={1}
              value={newWrap}
              onChange={(e) => setNewWrap(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => setCreateOpen(false)}
              className="bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateHabit}
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
            >
              Create
            </Button>
          </div>
          <p className="text-gray-400 text-sm">
            Start small is smart. You can always change this later.
          </p>
        </div>
      </Modal>
      <Modal open={editOpen} title="Edit habit" onClose={() => setEditOpen(false)}>
        <div className="grid gap-4">
          <label>
            <div className="text-gray-300 mb-1">Name</div>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>
          <label>
            <div className="text-gray-300 mb-1">Goal reps</div>
            <input
              type="number"
              min={1}
              value={editGoal}
              onChange={(e) => setEditGoal(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>
          <label>
            <div className="text-gray-300 mb-1">Wrap size</div>
            <input
              type="number"
              min={1}
              value={editWrap}
              onChange={(e) => setEditWrap(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => setEditOpen(false)}
              className="bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveEdit}
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
            >
              Save
            </Button>
          </div>
          <p className="text-gray-400 text-sm">
            You can change goals as you grow. Progress isn't linear — it's kind.
          </p>
        </div>
      </Modal>
      <Footer />
    </div>
  );
}