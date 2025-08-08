// pages/dashboard.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { User } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

// OPTIONAL: if you already have a visualizer component, import it here:
// import Visualizer from "@/components/Visualizer";

type Tab = "overview" | "visualizer" | "coach" | "history";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<{ reps: number; last_rep: string | null }>({
    reps: 0,
    last_rep: null,
  });
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<Tab>("overview");

  // lightweight “streak” & last-7-days counts (approximate with current schema)
  const [dailyCounts, setDailyCounts] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [streak, setStreak] = useState<number>(0);
  const [nudge, setNudge] = useState<string>("");

  // Watch authentication state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  // Fetch user reps data + subscribe to updates
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("user_reps")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && (error as any).code === "PGRST116") {
        // no row yet — create one
        const { data: initialData, error: insertError } = await supabase
          .from("user_reps")
          .insert({ user_id: user.id, reps: 0, last_rep: null })
          .select()
          .single();
        if (!insertError && initialData) setUserData(initialData);
      } else if (!error && data) {
        setUserData(data);
      }
    };

    fetchUserData();

    const subscription = supabase
      .channel(`user_reps:${user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "user_reps", filter: `user_id=eq.${user.id}` },
        (payload) => setUserData((prev) => ({ ...prev, ...(payload as any).new }))
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  // compute minimal streak + last-7-days (until we add a rep_events table)
  useEffect(() => {
    if (!user) return;
    const today = new Date(); today.setHours(0,0,0,0);
    const arr = Array(7).fill(0);

    if (userData.last_rep) {
      const lr = new Date(userData.last_rep);
      lr.setHours(0, 0, 0, 0);
      const diffDays = Math.round((today.getTime() - lr.getTime()) / 86400000);
      // crude: mark today if last_rep is today
      if (diffDays === 0) arr[6] = 1;
      setStreak(diffDays === 0 ? 1 : 0); // upgrade once we track daily events
    } else {
      setStreak(0);
    }

    setDailyCounts(arr);
  }, [user, userData.last_rep]);

  const logRep = async () => {
    if (!user) return;
    setLoading(true);

    const newRepCount = userData.reps + 1;
    const now = new Date();

    const { error } = await supabase
      .from("user_reps")
      .update({ reps: newRepCount, last_rep: now.toISOString() })
      .eq("user_id", user.id);

    setLoading(false);

    if (error) {
      console.error("Error logging rep:", error);
      return;
    }

    // small science-backed nudge (implementation intentions)
    const nudges = [
      "Nice. When will you do the next one? Pick a time.",
      "Stack it to a trigger you already do (coffee? doorway?).",
      "Small + consistent > perfect. One more tiny rep later today.",
      "Label the win: 'I am someone who reps even when it’s hard.'",
    ];
    setNudge(nudges[Math.floor(Math.random() * nudges.length)]);
  };

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
              <nav style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
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
                <button onClick={handleLogout} style={{ padding: "8px 14px", borderRadius: 8, cursor: "pointer" }}>
                  Sign Out
                </button>
              </nav>

              {/* Panels */}
              {active === "overview" && (
                <section
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  {/* Stats card */}
                  <div style={{ border: "1px solid #ccc", borderRadius: 12, padding: 16 }}>
                    <h2 style={{ marginTop: 0 }}>Welcome Back 🧠</h2>
                    <p style={{ margin: "8px 0 16px" }}>
                      Email: <strong>{user.email}</strong>
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                      <div style={{ flex: 1, border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
                        <p style={{ margin: 0, color: "#666" }}>Total Reps</p>
                        <p style={{ margin: "6px 0 0", fontSize: 24 }}>{userData.reps}</p>
                      </div>
                      <div style={{ flex: 1, border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
                        <p style={{ margin: 0, color: "#666" }}>Streak</p>
                        <p style={{ margin: "6px 0 0", fontSize: 24 }}>{streak} day{streak === 1 ? "" : "s"}</p>
                      </div>
                      <div style={{ flex: 1, border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
                        <p style={{ margin: 0, color: "#666" }}>Last Rep</p>
                        <p style={{ margin: "6px 0 0", fontSize: 18 }}>
                          {userData.last_rep ? new Date(userData.last_rep).toLocaleDateString() : "Never"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Log a rep */}
                  <div style={{ border: "1px solid #ccc", borderRadius: 12, padding: 16, background: "#f7f7f7" }}>
                    <h2 style={{ marginTop: 0 }}>Log a Rep</h2>
                    <p style={{ marginTop: 0 }}>This is how you wire new habits into your brain.</p>
                    <button
                      onClick={logRep}
                      disabled={loading}
                      style={{ padding: "10px 20px", cursor: loading ? "not-allowed" : "pointer" }}
                    >
                      {loading ? "Logging..." : "Log Rep"}
                    </button>
                    {nudge && <p style={{ marginTop: 10, color: "#0f766e" }}>{nudge}</p>}
                  </div>

                  {/* 7-day sparkline (full width) */}
                  <div style={{ gridColumn: "1 / -1", border: "1px solid #ccc", borderRadius: 12, padding: 16 }}>
                    <p style={{ marginTop: 0 }}>
                      <strong>Last 7 Days</strong>
                    </p>
                    <svg
                      width="100%"
                      height="48"
                      viewBox="0 0 140 48"
                      preserveAspectRatio="none"
                      style={{ background: "#fafafa", borderRadius: 8, border: "1px solid #eee" }}
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
                    <small style={{ color: "#666" }}>We’ll make this precise once we add per‑rep events.</small>
                  </div>
                </section>
              )}

              {active === "visualizer" && (
                <section style={{ border: "1px solid #ccc", borderRadius: 12, padding: 16 }}>
                  <h2 style={{ marginTop: 0 }}>Your Neural Visualizer 🧬</h2>
                  <p style={{ marginTop: 0, color: "#555" }}>
                    This view grows with your reps. (Dashboard‑only visualizer — keep the fruit tree on Home.)
                  </p>
                  {/* Mount your visualizer component here */}
                  <div style={{ height: 360, border: "1px dashed #bbb", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {/* <Visualizer reps={userData.reps} lastRep={userData.last_rep} /> */}
                    <span style={{ color: "#777" }}>Visualizer placeholder — plug in your component</span>
                  </div>
                </section>
              )}

              {active === "coach" && (
                <section style={{ border: "1px solid #ccc", borderRadius: 12, padding: 16 }}>
                  <h2 style={{ marginTop: 0 }}>Your Personal Coach 🧠</h2>
                  <p style={{ marginTop: 0, color: "#555" }}>
                    The public FloatingCoach stays on all pages. This private space can reflect your data and goals.
                  </p>
                  <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
                    <p style={{ margin: 0 }}>
                      “Based on your last rep on{" "}
                      <strong>
                        {userData.last_rep ? new Date(userData.last_rep).toLocaleDateString() : "—"}
                      </strong>
                      , here’s a micro‑win for today: <em>2‑minute breath reset + 1 tiny rep after coffee.</em>”
                    </p>
                  </div>
                </section>
              )}

              {active === "history" && (
                <section style={{ border: "1px solid #ccc", borderRadius: 12, padding: 16 }}>
                  <h2 style={{ marginTop: 0 }}>History & Insights</h2>
                  <p style={{ color: "#555" }}>
                    We’ll populate this with daily reps, weekly trends, and milestones once we add the events table.
                  </p>
                  <ul style={{ marginTop: 8 }}>
                    <li>Milestones (3, 7, 21, 42, 66 days)</li>
                    <li>Week‑over‑week improvements</li>
                    <li>Correlation with mood/craving (future)</li>
                  </ul>
                </section>
              )}
            </>
          ) : (
            <section style={{ border: "1px solid #ccc", borderRadius: 12, padding: 24, textAlign: "center" }}>
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
