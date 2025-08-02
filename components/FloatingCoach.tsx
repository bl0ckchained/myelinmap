import { useState, useRef, useEffect } from "react";

// This component provides a floating, interactive AI coach.
// The coach is designed to be a caring and compassionate companion for users
// dealing with trauma and addiction, offering positive reinforcement and guidance.
export default function FloatingCoach() {
  // State for managing the chat window's visibility
  const [open, setOpen] = useState(false);
  // State for the chat log, including messages from both the user and the coach
  const [chatLog, setChatLog] = useState([
    { role: "assistant", content: "Welcome, brave soul. I'm here to listen and support you on your journey. How are you feeling today?" },
  ]);
  // State for the user's input in the text box
  const [input, setInput] = useState("");
  // State to show a loading/typing indicator while waiting for the AI's response
  const [loading, setLoading] = useState(false);

  // A ref to automatically scroll the chat window to the bottom when new messages arrive
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll the chat to the end
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect hook to trigger scrolling whenever the chat log is updated or the chat is opened
  useEffect(() => {
    if (open) scrollToBottom();
  }, [chatLog, open]);

  // Function to handle sending a message to the AI
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Create a new log with the user's message
    const newLog = [...chatLog, { role: "user", content: input }];
    setChatLog(newLog);
    setInput("");
    setLoading(true);

    try {
      // Craft the prompt to ensure a compassionate and positive tone
      const prompt = `You are a deeply compassionate, empathetic, and positive AI coach. Your purpose is to provide support, encouragement, and guidance to someone who is a survivor of trauma and is on a path to recovery from addiction. Your responses should be non-judgmental, kind, and focus on reinforcing their strength and resilience. Always maintain a gentle, hopeful, and understanding tone. When providing advice, frame it as suggestions or reflections, not commands.

      Here is the conversation so far:
      ${newLog.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

      Your turn:
      assistant:`;
      
      // Prepare the payload for the Gemini API call
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // Canvas will provide this at runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      // Make the API call
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Extract the response text
      const assistantMessage = result?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having a little trouble connecting right now. Please try again in a moment.";

      // Update the chat log with the coach's response
      setChatLog([...newLog, { role: "assistant", content: assistantMessage }]);
    } catch (error) {
      console.error("API call failed:", error);
      // Provide a compassionate error message on failure
      setChatLog([
        ...newLog,
        {
          role: "assistant",
          content: "I sensed a disturbance in the signal, but I am still here for you. Let's try again shortly.",
        },
      ]);
    } finally {
      // End the loading state
      setLoading(false);
    }
  };
  
  // Component JSX
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="bg-emerald-600 text-white rounded-full p-4 shadow-xl hover:bg-emerald-700 transition transform hover:scale-110"
        aria-label="Toggle AI Coach"
      >
        <span className="text-2xl">🧘</span>
      </button>

      {open && (
        <div className="w-80 h-[440px] mt-2 bg-white text-gray-800 rounded-xl shadow-2xl p-4 border border-gray-200 flex flex-col transition-all duration-300">
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
                if (e.key === "Enter") sendMessage();
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
