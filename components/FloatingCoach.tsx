import { useState, useRef, useEffect } from "react";

export default function FloatingCoach() {
  const [open, setOpen] = useState(false);
  const [chatLog, setChatLog] = useState([
    { role: "assistant", content: "Welcome. How are you feeling today?" },
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
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: newLog }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setChatLog([...newLog, { role: "assistant", content: data.message }]);
    } catch (err) {
      setChatLog([
        ...newLog,
        {
          role: "assistant",
          content: "Hmm... something went wrong. Try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="bg-emerald-600 text-white rounded-full p-4 shadow-lg hover:bg-emerald-700 transition"
        aria-label="Toggle AI Coach"
      >
        🧠
      </button>

      {open && (
        <div className="w-80 h-[400px] mt-2 bg-gray-900 text-white rounded-xl shadow-xl p-4 border border-white/10 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1">
            {chatLog.map((msg, i) => (
              <div key={i} className={`text-sm ${msg.role === "user" ? "text-right" : "text-emerald-300"}`}>
                <span className="block font-bold">
                  {msg.role === "user" ? "You" : "Coach"}:
                </span>
                <span>{msg.content}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Your thoughts..."
              className="flex-1 px-3 py-2 rounded-md text-black focus:outline-none focus:ring focus:ring-emerald-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-emerald-500 px-3 py-2 rounded-md hover:bg-emerald-600 disabled:opacity-50"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
