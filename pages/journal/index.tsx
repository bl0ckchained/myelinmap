// pages/journal/index.tsx
import { useEffect, useRef, useState, useMemo } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import styles from "./journal.module.css";

type JournalEntry = {
  id: string;
  user_id: string;
  entry_text: string;
  created_at: string;
  updated_at: string;
};

type ModeKey = "free" | "gratitude" | "trigger" | "urge" | "wins";

const PLACEHOLDERS: Record<ModeKey, string> = {
  free:
    "What would be helpful to put into words right now? (Ctrl/Cmd+Enter to save)",
  gratitude:
    "Gratitude 3×3:\n• People —\n• Moments —\n• Comforts —",
  trigger:
    "Trigger → Response:\n• What triggered me?\n• How did I respond?\n• Kinder response next time?",
  urge:
    "Urge Surfing:\n• Intensity (1–10):\n• Duration:\n• What I did instead:\n• What I learned:",
  wins:
    "Win Stack:\n• Tiny win #1\n• Tiny win #2\n• Tiny win #3\nWhat these wins say about who I’m becoming:"
};

const PAGE_SIZE = 20;

export default function JournalPage() {
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [mode, setMode] = useState<ModeKey>("free");
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // --- Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub?.subscription.unsubscribe();
  }, []);

// Load cached draft when the mode changes (runs once per mode)
useEffect(() => {
  const key = `mm.journal.draft.${mode}`;
  try {
    const cached = localStorage.getItem(key);
    setDraft(cached ?? "");
  } catch {}
}, [mode]);

