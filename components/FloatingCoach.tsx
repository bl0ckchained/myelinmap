import { useState, useRef, useEffect } from "react";

export default function FloatingCoach() {
  const [open, setOpen] = useState(false);
  const [chatLog, setChatLog] = useState([
    {
      role: "assistant",
      content: "Welcome, traveler. How are you feeling today?",
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
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: newLog }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      setChatLog([...newLog, { role: "assistant", content: data.message }]);
    } catch {
      setChatLog([
        ...newLog,
        {
          role: "assistant",
          content: "I sensed a disturbance in the signal. Try again shortly.",
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
        className="bg-emerald-600 text-white rounded-full p-4 shadow-xl hover:bg-emerald-700 transition"
        aria-label="Toggle AI Coach"
      >
        🧘
      </button>

      {open && (
        <div className="w-80 h-[440px] mt-2 bg-white text-gray-800 rounded-xl shadow-2xl p-4 border border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-3 pr-1">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`text-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "text-right text-gray-800"
                    : "text-left text-emerald-700"
                }`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.role === "user" ? "bg-emerald-100" : "bg-gray-100"
                  }`}
                >
                  <span className="block font-semibold mb-1">
                    {msg.role === "user" ? "You" : "Coach"}
                  </span>
                  <span>{msg.content}</span>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex gap-2 mt-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Your thoughts..."
              className="flex-1 px-3 py-2 rounded-md bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-emerald-500 text-white px-3 py-2 rounded-md hover:bg-emerald-600 disabled:opacity-50"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
