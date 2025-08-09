// pages/api/checkout.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;
const priceId = process.env.STRIPE_COFFEE_PRICE_ID;
const successUrl = process.env.STRIPE_SUCCESS_URL;
const cancelUrl = process.env.STRIPE_CANCEL_URL;

const stripe = secret
  ? new Stripe(secret, { apiVersion: "2024-06-20" as Stripe.LatestApiVersion })
  : null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!stripe) return res.status(400).json({ error: "Stripe not configured (missing STRIPE_SECRET_KEY)" });
  if (!priceId) return res.status(400).json({ error: "Stripe not configured (missing STRIPE_COFFEE_PRICE_ID)" });

  try {
    const origin = (req.headers.origin as string) || "https://myelinmap.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${origin}/thank-you`,
      cancel_url: cancelUrl || `${origin}/`,
      payment_method_types: ["card"],
      metadata: { purpose: "coffee" },
      payment_intent_data: { metadata: { purpose: "coffee" } },
    });

    return res.status(200).json({ url: session.url });
  } catch (err: unknown) {
    // Narrow unknown safely without using `any`
    let message = "Stripe error";
    if (err && typeof err === "object" && "message" in err) {
      message = String((err as { message?: unknown }).message);
    }
    console.error("Stripe Checkout error:", err);
    return res.status(500).json({ error: message });
  }
}
