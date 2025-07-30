// pages/api/chat.ts
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const mockUserMemory = {
  recentReps: 12,
  lastAffirmation: "I am stronger than my past.",
  lastMood: "anxious",
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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    const reply = response.choices[0].message.content;
    res.status(200).json({ message: reply });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
}
