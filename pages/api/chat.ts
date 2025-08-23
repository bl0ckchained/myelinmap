// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// You can override this in .env as OPENAI_MODEL
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
// Hard limit to keep token usage reasonable
const MAX_MESSAGES = 40;

type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ message: "Missing OPENAI_API_KEY" });
  }

  // Validate & sanitize request body
  const body = req.body ?? {};
  const incoming = Array.isArray(body.messages) ? body.messages : [];

  const messages: ChatMsg[] = incoming
    .map((m: any) => ({
      role: m?.role,
      content: typeof m?.content === "string" ? m.content : String(m?.content ?? ""),
    }))
    .filter(
      (m: any): m is ChatMsg =>
        (m.role === "system" || m.role === "user" || m.role === "assistant") &&
        m.content.trim().length > 0
    )
    .slice(-MAX_MESSAGES);

  if (messages.length === 0) {
    return res.status(400).json({ message: "No valid messages provided." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 400,
    });

    const message = completion.choices?.[0]?.message?.content?.trim() || "";
    if (!message) {
      return res.status(502).json({ message: "Empty response from model." });
    }

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ message });
  } catch (error: any) {
    // Log detailed error server-side only
    console.error("OpenAI API error:", error?.response?.data ?? error);
    const status = Number(error?.status) || 500;
    return res
      .status(status)
      .json({ message: "There was an error communicating with the AI. Please try again." });
  }
}
