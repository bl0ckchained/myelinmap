import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is in your `.env` file
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: 'Missing or invalid messages array in request body' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'gpt-4' if available and you want to use it
      messages,
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content?.trim();

    res.status(200).json({ message });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({
      message: 'There was an error communicating with the AI. Please try again.',
    });
  }
}
// Ensure you have the OpenAI package installed
// npm install openai