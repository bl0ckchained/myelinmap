import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // adjust if needed
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Support Myelin Map",
              description: "One-time donation to help grow the project.",
            },
            unit_amount: 500, // $5.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/support?success=true`,
      cancel_url: `${req.headers.origin}/support?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
