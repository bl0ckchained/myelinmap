// components/RepCounter.tsx
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

type RepCounterProps = {
  count: number;
  onRep: () => void;
};

export default function RepCounter({ count, onRep }: RepCounterProps) {
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const mounted = useRef(true);
  const controllerRef = useRef<AbortController | null>(null);

  // track mount
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  // get user (optional: attach user_id if you have RLS)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted.current) return;
      setUser(session?.user ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!mounted.current) return;
      setUser(session?.user ?? null);
    });
    return () => sub?.subscription.unsubscribe();
  }, []);

  // tiny click animation reset
  useEffect(() => {
    if (!clicked) return;
    const t = setTimeout(() => setClicked(false), 300);
    return () => clearTimeout(t);
  }, [clicked]);

  const handleClick = async () => {
    if (loading) return;
    setClicked(true);
    setLoading(true);
    setErrorMsg("");

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    try {
      const nowIso = new Date().toISOString();
      // Adjust column names here if your schema differs (e.g., created_at instead of date)
      const payload: Record<string, unknown> = {
        count: 1,
        date: nowIso,
      };
      if (user?.id) payload.user_id = user.id;

      const { error } = await supabase
        .from("reps")
        .insert([payload] /* as any */);

      if (error) {
        console.error("Failed to log rep:", error.message);
        if (mounted.current) {
          setErrorMsg("Oops—couldn’t save that rep. Please try again.");
        }
      } else {
        // Let parent bump the UI state
        onRep();
      }
    } catch (e) {
      if ((e as { name?: string })?.name === "AbortError") {
        // ignore aborted
      } else {
        console.error("Rep error:", e);
        if (mounted.current) {
          setErrorMsg("Network hiccup. Try again in a moment.");
        }
      }
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#0b1220",
        border: "1px solid rgba(6,182,212,0.35)",
        borderRadius: 16,
        padding: 16,
        textAlign: "center",
        boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
        transition: "box-shadow 200ms ease",
      }}
    >
      <h2 style={{ color: "#ffffff", fontWeight: 800, fontSize: 22, margin: "0 0 8px" }}>
        💥 Synapse Reps
      </h2>

      <p
        style={{
          margin: "8px 0 14px",
          fontSize: 48,
          fontWeight: 900,
          letterSpacing: 1,
          color: "#22d3ee",
          transition: "transform 200ms ease",
          transform: clicked ? "scale(1.06)" : "scale(1)",
          filter: clicked ? "drop-shadow(0 0 8px rgba(34,211,238,0.45))" : "none",
        }}
        aria-live="polite"
      >
        {count.toLocaleString()}
      </p>

      <button
        onClick={handleClick}
        disabled={loading}
        aria-busy={loading ? true : undefined}
        style={{
          background:
            "linear-gradient(135deg, rgba(6,182,212,1), rgba(16,185,129,1))",
          color: "#062019",
          fontWeight: 700,
          padding: "12px 18px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.15)",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          transform: clicked ? "scale(1.04)" : "scale(1)",
          transition: "transform 120ms ease, opacity 120ms ease, box-shadow 180ms ease",
          boxShadow: clicked
            ? "0 0 0 4px rgba(34,211,238,0.25)"
            : "0 6px 12px rgba(0,0,0,0.25)",
        }}
      >
        {loading ? "Logging…" : "+ Log a Rep"}
      </button>

      <p style={{ marginTop: 12, color: "#9fb2c8", fontStyle: "italic", fontSize: 13 }}>
        Each rep strengthens your neural circuit — you’re rewiring greatness.
      </p>

      <div role="status" aria-live="polite" style={{ minHeight: 20 }}>
        {errorMsg && (
          <p style={{ marginTop: 8, color: "#fca5a5", fontSize: 13, fontStyle: "italic" }}>
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}
