// components/FloatingCoach.tsx
import { useEffect, useMemo, useRef, useState } from "react";

/** Chat message shape (prevents literal -> string widening) */
type ChatMsg = { role: "user" | "assistant" | "system"; content: string };

type HabitCtx = { name: string; wrap_size: number } | null;

type Props = {
  /** "floating" renders the FAB + popover; "embedded" renders a card (great for Dashboard) */
  variant?: "floating" | "embedded";
  /** Start open (only meaningful for floating) */
  startOpen?: boolean;
  /** Key used for localStorage persistence */
  storageKey?: string;
  /** Optional context to personalize suggestions */
  activeHabit?: HabitCtx;
  habitRepCount?: number;
  /** Extra system prompt lines to append */
  systemContextExtra?: string;
  /** Embedded-only: chat viewport height (px) */
  height?: number;
  /** Embedded-only: container className hook */
  className?: string;
  /** Optional callback to log a rep (e.g., increments habit counter) */
  onLogRep?: () => void | Promise<void>;
  /** Optional title for header; defaults to "Coach" */
  title?: string;
};

/** API response shape */
type ChatAPIResponse = { message: string };
const isChatAPIResponse = (x: unknown): x is ChatAPIResponse => {
  if (!x || typeof x !== "object") return false;
  const rec = x as Record<string, unknown>;
  return typeof rec.message === "string";
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
      content: "Welcome. I'm here and on your side. What's present for you right now?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollBoxRef = useRef<HTMLDivElement>(null);

  // Build system context dynamically from habit data
  const systemContext = useMemo(() => {
    const name = activeHabit?.name ?? "your tiny habit";
    const wrap = activeHabit?.wrap_size ?? 7;
    const reps = habitRepCount ?? 0;

    return [
      "You are Myelin Coach — a calm, compassionate, trauma-aware helper.",
      "Tone: brief, warm, non-judgmental. Empower, don't pressure. Tiny steps > perfection.",
      "K.I.N.D. method: Knowledge, Identification, Neural Rewiring, Daily Kindness.",
      "If the user expresses shame or relapse, normalize it and suggest one tiny rep.",
      "Offer specific, 1–2 sentence suggestions; avoid long lectures.",
      `Active habit: ${name} (wrap ${wrap}). Total reps: ${reps}.`,
      "Suggest implementation intentions (After [cue], I will [tiny action]).",
      systemContextExtra.trim(),
    ]
      .filter(Boolean)
      .join(" ");
  }, [activeHabit, habitRepCount, systemContextExtra]);

  // Load persistent chat
  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMsg[];
        if (Array.isArray(parsed) && parsed.every((m) => typeof m?.role === "string" && typeof m?.content === "string")) {
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

  // Auto-scroll to bottom on new messages (only when visible)
  useEffect(() => {
    if (variant === "floating" && !open) return;
    const el = scrollBoxRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [chatLog, loading, open, variant]);

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

      let data: unknown = null;
      try {
        data = await res.json();
      } catch {
        // fall through to error path
      }

      if (!res.ok || !isChatAPIResponse(data)) {
        throw new Error("Invalid AI response");
      }

      setChatLog([...newLog, { role: "assistant", content: data.message }]);
    } catch (err) {
      console.error("Coach error:", err);
      setChatLog([
        ...newLog,
        {
          role: "assistant",
          content:
            "The Coach hit a hiccup and is taking a breath. Try again shortly — you didn't do anything wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickInsert = (text: string) =>
    setInput((prev) => (prev ? `${prev} ${text}` : text));

  /** ---------- UI Pieces ---------- */
  const ChatWindow = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: variant === "floating" ? 320 : "100%",
        height: variant === "floating" ? 460 : "auto",
        background:
          variant === "floating"
            ? "#0b1020"
            : "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(2,6,23,0.9))",
        color: "#e5e7eb",
        borderRadius: 16,
        border: "1px solid rgba(148,163,184,0.18)",
        boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
        padding: 12,
      }}
      className={className}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 20 }} aria-hidden={true}>🧘</span>
        <strong aria-live="polite">{title?.trim() || "Coach"}</strong>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {onLogRep && (
            <button
              onClick={() => void onLogRep()}
              title="Log a rep"
              aria-label="Log a rep"
              style={chipStyle}
            >
              ⚡ Log rep
            </button>
          )}
          <button
            onClick={() => quickInsert("I'm overwhelmed. Help me find one tiny step.")}
            title="Tiny step"
            style={chipStyle}
          >
            Tiny step
          </button>
          <button
            onClick={() => quickInsert("Can you help me plan a 2-minute habit after coffee?")}
            title="Plan after coffee"
            style={chipStyle}
          >
            After coffee
          </button>
        </div>
      </div>

      {/* Scrollable log */}
      <div
        ref={scrollBoxRef}
        style={{
          flex: 1,
          height: variant === "embedded" ? height : "auto",
          overflowY: "auto",
          border: "1px solid rgba(148,163,184,0.15)",
          borderRadius: 12,
          padding: 12,
          background: "#0b1020",
        }}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {chatLog.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              textAlign: m.role === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                maxWidth: "85%",
                padding: "10px 12px",
                borderRadius: 12,
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                background:
                  m.role === "user"
                    ? "linear-gradient(180deg, #2563eb, #1d4ed8)"
                    : "linear-gradient(180deg, rgba(16,185,129,.18), rgba(16,185,129,.12))",
                color: m.role === "user" ? "#fff" : "#d1fae5",
                border:
                  m.role === "user"
                    ? "1px solid rgba(37,99,235,.7)"
                    : "1px solid rgba(16,185,129,.25)",
              }}
            >
              <div style={{ opacity: 0.75, fontSize: 12, marginBottom: 4 }}>
                {m.role === "user" ? "You" : "Coach"}
              </div>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ textAlign: "left", color: "#a7f3d0" }}>
            <span style={{ opacity: 0.8 }}>Coach is thinking</span>
            <span aria-hidden={true} style={{ marginLeft: 6 }}>
              ···
            </span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Composer */}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={2}
          placeholder="Tell the Coach what's hard… (Shift+Enter for newline)"
          style={inputStyle}
          disabled={loading}
          aria-label="Message Coach"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: "#10b981",
            color: "#062019",
            fontWeight: 700,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            opacity: loading || !input.trim() ? 0.6 : 1,
          }}
          aria-label="Send message"
        >
          {loading ? "…" : "Send"}
        </button>
      </div>

      {/* Utilities */}
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "flex-end",
          marginTop: 6,
        }}
      >
        <button
          onClick={() => {
            const text = chatLog
              .map((m) => `${m.role === "user" ? "You" : "Coach"}: ${m.content}`)
              .join("\n");
            navigator.clipboard.writeText(text).catch(() => {});
          }}
          style={utilBtnStyle}
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
          style={utilBtnStyle}
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

  // Floating variant (FAB + popover)
  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: "1.25rem",
          right: "1.25rem",
          zIndex: 9999,
        }}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle AI Coach"
          style={{
            backgroundColor: "#059669",
            color: "#fff",
            borderRadius: "9999px",
            padding: "1.1rem",
            border: "2px solid #facc15",
            boxShadow:
              "0 0 0 3px rgba(250, 204, 21, 0.35), 0 10px 20px rgba(0,0,0,0.25)",
            transition: "transform 0.2s",
            cursor: "pointer",
            animation: "mm-float 3s ease-in-out infinite",
            willChange: "transform",
          }}
        >
          <span style={{ fontSize: "1.6rem" }} aria-hidden={true}>🧘</span>
        </button>
        {open && <div style={{ marginTop: "0.5rem" }}>{ChatWindow}</div>}
      </div>

      <style jsx global>{`
        @keyframes mm-float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          button[aria-label="Toggle AI Coach"] {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}

/* ---------- tiny style helpers ---------- */
const chipStyle: React.CSSProperties = {
  borderRadius: 999,
  padding: "4px 10px",
  fontSize: 12,
  background: "rgba(148,163,184,0.15)",
  color: "#e5e7eb",
  border: "1px solid rgba(148,163,184,0.25)",
  cursor: "pointer",
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#e5e7eb",
  resize: "none",
};

const utilBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#94a3b8",
  cursor: "pointer",
};
// End of components/FloatingCoach.tsx