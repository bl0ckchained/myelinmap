// pages/coach.tsx

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

type ChatMsg = { role: "user" | "assistant" | "system"; content: string };

type HabitRow = {
  id: string;
  user_id: string;
  name: string;
  goal_reps: number;
  wrap_size: number;
  created_at: string;
};

export default function Coach() {
  // ===== UI / Chat state =====
  const [userInput, setUserInput] = useState("");
  const [chatLog, setChatLog] = useState<ChatMsg[]>([
    { role: "assistant", content: "Welcome back. How are you feeling right now?" },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ===== Auth / Habit context =====
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<HabitRow[]>([]);
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);
  const [activeHabit, setActiveHabit] = useState<HabitRow | null>(null);
  const [habitRepCount, setHabitRepCount] = useState<number>(0);
  const [justCelebrated, setJustCelebrated] = useState(false);

  // ===== Helpers =====
  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  const focusInput = () => setTimeout(() => inputRef.current?.focus(), 50);

  // Persist chat locally
  useEffect(() => {
    try {
      const saved = localStorage.getItem("coach_chatlog");
      if (saved) setChatLog(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("coach_chatlog", JSON.stringify(chatLog));
    } catch {}
  }, [chatLog]);

  useEffect(() => {
    scrollToBottom();
  }, [chatLog, loading]);

  // ===== ✨ NEW HOOK FOR AUTO-RESIZING TEXTAREA =====
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height to recalculate
      const scrollHeight = textarea.scrollHeight;
      // Set a max height (e.g., 200px) to prevent it from getting too large
      textarea.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [userInput]);

  // ===== Auth & Habits from Supabase =====
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("id, user_id, name, goal_reps, wrap_size, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (error) {
        console.error("load habits error:", error);
        return;
      }
      if (!data || data.length === 0) {
        // create a gentle default
        const { data: created, error: insErr } = await supabase
          .from("habits")
          .insert({ user_id: user.id, name: "Breath reset", goal_reps: 21, wrap_size: 7 })
          .select()
          .single();
        if (!insErr && created) {
          setHabits([created as HabitRow]);
          setActiveHabitId((created as HabitRow).id);
        }
      } else {
        setHabits(data as HabitRow[]);
        setActiveHabitId(data[0].id);
      }
    })();
  }, [user]);

  // Track active habit + rep count
  useEffect(() => {
    const h = habits.find((x) => x.id === activeHabitId) ?? null;
    setActiveHabit(h ?? null);
    if (!h) return;

    (async () => {
      const { count, error } = await supabase
        .from("rep_events")
        .select("id", { count: "exact", head: true })
        .eq("habit_id", h.id);
      if (error) {
        console.error("rep_events count error:", error);
        return;
      }
      setHabitRepCount(typeof count === "number" ? count : 0);
    })();
  }, [habits, activeHabitId]);

  // ===== System context for the Coach persona =====
  const systemContext = (() => {
    const name = activeHabit?.name ?? "your tiny habit";
    const wrap = activeHabit?.wrap_size ?? 7;
    const reps = habitRepCount;
    return [
      "You are Myelin Coach — a calm, compassionate, trauma-informed helper.",
      "Core tone: brief, warm, non-judgmental. Empower, don’t pressure. Tiny steps > perfection.",
      "K.I.N.D. method: Knowledge, Identification, Neural Rewiring, Daily Kindness.",
      "If user expresses shame/relapse, normalize and suggest one tiny rep.",
      "Offer specific, 1–2 sentence suggestions; avoid long lectures.",
      `User’s active habit: ${name} (wrap size ${wrap}). Total reps logged: ${reps}.`,
      "Suggest implementation intentions (After [cue], I will [tiny action]).",
    ].join(" ");
  })();

  // ===== Actions =====
  const sendMessage = async () => {
    const text = userInput.trim();
    if (!text || loading) return;
    const withUser = [...chatLog, { role: "user", content: text } as ChatMsg];
    setChatLog(withUser);
    setUserInput("");
    setLoading(true);

    try {
      const payload: ChatMsg[] = [{ role: "system", content: systemContext }, ...withUser];
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: payload }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data.message) throw new Error("Invalid response from AI");
      setChatLog([...withUser, { role: "assistant", content: data.message as string }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatLog([
        ...withUser,
        {
          role: "assistant",
          content:
            "The Coach hit a snag and is taking a breath. Try again shortly — you didn’t do anything wrong.",
        },
      ]);
    } finally {
      setLoading(false);
      focusInput();
    }
  };

  // --- No changes to any of your other helper functions ---
  const quickAsk = (text: string) => {
    setUserInput(text);
    focusInput();
  };

  const addMood = (mood: string) => {
    const base = userInput.trim();
    setUserInput(base ? `${base} (${mood})` : `I'm feeling ${mood}.`);
    focusInput();
  };

  const clearChat = () => {
    setChatLog([{ role: "assistant", content: "Reset complete. What would be supportive right now?" }]);
    setUserInput("");
    focusInput();
  };

  const copyTranscript = async () => {
    const text = chatLog.map(m => `${m.role === "user" ? "You" : "Coach"}: ${m.content}`).join("\n");
    await navigator.clipboard.writeText(text);
    alert("Transcript copied to clipboard.");
  };

  const downloadTranscript = () => {
    const text = chatLog.map(m => `${m.role === "user" ? "You" : "Coach"}: ${m.content}`).join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `myelin-coach-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const logTinyRep = async () => {
    if (!user || !activeHabit) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("rep_events")
        .insert({ user_id: user.id, habit_id: activeHabit.id });
      if (error) throw error;

      setHabitRepCount((c) => c + 1);
      setJustCelebrated(true);
      setTimeout(() => setJustCelebrated(false), 900);

      setChatLog((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            `Logged one tiny rep for “${activeHabit.name}.” That’s how wiring changes — small, consistent steps. Want to plan the next cue?`,
        },
      ]);
    } catch (e) {
      console.error("log rep error:", e);
      setChatLog((prev) => [
        ...prev,
        { role: "assistant", content: "Couldn’t log a rep just now. Try again in a moment." },
      ]);
    } finally {
      setLoading(false);
      focusInput();
    }
  };

  return (
    <>
      <Head>
        <title>Coach | Myelin Map</title>
        <meta
          name="description"
          content="Chat with your calm, kind Myelin Coach. Get supportive prompts, log tiny reps, and plan your next small step."
        />
      </Head>

      <Header title="Mental Health Coach 🤝" subtitle="Always in your corner — kind, practical, here." />

      {/* --- NO CHANGES TO THE MAIN LAYOUT OR SIDEBAR --- */}
      <main className="bg-gray-900 text-white px-6 py-16 min-h-screen">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-6">
          <aside className="md:col-span-2 space-y-4">{/* ... your unchanged aside content ... */}</aside>

          <div className="md:col-span-3 flex flex-col space-y-4">
            {/* Chat Area - no changes */}
            <div
              className="bg-black/20 p-4 rounded-md h-[480px] overflow-y-auto border border-white/10"
              role="log"
            >
              {/* ... your unchanged chat log mapping ... */}
              <div ref={chatEndRef} />
            </div>

            {/* --- 🎨 START OF REFINED COMPOSER --- */}
            <section
              className="rounded-xl border border-purple-500/30 bg-gray-900/50 p-4 shadow-lg shadow-purple-900/20 ring-1 ring-purple-400/20 backdrop-blur-sm"
              aria-label="Message composer"
            >
              <div className="flex justify-center mb-2">
                <div className="text-6xl animate-float-gentle drop-shadow-md select-none" aria-hidden>
                  🧘
                </div>
              </div>
              
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Share what's on your mind..."
                  rows={1}
                  className="w-full p-4 pr-16 text-lg text-gray-200 bg-gray-800/80 rounded-full border border-gray-700 placeholder-gray-400 resize-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                  disabled={loading}
                  aria-label="Message to Coach"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !userInput.trim()}
                  aria-label="Send message"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full transform transition-all duration-300 hover:bg-purple-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-gray-600 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.54l3.852-1.101a.75.75 0 00-.54-1.392L3.105 2.29zM4.949 14.59l-1.414 4.95a.75.75 0 00.95.826l4.949-1.414a.75.75 0 00.54-.95L6.223 14.2a.75.75 0 00-1.274.39zM14.2 6.223l2.803-3.852a.75.75 0 00-1.392-.54L11.8 5.68a.75.75 0 00.39 1.274l2.01-.574zM14.319 16.895l-4.95-1.414a.75.75 0 00-.95.54l-1.101 3.852a.75.75 0 00.826.95l4.949-1.414a.75.75 0 00.54-.95L14.32 16.895z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-500 text-center">
                Enter to send • Shift+Enter for newline
              </p>
            </section>
            {/* --- 🎨 END OF REFINED COMPOSER --- */}

            {/* Utilities - no changes */}
            <div className="flex flex-wrap gap-2 text-sm">
                {/* ... your unchanged utility buttons ... */}
            </div>

            {/* Safety Note - no changes */}
            <div className="text-xs text-gray-400">
                {/* ... your unchanged safety note ... */}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Animations - added one new class for the emoji */}
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float-gentle { 0% { transform: translateY(0px); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0px); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-float-gentle { animation: float-gentle 5s ease-in-out infinite; }
      `}</style>
    </>
  );
}