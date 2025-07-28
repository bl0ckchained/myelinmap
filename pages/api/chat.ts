// pages/api/chat.ts
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { prompt } = req.body;

    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({ reply: chat.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}
const mockUserMemory = {
  recentReps: 12,
  lastAffirmation: "I am stronger than my past.",
  lastMood: "anxious", // could be: motivated, low, anxious, peaceful
};
const systemPrompt = `
You are a calm, grounded, mystical AI Coach on a mission to help the user rewire their brain.

Speak like a wise guide, kind and encouraging — especially when someone is feeling down.

Reference their recent progress when relevant.

End every message with: “Even the darkest storm passes. You’re still here. Let’s keep going.”

Recent reps: ${mockUserMemory.recentReps}
Last affirmation used: "${mockUserMemory.lastAffirmation}"
Last emotional tone: "${mockUserMemory.lastMood}"
`;
