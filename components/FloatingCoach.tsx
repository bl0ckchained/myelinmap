import { useState, useRef, useEffect } from "react";

type ChatMsg = { role: "user" | "assistant" | "system"; content: string };

type FloatingCoachProps = {
  mode?: "floating" | "embedded";
  initialOpen?: boolean;
  storageKey?: string;
  systemContextExtra?: string; // e.g., active habit + rep count
  onLogRep?: () => void;       // show a quick "Log Rep" in header when provided
  height?: number;             // chat viewport height in px (embedded mode)
  title?: string;              // header title in embedded mode
};

export default function FloatingCoach({
  mode = "floating",
  initialOpen = false,
  storageKey = "coach_chatlog",
  systemContextExtra,
  onLogRep,
  height = 260,
  title = "Coach (private)",
}: FloatingCoachProps) {
  // Open if embedded; else respect toggle
  const [open, setOpen] = useState(mode === "embedded" ? true : initialOpen);

  // Lazy init transcript (avoid SSR/hydration flicker)
  const [chatLog, setChatLog] = useState<ChatMsg[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        role: "assistant",
        content:
          "Welcome, brave soul. I'm here to listen and support you on your journey. How are you feeling today?",
      },
    ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const baseSystem =
    "You are a deeply compassionate, empathetic, and positive AI coach. Your purpose is to provide support, encouragement, and guidance to someone who is a survivor of trauma and is on a path to recovery from addiction. Your responses should be non-judgmental, kind, and focus on reinforcing their strength and resilience. Always maintain a gentle, hopeful, and understanding tone. Keep responses brief (2–4 sentences) and actionable.";

  const systemPrompt = [baseSystem, systemContextExtra].filter(Boolean).join(" ");

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Persist transcript
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(chatLog));
    } catch {}
  }, [chatLog, storageKey]);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [chatLog, open, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newLog = [...chatLog, { role: "user", content: input }];
    setChatLog(newLog);
    setInput("");
    setLoading(true);

    try {
      const messages: ChatMsg[] = [{ role: "system", content: systemPrompt }, ...newLog];
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok || !data?.message) throw new Error("Invalid response");

      setChatLog([...newLog, { role: "assistant", content: data.message }]);
    } catch (err) {
      console.error("AI error:", err);
      setChatLog([
        ...newLog,
        {
          role: "assistant",
          content:
            "I sensed a disturbance in the signal, but I am still here for you. Let's try again shortly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyTranscript = () => {
    const text = chatLog.map((m) => `${m.role === "user" ? "You" : "Coach"}: ${m.content}`).join("\n");
    navigator.clipboard.writeText(text).catch(() => {});
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

  // --- Shared UI bits ---
  const ChatPane = (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        marginBottom: "0.75rem",
        paddingRight: "0.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        height: mode === "embedded" ? height : undefined,
      }}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {chatLog.map((msg, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          }}
        >
          <div
            style={{
              maxWidth: "75%",
              padding: "0.5rem 1rem",
              borderRadius: "1rem",
              fontSize: "0.9rem",
              backgroundColor: msg.role === "user" ? "#10b981" : "#e5e7eb",
              color: msg.role === "user" ? "#fff" : "#333",
              borderTopRightRadius: msg.role === "user" ? "0" : "1rem",
              borderTopLeftRadius: msg.role !== "user" ? "0" : "1rem",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            <div style={{ opacity: 0.7, fontSize: 12, marginBottom: 4 }}>
              {msg.role === "user" ? "You" : "Coach"}
            </div>
            {msg.content}
          </div>
        </div>
      ))}

      {loading && (
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <div
            style={{
              maxWidth: "75%",
              padding: "0.5rem 1rem",
              borderRadius: "1rem",
              fontSize: "0.9rem",
              backgroundColor: "#e5e7eb",
              color: "#333",
              borderTopLeftRadius: "0",
            }}
          >
            <div style={{ display: "flex", gap: "0.25rem", animation: "pulse 1s infinite" }}>
              <div style={{ width: 8, height: 8, backgroundColor: "#999", borderRadius: "50%" }} />
              <div style={{ width: 8, height: 8, backgroundColor: "#999", borderRadius: "50%" }} />
              <div style={{ width: 8, height: 8, backgroundColor: "#999", borderRadius: "50%" }} />
            </div>
          </div>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );

  const Composer = (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        placeholder="Your thoughts..."
        disabled={loading}
        style={{
          flex: 1,
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          backgroundColor: "#f3f4f6",
          border: "1px solid #ccc",
          color: "#111",
        }}
        aria-label="Message the Coach"
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        style={{
          backgroundColor: "#10b981",
          color: "#fff",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.5 : 1,
        }}
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  );

  const Utilities = (
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
      <button
        onClick={copyTranscript}
        style={{ background: "transparent", border: "none", color: "#6b7280", cursor: "pointer" }}
        title="Copy transcript"
      >
        Copy
      </button>
      <button
        onClick={downloadTranscript}
        style={{ background: "transparent", border: "none", color: "#6b7280", cursor: "pointer" }}
        title="Download .txt"
      >
        Save
      </button>
      <button
        onClick={() => {
          if (!confirm("Clear conversation?")) return;
          setChatLog([
            { role: "assistant", content: "Reset complete. What would be supportive right now?" },
          ]);
        }}
        style={{ background: "transparent", border: "none", color: "#6b7280", cursor: "pointer" }}
      >
        Clear
      </button>
    </div>
  );

  // --- Render by mode ---
  if (mode === "embedded") {
    return (
      <div
        style={{
          borderRadius: 12,
          padding: 12,
          background: "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(2,6,23,0.9))",
          border: "1px solid rgba(148,163,184,0.15)",
          boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 20 }}>🧘</span>
          <strong style={{ color: "#e5e7eb", flex: 1 }}>{title}</strong>
          {onLogRep && (
            <button
              onClick={onLogRep}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                background: "#10b981",
                color: "#062019",
                fontWeight: 700,
                border: "1px solid #0ea5a6",
                cursor: "pointer",
              }}
              title="Log a tiny rep"
            >
              ✨ Log Rep
            </button>
          )}
        </div>

        {ChatPane}
        {Composer}
        {Utilities}
      </div>
    );
  }

  // Floating mode (default)
  const YELLOW = "#facc15";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
      }}
    >
      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          backgroundColor: "#059669",
          color: "#fff",
          borderRadius: "9999px",
          padding: "1.25rem",
          border: `2px solid ${YELLOW}`,
          boxShadow: `0 0 0 3px rgba(250, 204, 21, 0.35), 0 10px 20px rgba(0,0,0,0.25)`,
          transition: "transform 0.2s",
          cursor: "pointer",
          animation: "mm-float 3s ease-in-out infinite",
          willChange: "transform",
        }}
        aria-label="Toggle AI Coach"
      >
        <span style={{ fontSize: "1.75rem" }}>🧘</span>
      </button>

      {open && (
        <div
          style={{
            width: 320,
            height: 440,
            marginTop: "0.5rem",
            backgroundColor: "#fff",
            color: "#333",
            borderRadius: "1rem",
            border: `2px solid ${YELLOW}`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {ChatPane}
          {Composer}
          {Utilities}
        </div>
      )}

      {/* Global keyframes */}
      <style jsx global>{`
        @keyframes mm-float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          button[aria-label="Toggle AI Coach"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
