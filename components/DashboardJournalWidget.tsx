import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import styles from "./DashboardJournalWidget.module.css";

type JournalEntry = {
  id: string;
  user_id: string;
  entry_text: string;
  created_at: string;
  updated_at?: string | null;
};

const LOCAL_KEY = "mm.quickjournal";
const MAX_LEN = 3000;

export default function DashboardJournalWidget() {
  const [user, setUser] = useState<User | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [loadingInitial, setLoadingInitial] = useState(true);
  const latestId = useRef<string | null>(null);
  const mounted = useRef(false);

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub?.subscription.unsubscribe();
  }, []);

  // Load initial value ONCE (localStorage first, then DB if empty)
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    // Local cache wins
    const cached = typeof window !== "undefined" ? localStorage.getItem(LOCAL_KEY) : null;
    if (cached) {
      setDraft(cached);
      setLoadingInitial(false);
      return;
    }

    // Otherwise, try to hydrate from last DB entry
    (async () => {
      try {
        const u = (await supabase.auth.getSession()).data.session?.user ?? null;
        if (!u) {
          setLoadingInitial(false);
          return;
        }
        const { data, error } = await supabase
          .from("journal_entries")
          .select("id, entry_text, created_at")
          .eq("user_id", u.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          const entry = data[0] as JournalEntry;
          latestId.current = entry.id;
          setDraft(entry.entry_text || "");
        }
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, []);

  // Lightweight autosave to localStorage on every change (no interval!)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LOCAL_KEY, draft);
    } catch {
      /* ignore quota errors */
    }
  }, [draft]);

  async function save() {
    const text = draft.trim();
    if (!user || !text) return;

    setSaving("saving");
    try {
      if (latestId.current) {
        const { error } = await supabase
          .from("journal_entries")
          .update({ entry_text: text })
          .eq("id", latestId.current);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("journal_entries")
          .insert({ user_id: user.id, entry_text: text })
          .select("id")
          .single();

        if (error) throw error;
        latestId.current = (data as { id: string }).id;
      }

      setSaving("saved");
      // clear local cache so the latest DB value is authoritative next visit
      if (typeof window !== "undefined") localStorage.removeItem(LOCAL_KEY);
      setTimeout(() => setSaving("idle"), 1200);
    } catch {
      setSaving("error");
      setTimeout(() => setSaving("idle"), 2000);
    }
  }

  if (!user) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <h3>Quick Journal</h3>
        </div>
        <p className={styles.muted}>Sign in to journal.</p>
      </div>
    );
  }

  return (
    <div className={styles.card} aria-label="Quick Journal">
      <div className={styles.header}>
        <h3>Quick Journal</h3>
        <Link href="/journal" className={styles.link}>
  <span>View all →</span>
</Link>

      </div>

      <textarea
        className={styles.textarea}
        rows={4}
        placeholder="One sentence about what you practiced, felt, or learned…"
        value={draft}
        maxLength={MAX_LEN}
        disabled={loadingInitial}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            void save();
          }
        }}
      />

      <div className={styles.row}>
        <button
          className={styles.btn}
          onClick={save}
          disabled={!draft.trim() || saving === "saving" || loadingInitial}
        >
          {saving === "saving" ? "Saving…" : "Save"}
        </button>
        <span className={styles.hint}>
          {saving === "error" && "Couldn’t save. Check connection."}
          {saving === "saved" && "Saved"}
          {saving === "idle" && "Ctrl/Cmd+Enter"}
        </span>
        <span className={styles.hint} aria-live="polite">
          {draft.length}/{MAX_LEN}
        </span>
      </div>

      <p className={styles.disclaimer}>
        Private. Supportive guidance, not medical advice.
      </p>
    </div>
  );
}