// Debounced autosave when draft changes
useEffect(() => {
  const key = `mm.journal.draft.${mode}`;
  const t = setTimeout(() => {
    try {
      localStorage.setItem(key, draft);
    } catch {}
  }, 300);
  return () => clearTimeout(t);
}, [mode, draft]);


  // --- Initial load
  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("journal_entries")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .range(0, PAGE_SIZE - 1);
        if (error) throw error;
        setEntries((data as JournalEntry[]) ?? []);
        setHasMore((data?.length ?? 0) === PAGE_SIZE);
        setPage(1);
      } catch (e) {
        console.error("load journal error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // --- Infinite scroll
  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entriesObs) => {
        const [entry] = entriesObs;
        if (entry.isIntersecting) void loadMore();
      },
      { rootMargin: "300px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, loadingMore, page]);

  const loadMore = async () => {
    if (!user) return;
    setLoadingMore(true);
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);
      if (error) throw error;
      const rows = (data as JournalEntry[]) ?? [];
      setEntries((prev) => [...prev, ...rows]);
      setHasMore(rows.length === PAGE_SIZE);
      setPage((p) => p + 1);
    } catch (e) {
      console.error("loadMore journal error:", e);
    } finally {
      setLoadingMore(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.entry_text.toLowerCase().includes(q));
  }, [entries, search]);

  const submitEntry = async () => {
    const text = draft.trim();
    if (!text || !user) return;
    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .insert({ user_id: user.id, entry_text: text })
        .select()
        .single();
      if (error) throw error;

      // Clear current-mode draft only
      localStorage.removeItem(`mm.journal.draft.${mode}`);
      setDraft("");

      // Prepend new entry for instant feedback
      setEntries((prev) => [data as JournalEntry, ...prev]);
    } catch (e) {
      console.error("insert journal error:", e);
      alert("Couldn’t save your entry. Try again in a moment.");
    }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("Delete this entry? This cannot be undone.")) return;
    try {
      const { error } = await supabase.from("journal_entries").delete().eq("id", id);
      if (error) throw error;
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      console.error("delete journal error:", e);
      alert("Couldn’t delete right now. Try again.");
    }
  };

  const exportTxt = () => {
    const text = entries
      .map((e) => {
        const d = new Date(e.created_at).toLocaleString();
        return `[${d}]\n${e.entry_text}\n`;
      })
      .join("\n------------------------\n\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `myelin-journal-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const charCount = draft.length;
  const tooLong = charCount > 3000; // soft warning line

  return (
    <>
      <Head>
        <title>Journal | Myelin Map</title>
        <meta
          name="description"
          content="A private rolling journal for reflection, reps, and growth. Gentle, judgment-free space for mental health and addiction recovery."
        />
      </Head>

      <Header title="Private Journal ✍️" subtitle="Small truths, stacked daily. Reflection wires change." />

     <main className={`${styles.page} ${styles.theme}`}>

<div className={styles.wrap}>
  {/* Mode bar */}
  <div className={styles.modebar} role="toolbar" aria-label="Journal modes">
    {(["free", "gratitude", "trigger", "urge", "wins"] as ModeKey[]).map((m) => (
      <button
        key={m}
        type="button"
        className={`${styles.chip} ${mode === m ? styles.chipActive : ""}`}
        aria-pressed={mode === m}
        title={PLACEHOLDERS[m].split("\n")[0]} // quick hint on hover
        onClick={() => setMode(m)}
      >
        {m === "free"
          ? "Free"
          : m === "gratitude"
          ? "Gratitude"
          : m === "trigger"
          ? "Trigger→Response"
          : m === "urge"
          ? "Urge Surfing"
          : "Win Stack"}
      </button>
    ))}
  </div>

  {/* Composer ... (leave your existing composer code here) */}


          {/* Composer */}
          <section className={styles.composer} aria-label="New journal entry">
            <div className={styles.floatIcon} aria-hidden>🧘</div>
            <div className={styles.composerBody}>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    void submitEntry();
                  }
                }}
                placeholder={PLACEHOLDERS[mode]}
                rows={5}
                className={styles.textarea}
              />
              <div className={styles.controls}>
                <button onClick={submitEntry} className={styles.btn} disabled={!draft.trim()}>
                  Save entry
                </button>
                <button onClick={() => setDraft("")} className={styles.btnSecondary} disabled={!draft}>
                  Clear
                </button>
                <span className={styles.hint}>
                  Ctrl/Cmd+Enter • <span className={tooLong ? styles.warn : ""}>{charCount}</span> chars
                </span>
              </div>
              <p className={styles.miniNote}>
                Gentle reminder: you’re doing hard brain work. Be specific, be kind, keep going.
              </p>
            </div>
          </section>

          {/* Toolbar: search + export */}
          <div className={styles.toolbar}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your journal…"
              className={styles.search}
              aria-label="Search entries"
            />
            <button onClick={exportTxt} className={styles.btnSecondary}>
              Export .txt
            </button>
          </div>

          {/* Feed */}
          <section className={styles.card} aria-live="polite">
            <header className={styles.cardHeader}>
              <h2>Your entries</h2>
              {loading && <span>Loading…</span>}
            </header>

            {filtered.length === 0 && !loading ? (
              <div className={styles.empty}>
                Nothing here yet. First entries can be one sentence. Tiny truths count.
              </div>
            ) : (
              <ul className={styles.list}>
                {filtered.map((e) => (
                  <li key={e.id} className={styles.item}>
                    <div className={styles.itemIcon} aria-hidden>✨</div>
                    <div className={styles.itemBody}>
                      <div className={styles.timestamp}>
                        {new Date(e.created_at).toLocaleString()}
                      </div>
                      <div className={styles.text}>{e.entry_text}</div>
                      <div className={styles.itemActions}>
                        <button className={styles.danger} onClick={() => deleteEntry(e.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Sentinel for infinite scroll */}
            <div ref={sentinelRef} className={styles.sentinel}>
              {loadingMore ? "Loading more…" : hasMore ? " " : "You’ve reached the beginning."}
            </div>
          </section>

          <p className={styles.footnote}>
            Private and personal. Supportive guidance, not medical advice. If you’re in crisis, call or text{" "}
            <a href="tel:988">988</a> (US).
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
