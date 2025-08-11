/* eslint-disable react/no-unescaped-entities */

// pages/coach.tsx - Magical & Classy Redesign (safe JSX fixes)
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
    { role: "assistant", content: "Welcome to your sanctuary of growth. How does your heart feel today?" },
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
      "Core tone: brief, warm, non-judgmental. Empower, don't pressure. Tiny steps > perfection.",
      "K.I.N.D. method: Knowledge, Identification, Neural Rewiring, Daily Kindness.",
      "If user expresses shame/relapse, normalize and suggest one tiny rep.",
      "Offer specific, 1–2 sentence suggestions; avoid long lectures.",
      `User's active habit: ${name} (wrap size ${wrap}). Total reps logged: ${reps}.`,
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
      if (!res.ok || !data?.message) throw new Error("Invalid response from AI");
      setChatLog([...withUser, { role: "assistant", content: data.message as string }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatLog([
        ...withUser,
        {
          role: "assistant",
          content:
            "The Coach hit a snag and is taking a breath. Try again shortly — you didn't do anything wrong.",
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
    const text = chatLog.map((m) => `${m.role === "user" ? "You" : "Coach"}: ${m.content}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      alert("Transcript copied to clipboard.");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const downloadTranscript = () => {
    const text = chatLog.map((m) => `${m.role === "user" ? "You" : "Coach"}: ${m.content}`).join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coach-session-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const logTinyRep = async () => {
    if (!activeHabit || !user) return;

    try {
      const { error } = await supabase
        .from("rep_events")
        .insert({ habit_id: activeHabit.id, user_id: user.id });

      if (error) {
        console.error("Error logging rep:", error);
        return;
      }

      const nextCount = habitRepCount + 1;
      setHabitRepCount((prev) => prev + 1);
      setJustCelebrated(true);
      setTimeout(() => setJustCelebrated(false), 3000);

      setChatLog((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Beautiful! That's rep #${nextCount} for "${activeHabit.name}". You're literally rewiring your brain right now. 🌱✨`,
        },
      ]);
    } catch (error) {
      console.error("Error logging rep:", error);
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

      {/* Magical background with subtle animations */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-emerald-900/20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)] animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <main className="relative z-10 text-white px-4 sm:px-6 py-8 sm:py-16 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Mobile-first responsive grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Left sidebar */}
            <aside className="lg:col-span-2 space-y-6">
              {/* Welcome */}
              <section className="group rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 to-black/20 p-6 backdrop-blur-sm hover:border-emerald-400/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">🌟</div>
                  <h2 className="text-xl font-semibold text-emerald-300">What the Coach is</h2>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Your Coach is a steady, shame-free companion. A place to tell the truth, practice kindness,
                  and turn hard moments into one tiny, doable rep. You don't have to be "okay" to show up.
                </p>
                <div className="bg-amber-500/10 border border-amber-400/20 rounded-lg p-3">
                  <p className="text-amber-200 text-sm">
                    💡 This space is supportive, not diagnostic. If you're in crisis or unsafe, please contact local
                    emergency services or a licensed professional.
                  </p>
                </div>
              </section>

              {/* How Coach helps */}
              <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/20 to-black/20 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">🎯</div>
                  <h3 className="font-semibold text-blue-300">How the Coach helps</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-1">•</span>
                    <span>
                      Transform cues & cravings into <em className="text-emerald-300">tiny reps</em>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-1">•</span>
                    <span>Rehearse a simple cue → action → reward plan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-1">•</span>
                    <span>Replace harsh self-talk with compassionate truth</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-1">•</span>
                    <span>Plan tomorrow's smallest next step</span>
                  </li>
                </ul>
              </section>

              {/* Quick prompts */}
              <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-900/20 to-black/20 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">💭</div>
                  <h3 className="font-semibold text-violet-300">Quick prompts</h3>
                </div>
                <div className="grid gap-3">
                  {[
                    "I'm overwhelmed. Help me find one tiny step.",
                    "Can you help me plan a 2-minute habit after coffee?",
                    "I slipped. How do I restart without shame?",
                    "I feel anxious. Can we do a 60-second reset?",
                    "Help me create a cue-action-reward for evenings.",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => quickAsk(q)}
                      className="text-left rounded-xl px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-400/30 text-gray-200 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/10"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </section>

              {/* Mood check-in */}
              <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-900/20 to-black/20 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">🎭</div>
                  <h3 className="font-semibold text-amber-300">Mood check-in</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["anxious", "tired", "hopeful", "stuck", "proud", "craving"].map((m) => (
                    <button
                      key={m}
                      onClick={() => addMood(m)}
                      className="rounded-full px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 hover:border-amber-300/50 text-amber-200 text-sm transition-all duration-200 hover:scale-105 hover:shadow-md hover:shadow-amber-500/20"
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  💡 Naming a feeling can ease it and bring your prefrontal cortex back online.
                </p>
              </section>

              {/* Active habit */}
              <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-900/20 to-black/20 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">🌱</div>
                  <h3 className="font-semibold text-emerald-300">Active habit</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Choose your focus:</label>
                    <select
                      value={activeHabitId ?? ""}
                      onChange={(e) => setActiveHabitId(e.target.value)}
                      className="w-full rounded-xl bg-gray-900/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-300/60 transition-all"
                      aria-label="Choose your active habit"
                      title="Select which habit to focus on"
                    >
                      {habits.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} (wrap {h.wrap_size})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-xl p-4">
                    <div className="text-gray-300 text-sm mb-3">Total reps logged for this habit:</div>
                    <div className="text-3xl font-bold text-emerald-300 mb-4">{habitRepCount}</div>
                    <button
                      onClick={logTinyRep}
                      disabled={!activeHabit || loading}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 px-4 py-3 rounded-xl disabled:opacity-50 font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/20 disabled:hover:scale-100"
                    >
                      ✨ Log a tiny rep
                    </button>
                  </div>

                  {justCelebrated && (
                    <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded-xl p-4 animate-fade-in">
                      <div className="text-emerald-300 text-center font-medium">🎉 Beautiful! You're wiring change. 🌱</div>
                    </div>
                  )}
                </div>
              </section>

              {/* K.I.N.D. philosophy */}
              <section className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-900/30 to-teal-900/20 p-6 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-4xl mb-3">🤝</div>
                  <p className="text-gray-200 leading-relaxed">
                    <span className="font-bold text-emerald-300 text-lg">K.I.N.D.</span>
                    <br />
                    <span className="text-sm text-emerald-200">Knowledge • Identification • Neural Rewiring • Daily Kindness</span>
                  </p>
                  <div className="mt-4 text-sm text-gray-300 italic">
                    The magic is in the reps, not perfection.
                    <br />
                    You don't have to win the day — you just have to return.
                  </div>
                </div>
              </section>
            </aside>

            {/* Right side - Chat interface */}
            <div className="lg:col-span-3 space-y-6">
              {/* Enhanced chat area */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm overflow-hidden">
                <div
                  className="p-6 h-[500px] overflow-y-auto scrollbar-thin"
                  role="log"
                  aria-live="polite"
                  aria-relevant="additions"
                >
                  {chatLog.map((msg, i) => (
                    <div
                      key={i}
                      className={`mb-6 animate-fade-in ${msg.role === "user" ? "flex justify-end" : "flex justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-blue-600/80 to-blue-700/80 text-white ml-4"
                            : "bg-gradient-to-br from-emerald-600/20 to-emerald-700/20 border border-emerald-400/20 text-emerald-100 mr-4"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-lg shrink-0">{msg.role === "user" ? "👤" : "🧘"}</div>
                          <div>
                            <div className="font-medium text-sm mb-1 opacity-80">{msg.role === "user" ? "You" : "Coach"}</div>
                            <div className="leading-relaxed">{msg.content}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start mb-6 animate-fade-in">
                      <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-gradient-to-br from-emerald-600/20 to-emerald-700/20 border border-emerald-400/20 text-emerald-100 mr-4">
                        <div className="flex items-start gap-3">
                          <div className="text-lg">🧘</div>
                          <div>
                            <div className="font-medium text-sm mb-1 opacity-80">Coach</div>
                            <div className="flex items-center gap-1">
                              <span>Thinking</span>
                              <div className="flex gap-1 ml-2">
                                <div className="w-2 h-2 rounded-full animate-bounce bg-emerald-400" />
                                <div className="w-2 h-2 rounded-full animate-bounce bg-emerald-400" style={{ animationDelay: "0.1s" }} />
                                <div className="w-2 h-2 rounded-full animate-bounce bg-emerald-400" style={{ animationDelay: "0.2s" }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* Enhanced message composer */}
              <section
                className="rounded-2xl border border-emerald-400/25 bg-gradient-to-br from-emerald-900/40 to-teal-900/30 p-6 shadow-2xl shadow-emerald-900/20 ring-1 ring-emerald-300/10 backdrop-blur-sm"
                aria-label="Message composer"
              >
                {/* Floating Coach Emoji */}
                <div className="flex justify-center mb-4">
                  <div className="text-6xl animate-float drop-shadow-lg select-none" aria-hidden="true">
                    🧘
                  </div>
                </div>

                {/* Input area */}
                <div className="space-y-4">
                  <div className="flex items-end gap-4">
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
                      placeholder="Tell the Coach how you're feeling, or what's hard right now… (Shift+Enter for a new line)"
                      rows={3}
                      className="flex-1 px-4 py-3 rounded-xl bg-emerald-800/30 text-emerald-50 placeholder-emerald-100/60 border border-emerald-400/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-300/60 resize-none transition-all duration-200"
                      disabled={loading}
                      aria-label="Message to Coach"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={loading || !userInput.trim()}
                      className="shrink-0 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 px-6 py-3 rounded-xl disabled:opacity-50 font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20 disabled:hover:scale-100"
                    >
                      {loading ? "✨" : "Send"}
                    </button>
                  </div>
                  <p className="text-xs text-emerald-100/80 text-center">Enter to send • Shift+Enter for newline</p>
                </div>
              </section>

              {/* Utilities */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={clearChat}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm transition-all duration-200 hover:scale-105"
                >
                  🗑️ Clear
                </button>
                <button
                  onClick={copyTranscript}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm transition-all duration-200 hover:scale-105"
                >
                  📋 Copy transcript
                </button>
                <button
                  onClick={downloadTranscript}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm transition-all duration-200 hover:scale-105"
                >
                  💾 Download .txt
                </button>
              </div>

              {/* Safety note */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs">
                  <span>⚠️</span>
                  <span>Supportive guidance, not medical advice. Crisis? Contact emergency services.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Enhanced animations and styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; animation-delay: -2s; }

        /* Scrollbar styling (no slash-classes) */
        .scrollbar-thin { scrollbar-width: thin; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(16,185,129,0.2);
          border-radius: 9999px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(16,185,129,0.3);
        }
      `}</style>
    </>
  );
}
