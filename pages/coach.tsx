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
  const [habitRepCount, setHabitRepCount] = useState<number>(0); // total events for active habit (rep_events count)
  const [justCelebrated, setJustCelebrated] = useState(false);   // quick UI confetti-ish note

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
    if (!text) return;
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

  // Tiny rep directly from Coach
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

      // gentle celebration message
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

      <main className="bg-gray-900 text-white px-6 py-16 min-h-screen">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-6">
          {/* Left rail: Explainer / Kind framing */}
          <aside className="md:col-span-2 space-y-4">
            <section className="rounded-lg border border-white/10 bg-black/20 p-4">
              <h2 className="text-xl font-semibold text-emerald-300">What the Coach is</h2>
              <p className="mt-2 text-gray-300">
                Your Coach is a steady, shame-free companion. A place to tell the truth, practice kindness,
                and turn hard moments into one tiny, doable rep. You don’t have to be “okay” to show up.
              </p>
              <p className="mt-2 text-gray-400 text-sm">
                This space is supportive, not diagnostic. If you’re in crisis or unsafe, please contact local
                emergency services or a licensed professional.
              </p>
            </section>

            <section className="rounded-lg border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-blue-300">How the Coach helps</h3>
              <ul className="mt-2 list-disc pl-5 text-gray-300 space-y-1">
                <li>Transform cues & cravings into <em>tiny reps</em>.</li>
                <li>Rehearse a simple cue → action → reward plan.</li>
                <li>Replace harsh self-talk with compassionate truth.</li>
                <li>Plan tomorrow’s smallest next step.</li>
              </ul>
            </section>

            <section className="rounded-lg border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-violet-300">Quick prompts</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "I’m overwhelmed. Help me find one tiny step.",
                  "Can you help me plan a 2-minute habit after coffee?",
                  "I slipped. How do I restart without shame?",
                  "I feel anxious. Can we do a 60-second reset?",
                  "Help me create a cue-action-reward for evenings.",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => quickAsk(q)}
                    className="text-left rounded-md px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-amber-300">Mood check-in</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {["anxious", "tired", "hopeful", "stuck", "proud", "craving"].map((m) => (
                  <button
                    key={m}
                    onClick={() => addMood(m)}
                    className="rounded-full px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-200 text-sm"
                  >
                    {m}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Naming a feeling can ease it and bring your prefrontal cortex back online.
              </p>
            </section>

            <section className="rounded-lg border border-white/10 bg-black/20 p-4">
              <h3 className="font-semibold text-emerald-300">Active habit</h3>
              <div className="mt-2">
                <label className="text-sm text-gray-400">Choose:</label>
                <select
                  value={activeHabitId ?? ""}
                  onChange={(e) => setActiveHabitId(e.target.value)}
                  className="mt-1 w-full rounded-md bg-gray-900 border border-white/10 px-3 py-2"
                >
                  {habits.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} (wrap {h.wrap_size})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 text-gray-300 text-sm">
                Total reps logged for this habit:{" "}
                <span className="font-semibold text-emerald-300">{habitRepCount}</span>
              </div>
              <button
                onClick={logTinyRep}
                disabled={!activeHabit || loading}
                className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-md disabled:opacity-50"
              >
                Log a tiny rep
              </button>
              {justCelebrated && (
                <div className="mt-2 text-emerald-300 text-sm">Beautiful. You’re wiring change. 🌱</div>
              )}
            </section>

            <section className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-gray-200">
                <span className="font-semibold text-emerald-300">K.I.N.D.</span> — Knowledge, Identification,
                Neural Rewiring, Daily Kindness. The magic is in the reps, not perfection. You don’t have to
                win the day — you just have to return.
              </p>
            </section>
          </aside>

          {/* Right: Chat */}
          <div className="md:col-span-3 space-y-4">
            {/* Chat Area */}
            <div
              className="bg-black/20 p-4 rounded-md h-[480px] overflow-y-auto border border-white/10"
              role="log"
              aria-live="polite"
              aria-relevant="additions"
            >
              {chatLog.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-3 animate-fade-in ${
                    msg.role === "user" ? "text-right" : "text-left text-emerald-300"
                  }`}
                >
                  <p>
                    <span className="font-bold">{msg.role === "user" ? "You" : "Coach"}:</span>{" "}
                    <span className={msg.role === "user" ? "text-gray-200" : "text-emerald-200"}>
                      {msg.content}
                    </span>
                  </p>
                </div>
              ))}

              {loading && (
                <div className="text-left text-emerald-300 animate-fade-in">
                  <p>
                    <span className="font-bold">Coach:</span>{" "}
                    <span className="inline-flex gap-1 animate-pulse" aria-hidden>
                      <span>.</span><span>.</span><span>.</span>
                    </span>
                  </p>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Composer: Floating guide + big emerald input */}
            <section
              className="rounded-xl border border-emerald-400/25 bg-gradient-to-br from-emerald-900/40 to-teal-900/30 p-4 shadow-lg shadow-emerald-900/30 ring-1 ring-emerald-300/10 backdrop-blur-sm"
              aria-label="Message composer"
            >
              {/* Floating Coach Emoji above input */}
              <div className="flex justify-center mb-2">
                <div className="text-6xl animate-float drop-shadow-md select-none" aria-hidden>
                  🧘
                </div>
              </div>

              {/* Big textarea + Send */}
              <div className="flex items-end gap-3">
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
                  placeholder="Tell the Coach how you’re feeling, or what’s hard right now… (Shift+Enter for a new line)"
                  rows={3}
                  className="flex-1 px-4 py-3 rounded-xl bg-emerald-800/30 text-emerald-50 placeholder-emerald-100/60 border border-emerald-400/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-300/60"
                  disabled={loading}
                  aria-label="Message to Coach"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="shrink-0 bg-emerald-600 hover:bg-emerald-700 px-5 py-3 rounded-xl disabled:opacity-50 font-medium"
                >
                  {loading ? "…" : "Send"}
                </button>
              </div>
              <p className="mt-2 text-xs text-emerald-100/80">
                Enter to send • Shift+Enter for newline
              </p>
            </section>

            {/* Utilities */}
            <div className="flex flex-wrap gap-2 text-sm">
              <button
                onClick={clearChat}
                className="px-3 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
              >
                Clear
              </button>
              <button
                onClick={copyTranscript}
                className="px-3 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
              >
                Copy transcript
              </button>
              <button
                onClick={downloadTranscript}
                className="px-3 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
              >
                Download .txt
              </button>
            </div>

            {/* Safety Note */}
            <div className="text-xs text-gray-400">
              Supportive guidance, not medical advice. If you’re in immediate danger or crisis, contact local
              emergency services or a licensed professional.
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0px); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </>
  );
}
