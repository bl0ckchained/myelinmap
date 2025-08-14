import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import styles from "./DashboardJournalWidget.module.css";

export default function DashboardJournalWidget() {
  const [user, setUser] = useState<User | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub?.subscription.unsubscribe();
  }, []);

  // Autosave draft (local)
  useEffect(() => {
    const key = "mm.quickjournal";
    const cached = localStorage.getItem(key);
    if (cached) setDraft(cached);
    const id = setInterval(() => localStorage.setItem(key, draft), 500);
    return () => clearInterval(id);
  }, [draft]);

  async function save() {
    const text = draft.trim();
    if (!user || !text) return;
    const { error } = await supabase
      .from("journal_entries")
      .insert({ user_id: user.id, entry_text: text });
    if (error) {
      alert("Couldn’t save right now. Try again soon.");
      return;
    }
    setDraft("");
    // Optional: toast or subtle success state
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
        <Link href="/journal" className={styles.link}>View all →</Link>
      </div>
      <textarea
        className={styles.textarea}
        rows={3}
        placeholder="One sentence about what you practiced, felt, or learned…"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            void save();
          }
        }}
      />
      <div className={styles.row}>
        <button className={styles.btn} onClick={save} disabled={!draft.trim()}>Save</button>
        <span className={styles.hint}>Ctrl/Cmd+Enter</span>
      </div>
      <p className={styles.disclaimer}>Private. Supportive guidance, not medical advice.</p>
    </div>
  );
}
