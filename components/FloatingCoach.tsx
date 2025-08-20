import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../styles/Dashboard.module.css";

type ChatMsg = { role: "user" | "assistant" | "system"; content: string };
type HabitCtx = { name: string; wrap_size: number } | null;

type Props = {
  variant?: "floating" | "embedded";
  startOpen?: boolean;
  storageKey?: string;
  activeHabit?: HabitCtx;
  habitRepCount?: number;
  systemContextExtra?: string;
  height?: number;
  className?: string;
  onLogRep?: () => void | Promise<void>;
  title?: string;
};

export default function FloatingCoach({
  variant = "floating",
  startOpen = false,
  storageKey = "coach_chatlog",
  activeHabit = null,
  habitRepCount = 0,
  systemContextExtra = "",
  height = 260,
  className,
  onLogRep,
  title,
}: Props) {
  const [open, setOpen] = useState(startOpen);
  const [chatLog, setChatLog] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Hey there. I’m your Myelin Coach, here for you no matter what’s on your mind. What’s one thing you’d like to explore today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollBoxRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Build system context dynamically
  const systemContext = useMemo(() => {
    const name = activeHabit?.name ?? "your tiny habit";
    const wrap = activeHabit?.wrap_size ?? 7;
    const reps = habitRepCount ?? 0;

    return [
      "You are Myelin Coach — a calm, compassionate, trauma-aware helper for any question or challenge.",
      "Tone: brief, warm, non-judgmental. Empower, don’t pressure. Tiny steps > perfection.",
      "K.I.N.D. method: Knowledge, Identification, Neural Rewiring, Daily Kindness.",
      "Support users with any topic: habits, emotions, grounding, or general advice.",
      "If the user expresses shame or relapse, normalize it and suggest one tiny, actionable step.",
      "Offer specific, 1–2 sentence suggestions; avoid long lectures.",
      `Active habit: ${name} (wrap ${wrap}). Total reps: ${reps}.`,
      "Suggest implementation intentions (After [cue], I will [tiny action]) when relevant.",
      systemContextExtra.trim(),
    ]
      .filter(Boolean)
      .join(" ");
  }, [activeHabit, habitRepCount, systemContextExtra]);

  // Load persistent chat
  useEffect(() => {
    try {
      const saved =
        typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMsg[];
        if (
          Array.isArray(parsed) &&
          parsed.every(
            (m) => typeof m?.role === "string" && typeof m?.content === "string"
          )
        ) {
          setChatLog(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  // Persist chat
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(chatLog));
    } catch {
      // ignore
    }
  }, [chatLog, storageKey]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (variant === "floating" && !open) return;
    const el = scrollBoxRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [chatLog, loading, open, variant]);

  // Focus textarea when floating window opens
  useEffect(() => {
    if (variant === "floating" && open) {
      textareaRef.current?.focus();
    }
  }, [open, variant]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newLog: ChatMsg[] = [...chatLog, { role: "user", content: text }];
    setChatLog(newLog);
    setInput("");
    setLoading(true);

    try {
      const messages: ChatMsg[] = [{ role: "system", content: systemContext }, ...newLog];
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const data = await res.json();
      if (!res.ok || !data?.message) throw new Error("Invalid AI response");
      setChatLog([
        ...newLog,
        { role: "assistant", content: String(data.message) },
      ]);
    } catch (err) {
      console.error("Coach error:", err);
      setChatLog([
        ...newLog,
        {
          role: "assistant",
          content:
            "I hit a small bump, but I’m still here for you. Try asking again, or let’s find one tiny step to take right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickInsert = (text: string) =>
    setInput((prev) => (prev ? `${prev} ${text}` : text));

  const ChatWindow = (
    <div className={`${styles.coachContainer} ${className || ""} ${styles.fadeIn}`}>
      {/* Header */}
      <div className={styles.coachHeader}>
        <span className={styles.coachIcon} aria-hidden>🧘</span>
        <strong aria-live="polite">{title?.trim() || "Coach"}</strong>
        <div className={styles.coachActions}>
          {onLogRep && (
            <button
              onClick={() => void onLogRep()}
              title="Log a rep"
              aria-label="Log a habit repetition"
              className={styles.coachChip}
            >
              ⚡ Log rep
            </button>
          )}
          <button
            onClick={() =>
              quickInsert("I’m feeling stuck. What’s one small thing I can do?")
            }
            title="Ask for a small step"
            className={styles.coachChip}
          >
            Feeling stuck
          </button>
          <button
            onClick={() =>
              quickInsert("Can you suggest a 2-minute grounding exercise?")
            }
            title="Ask for a grounding tip"
            className={styles.coachChip}
          >
            Grounding tip
          </button>
          <button
            onClick={() =>
              quickInsert("Can you help me plan a 2-minute habit after coffee?")
            }
            title="Plan after coffee"
            className={styles.coachChip}
          >
            After coffee
          </button>
        </div>
      </div>

      {/* Scrollable log */}
      <div
        ref={scrollBoxRef}
        className={styles.coachLog}
        role="log"
        aria-live="assertive"
        aria-relevant="additions"
      >
        {chatLog.map((m, i) => (
          <div
            key={i}
            className={`${styles.coachMessage} ${
              m.role === "user" ? styles.userMessage : styles.assistantMessage
            } ${styles.fadeIn}`}
          >
            <div className={styles.messageLabel}>
              {m.role === "user" ? "You" : "Coach"}
            </div>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className={styles.coachLoading}>
            <span>Coach is thinking</span>
            <span aria-hidden> ···</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Composer */}
      <div className={styles.coachComposer}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={2}
          placeholder="Tell the Coach what's on your mind… (Shift+Enter for newline)"
          className={styles.coachInput}
          disabled={loading}
          aria-label="Message Myelin Coach"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className={styles.coachSendButton}
          aria-label="Send message to Coach"
        >
          {loading ? "…" : "Send"}
        </button>
      </div>

      {/* Utilities */}
      <div className={styles.coachUtilities}>
        <button
          onClick={() => {
            const text = chatLog
              .map(
                (m) => `${m.role === "user" ? "You" : "Coach"}: ${m.content}`
              )
              .join("\n");
            navigator.clipboard.writeText(text).catch(() => {});
          }}
          className={styles.coachUtilButton}
          aria-label="Copy conversation"
        >
          Copy
        </button>
        <button
          onClick={() => {
            if (!confirm("Clear conversation?")) return;
            setChatLog([
              {
                role: "assistant",
                content: "Reset complete. What feels supportive now?",
              },
            ]);
          }}
          className={styles.coachUtilButton}
          aria-label="Clear conversation"
        >
          Clear
        </button>
      </div>
    </div>
  );

  if (variant === "embedded") {
    return <>{ChatWindow}</>;
  }

  return (
    <>
      <div className={styles.coachFab}>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle Myelin Coach"
          className={`${styles.coachToggle} ${styles.slideIn}`}
        >
          <span className={styles.coachIcon} aria-hidden>🧘</span>
        </button>
        {open && <div className={styles.coachPopover}>{ChatWindow}</div>}
      </div>
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .${styles.coachToggle} {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}