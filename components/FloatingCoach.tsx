import { useState, useRef, useEffect } from "react";

export default function FloatingCoach() {
  const [open, setOpen] = useState(false);
  const [chatLog, setChatLog] = useState([
    {
      role: "assistant",
      content:
        "Welcome, brave soul. I'm here to listen and support you on your journey. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [chatLog, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newLog = [...chatLog, { role: "user", content: input }];
    setChatLog(newLog);
    setInput("");
    setLoading(true);

    try {
      const messages = [
        {
          role: "system",
          content:
            "You are a deeply compassionate, empathetic, and positive AI coach. Your purpose is to provide support, encouragement, and guidance to someone who is a survivor of trauma and is on a path to recovery from addiction. Your responses should be non-judgmental, kind, and focus on reinforcing their strength and resilience. Always maintain a gentle, hopeful, and understanding tone.",
        },
        ...newLog,
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok || !data.message) {
        throw new Error("Invalid response");
      }

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

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          backgroundColor: "#059669",
          color: "#fff",
          borderRadius: "9999px",
          padding: "1.25rem",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          transition: "transform 0.2s",
          cursor: "pointer",
        }}
        aria-label="Toggle AI Coach"
      >
        <span style={{ fontSize: "1.75rem" }}>🧘</span>
      </button>

      {open && (
        <div
          style={{
            width: "320px",
            height: "440px",
            marginTop: "0.5rem",
            backgroundColor: "#fff",
            color: "#333",
            borderRadius: "1rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            padding: "1rem",
            border: "1px solid #ccc",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              marginBottom: "0.75rem",
              paddingRight: "0.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
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
                  }}
                >
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
                    <div style={{ width: "8px", height: "8px", backgroundColor: "#999", borderRadius: "50%" }} />
                    <div style={{ width: "8px", height: "8px", backgroundColor: "#999", borderRadius: "50%" }} />
                    <div style={{ width: "8px", height: "8px", backgroundColor: "#999", borderRadius: "50%" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

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
        </div>
      )}
    </div>
  );
}
