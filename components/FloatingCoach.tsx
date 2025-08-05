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
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setOpen(!open)}
        className={`
          bg-emerald-600 text-white rounded-full p-5 shadow-xl transition
          transform hover:scale-110 focus:outline-none
          animate-pulse ring-2 ring-emerald-400 ring-offset-2
        `}
        aria-label="Toggle AI Coach"
      >
        <span className="text-3xl">🧘</span>
      </button>

      {open && (
        <div className="w-80 h-[440px] mt-2 bg-white text-gray-800 rounded-xl shadow-2xl p-4 border border-gray-200 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-3 pr-2">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-xl text-sm break-words shadow-sm transition-all duration-300 ${
                    msg.role === "user"
                      ? "bg-emerald-500 text-white rounded-tr-none"
                      : "bg-gray-200 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[75%] px-4 py-2 rounded-xl text-sm bg-gray-200 text-gray-800 rounded-tl-none">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="flex gap-2 mt-auto">
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
              className="flex-1 px-4 py-2 rounded-md bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-300"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
