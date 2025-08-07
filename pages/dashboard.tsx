// pages/dashboard.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { createClient, User } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<{ reps: number; last_rep: string | null }>({ reps: 0, last_rep: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("user_reps")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code === "PGRST116") {
        const { data: initialData, error: insertError } = await supabase
          .from("user_reps")
          .insert({ user_id: user.id, reps: 0, last_rep: null })
          .select()
          .single();
        if (!insertError) setUserData(initialData);
      } else if (!error && data) {
        setUserData(data);
      }
    };

    fetchUserData();

    const subscription = supabase
      .channel(`user_reps:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'user_reps', filter: `user_id=eq.${user.id}` },
        (payload) => {
          setUserData(prev => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  const logRep = async () => {
    if (!user) return;
    setLoading(true);

    const newRepCount = userData.reps + 1;
    const now = new Date();

    const { error } = await supabase
      .from("user_reps")
      .update({ reps: newRepCount, last_rep: now.toISOString() })
      .eq("user_id", user.id);

    if (error) console.error("Error logging rep:", error);
    setLoading(false);
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

      <main className="dashboard-main">
        <div className="dashboard-container">
          {user ? (
            <>
              <section className="card">
                <h2>Welcome Back 🧠</h2>
                <p>Email: <strong>{user.email}</strong></p>

                <div className="data-section">
                  <div className="data-box">
                    <p>Total Reps</p>
                    <h3>{userData.reps}</h3>
                  </div>
                  <div className="data-box">
                    <p>Last Rep</p>
                    <h3>{userData.last_rep ? new Date(userData.last_rep).toLocaleDateString() : "Never"}</h3>
                  </div>
                </div>

                <button onClick={handleLogout}>Sign Out</button>
              </section>

              <section className="card highlight">
                <h2>Log a Rep</h2>
                <p>Clicking this button builds myelin and rewires your brain.</p>
                <button onClick={logRep} disabled={loading}>
                  {loading ? "Logging..." : "Log Rep"}
                </button>
              </section>
            </>
          ) : (
            <section className="card">
              <h2>Sign In Required</h2>
              <p>Please <Link href="/signin">sign in here</Link> to access your dashboard.</p>
            </section>
          )}

          <p className="quote">“You are not broken. You are becoming.”</p>
        </div>
      </main>

      <Footer />
    </>
  );
}
// --- Dashboard Component ---