// pages/api/test-supabase.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, key);

  const { data, error } = await supabase.from("user_reps").select("*").limit(1);
  res.status(200).json({
    ok: !error,
    error: error ? { message: error.message, details: error.details, hint: error.hint } : null,
    sawRows: data?.length ?? 0,
    urlDefined: Boolean(url),
    keyDefined: Boolean(key),
  });
}
