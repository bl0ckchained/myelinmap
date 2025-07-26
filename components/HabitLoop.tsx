// ✅ HabitLoop Component – by Chad 🧠✨

import { useState } from "react";

export default function HabitLoop() {
  const [habit, setHabit] = useState("");
  const [trigger, setTrigger] = useState("");
  const [reward, setReward] = useState("");

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl text-left space-y-4 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-white text-center mb-2">
        🌀 Build Your Habit Loop
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            🧠 Trigger (Cue)
          </label>
          <input
            type="text"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            placeholder="e.g., I wake up"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            🔁 Habit (Action)
          </label>
          <input
            type="text"
            value={habit}
            onChange={(e) => setHabit(e.target.value)}
            placeholder="e.g., drink water"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            🎯 Reward (Result)
          </label>
          <input
            type="text"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            placeholder="e.g., feel energized"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        <p>
          “When I <span className="text-cyan-400">{trigger || "..."}</span>,
          I will <span className="text-cyan-400">{habit || "..."}</span>,
          because it helps me <span className="text-cyan-400">{reward || "..."}</span>.”
        </p>
      </div>
    </div>
  );
}
