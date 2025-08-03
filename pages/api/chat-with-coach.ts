import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

// IMPORTANT: This key is NOT prefixed with NEXT_PUBLIC_ and is only available on the server.
const geminiApiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(geminiApiKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { chatLog } = req.body;

  if (!chatLog) {
    return res.status(400).json({ message: 'Missing chatLog in request body' });
  }

  // Define the model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  try {
    // Construct the chat history in the format the API expects
    const history = chatLog.map((msg: { role: string; content: string }) => {
      // The API expects "user" and "model" roles, not "assistant"
      const role = msg.role === 'assistant' ? 'model' : 'user';
      return {
        role,
        parts: [{ text: msg.content }],
      };
    });

    const chat = model.startChat({ history });

    // Send the last message to the model
    const lastUserMessage = chatLog[chatLog.length - 1].content;
    const result = await chat.sendMessage(lastUserMessage);
    const assistantMessage = result.response.text();

    res.status(200).json({ assistantMessage });
  } catch (error) {
    console.error('API call to Gemini failed:', error);
    res.status(500).json({
      message: 'There was an error communicating with the AI. Please try again.',
    });
  }
}