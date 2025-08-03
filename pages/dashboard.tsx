import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import { createClient, User } from "@supabase/supabase-js";

// This file is a self-contained, full-featured user dashboard.
// It handles authentication, real-time data from Supabase, and
// provides a user-friendly interface to log reps and track progress.

// --- Supabase Client Initialization ---
// IMPORTANT: Secrets are now loaded from environment variables
// These MUST be prefixed with NEXT_PUBLIC_ to be available on the client-side
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// --- Embedded Header Component ---
const navLinks = [
  { href: "/", label: "🏠 Home", hoverColor: "hover:bg-emerald-500" },
  { href: "/rewire", label: "🔥 7-Day Challenge", hoverColor: "hover:bg-amber-400" },
  { href: "/about", label: "👤 About Us", hoverColor: "hover:bg-lime-400" },
  { href: "/visualizer", label: "🧬 Visualizer", hoverColor: "hover:bg-cyan-500" },
  { href: "/coach", label: "🧠 Coach", hoverColor: "hover:bg-pink-400" },
  { href: "/community", label: "🤝 Myelination", hoverColor: "hover:bg-rose-400" },
  { href: "/dashboard", label: "📈 Dashboard", hoverColor: "hover:bg-blue-400" },
];

const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <header className="bg-gray-900 text-white text-center py-12 px-4">
      <h1 className="text-4xl font-bold">{title}</h1>
      {subtitle && <p className="text-lg mt-2 max-w-xl mx-auto">{subtitle}</p>}
      <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        {navLinks.map(({ href, label, hoverColor }) => (
          <Link key={href} href={href} legacyBehavior>
            <a
              className={`
                px-4 py-2 rounded-full bg-gray-800 text-white
                ${hoverColor} hover:text-black
                transition-all duration-300 shadow-md
                transform hover:-translate-y-1 hover:scale-105
              `}
            >
              {label}
            </a>
          </Link>
        ))}
      </nav>
    </header>
  );
};

// --- Embedded Footer Component ---
const Footer = () => {
  return (
    <footer className="text-center p-8 bg-gray-900 text-white text-sm">
      <div className="space-y-2 mb-4">
        <p className="text-gray-400 mt-2">
          Special thanks to Matt Stewart — your belief helped light this path.
        </p>
        <p>
          <span role="img" aria-label="brain emoji">🧠</span> Designed to wire greatness into your day <span role="img" aria-label="brain emoji">🧠</span>
        </p>
      </div>
      <div className="space-y-2 mb-4">
        <p>
          © 2025 MyelinMap.com Made with <span role="img" aria-label="blue heart emoji">💙</span> in Michigan · Powered by Quantum Step
          Consultants LLC
        </p>
        <p>
          <Link href="/legalpage" legacyBehavior>
            <a className="underline hover:text-blue-300">
              Privacy Policy & Terms
            </a>
          </Link>
        </p>
      </div>
      <div className="flex justify-center items-center gap-2">
        <span className="text-gray-400">Join our journey</span>
        <a
          href="https://www.youtube.com/@myelinmap"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition"
          aria-label="YouTube Channel"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-red-500"
          >
            <path d="M19.615 3.184c-1.007-.372-5.615-.372-5.615-.372s-4.608 0-5.615.372a3.21 3.21 0 0 0-2.262 2.262c-.373 1.007-.373 3.108-.373 3.108s0 2.101.373 3.108a3.21 3.21 0 0 0 2.262 2.262c1.007.372 5.615.372 5.615.372s4.608 0 5.615-.372a3.21 3.21 0 0 0 2.262-2.262c.373-1.007.373-3.108.373-3.108s0-2.101-.373-3.108a3.21 3.21 0 0 0-2.262-2.262zm-10.615 8.816v-5l5 2.5-5 2.5z" />
          </svg>
        </a>
      </div>
    </footer>
  );
};


// --- Main Dashboard Component ---
export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  // Corrected the type for last_rep
  const [userData, setUserData] = useState<{ reps: number; last_rep: string | null }>({ reps: 0, last_rep: null });
  const [loading, setLoading] = useState(false);

  // Initialize the session listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Subscribe to user data from Supabase in real-time
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        let { data, error } = await supabase
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
          if (!insertError) {
            setUserData(initialData);
          }
        } else if (!error) {
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
            // Updated to be more type-safe
            setUserData(prevData => ({ ...prevData, ...payload.new }));
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [user]);

  // Log a new rep to Supabase
  const logRep = async () => {
    if (!user) return;
    setLoading(true);

    const newRepCount = userData.reps + 1;
    const now = new Date();

    const { error } = await supabase
      .from("user_reps")
      .update({ reps: newRepCount, last_rep: now.toISOString() })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error logging rep:", error);
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    if (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
    setUser(null);
    setUserData({ reps: 0, last_rep: null });
  };

  const repText = userData.reps === 1 ? "rep" : "reps";

  return (
    <>
      <Head>
        <title>Dashboard | Myelin Map</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header title="Your Dashboard 📈" subtitle="A visual record of your comeback" />

      <main className="bg-gray-900 text-white min-h-screen">
        <div className="max-w-4xl mx-auto p-6 space-y-10">
          
          {user ? (
            <>
              <section className="bg-gray-800 rounded-3xl p-8 shadow-2xl text-center border border-white/10">
                <h1 className="text-3xl font-bold text-emerald-400 mb-2">
                  Welcome Back, Resilient Soul.
                </h1>
                <p className="text-gray-400 text-lg mb-6">
                  Your user ID is: <span className="font-mono text-sm text-yellow-300 break-all">{user.id}</span>
                </p>
                
                <div className="flex flex-col sm:flex-row justify-around items-center gap-6">
                  <div className="bg-gray-700 p-6 rounded-2xl shadow-inner">
                    <p className="text-sm text-gray-400">Total Reps Logged</p>
                    <p className="text-6xl font-extrabold text-white mt-2">{userData.reps}</p>
                  </div>
                  <div className="bg-gray-700 p-6 rounded-2xl shadow-inner">
                    <p className="text-sm text-gray-400">Last Rep Logged</p>
                    <p className="text-xl font-bold text-white mt-2">
                      {userData.last_rep ? new Date(userData.last_rep).toLocaleDateString() : "Never"}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="mt-8 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </section>

              <section className="bg-emerald-600 rounded-3xl p-8 shadow-2xl text-center border border-white/10">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Log Your Rep for Today
                </h2>
                <p className="text-lg text-emerald-100 mb-6">
                  This is the single action that builds myelin and rewires your brain.
                </p>
                <button
                  onClick={logRep}
                  disabled={loading}
                  className="bg-white text-emerald-600 px-8 py-4 rounded-full font-extrabold text-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Logging..." : "Log Rep"}
                </button>
              </section>
            </>
          ) : (
            <section className="bg-gray-800 rounded-3xl p-8 shadow-2xl text-center border border-white/10">
              <h1 className="text-3xl font-bold text-emerald-400 mb-2">
                Sign In to Your Dashboard
              </h1>
              <p className="text-gray-400 text-lg mb-6">
                Your journey of a thousand reps begins with one click.
              </p>
              <button
                onClick={handleLogin}
                className="bg-emerald-500 text-white px-8 py-4 rounded-full font-extrabold text-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Sign In with GitHub
              </button>
            </section>
          )}

          <section className="text-center text-gray-300">
            <p className="italic">
              “You are not broken. You are becoming.”
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
// --- End of Dashboard Component ---