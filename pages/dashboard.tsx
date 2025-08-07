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

      <main style={{ minHeight: "70vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "600px", textAlign: "center" }}>
          {user ? (
            <>
              <section style={{ marginBottom: "3rem", padding: "2rem", border: "1px solid #ccc", borderRadius: "12px" }}>
                <h2>Welcome Back 🧠</h2>
                <p>Email: <strong>{user.email}</strong></p>

                <div style={{ display: "flex", justifyContent: "space-around", marginTop: "1.5rem" }}>
                  <div>
                    <p><strong>Total Reps</strong></p>
                    <p>{userData.reps}</p>
                  </div>
                  <div>
                    <p><strong>Last Rep</strong></p>
                    <p>{userData.last_rep ? new Date(userData.last_rep).toLocaleDateString() : "Never"}</p>
                  </div>
                </div>

                <button onClick={handleLogout} style={{ marginTop: "2rem", padding: "0.75rem 2rem" }}>
                  Sign Out
                </button>
              </section>

              <section style={{ padding: "2rem", border: "1px solid #ccc", borderRadius: "12px", backgroundColor: "#f0f0f0" }}>
                <h2>Log a Rep</h2>
                <p>This is how you wire new habits into your brain.</p>
                <button
                  onClick={logRep}
                  disabled={loading}
                  style={{ marginTop: "1rem", padding: "0.75rem 2rem" }}
                >
                  {loading ? "Logging..." : "Log Rep"}
                </button>
              </section>
            </>
          ) : (
            <section style={{ padding: "2rem", border: "1px solid #ccc", borderRadius: "12px" }}>
              <h2>Sign In Required</h2>
              <p>
                Please <Link href="/signin">sign in here</Link> to access your dashboard.
              </p>
            </section>
          )}

          <p style={{ marginTop: "3rem", fontStyle: "italic" }}>
            “You are not broken. You are becoming.”
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
