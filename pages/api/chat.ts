// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  messages: ChatMessage[];
};

type ChatResponseBody = { message: string } | { error: string };

function isChatMessage(val: unknown): val is ChatMessage {
  if (!val || typeof val !== "object") return false;
  const v = val as Partial<ChatMessage>;
  return (
    (v.role === "system" || v.role === "user" || v.role === "assistant") &&
    typeof v.content === "string"
  );
}

function isChatRequestBody(body: unknown): body is ChatRequestBody {
  if (!body || typeof body !== "object") return false;
  const maybe = body as Partial<ChatRequestBody>;
  return Array.isArray(maybe.messages) && maybe.messages.every(isChatMessage);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponseBody>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const body = req.body as unknown;
  if (!isChatRequestBody(body)) {
    res
      .status(400)
      .json({ error: "Missing or invalid messages array in request body" });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // keep as-is for now
      messages: body.messages,
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content?.trim() ?? "";
    res.status(200).json({ message });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.error("OpenAI API error:", msg);
    res.status(500).json({
      error: "There was an error communicating with the AI. Please try again.",
    });
  }
}
// pages/api/chat.ts