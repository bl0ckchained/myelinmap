// pages/journal.tsx
import { useEffect, useRef, useState, useMemo } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

type JournalEntry = {
  id: string;
  user_id: string;
  entry_text: string;
  created_at: string;
  updated_at: string;
};

const PAGE_SIZE = 20;

export default function JournalPage() {
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);

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

  // Initial load
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
        setPage(1); // next page index
      } catch (e) {
        console.error("load journal error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver((entriesObs) => {
      const [entry] = entriesObs;
      if (entry.isIntersecting) {
        void loadMore();
      }
    }, { rootMargin: "300px" });

    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading, loadingMore, page, sentinelRef.current]);

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
    return entries.filter(e => e.entry_text.toLowerCase().includes(q));
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
      setDraft("");
      // Prepend to top for instant feedback
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
    a.download = `myelin-journal-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Head>
        <title>Journal | Myelin Map</title>
        <meta name="description" content="A private rolling journal for reflection, reps, and growth." />
      </Head>

      <Header title="Private Journal ✍️" subtitle="A gentle place to notice, learn, and wire change." />

      <main className="bg-gray-900 text-white px-6 py-16 min-h-screen">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Composer card — magical but classy emerald */}
          <section
            className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-900/40 to-teal-900/30 p-5 shadow-lg shadow-emerald-900/30 ring-1 ring-emerald-300/10 backdrop-blur-sm"
            aria-label="New journal entry"
          >
            <div className="flex items-start gap-3">
              {/* Floating guide */}
              <div className="text-5xl animate-float select-none" aria-hidden>🧘</div>
              <div className="flex-1">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      void submitEntry();
                    }
                  }}
                  placeholder="What would be helpful to put into words right now? (Ctrl/Cmd+Enter to save)"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-800/30 text-emerald-50 placeholder-emerald-100/60 border border-emerald-400/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-300/60"
                />
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <button
                    onClick={submitEntry}
                    className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl font-medium"
                    disabled={!draft.trim()}
                  >
                    Save entry
                  </button>
                  <button
                    onClick={() => setDraft("")}
                    className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
                    disabled={!draft}
                  >
                    Clear
                  </button>

                  <span className="ml-auto text-emerald-100/80">
                    Ctrl/Cmd+Enter to save
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Toolbar: search + export */}
          <div className="flex flex-wrap gap-3 items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your journal…"
              className="flex-1 min-w-[220px] px-4 py-2 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-300"
            />
            <button
              onClick={exportTxt}
              className="px-4 py-2 rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
            >
              Export .txt
            </button>
          </div>

          {/* Feed */}
          <section className="rounded-xl border border-white/10 bg-black/20">
            <header className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-emerald-300">Your entries</h2>
              {loading && <span className="text-sm text-gray-400">Loading…</span>}
            </header>

            {filtered.length === 0 && !loading ? (
              <div className="p-6 text-gray-300">
                Nothing here yet. Your first entry can be one sentence. Tiny truths count.
              </div>
            ) : (
              <ul className="divide-y divide-white/10">
                {filtered.map((e) => (
                  <li key={e.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl select-none" aria-hidden>✨</div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-400">
                          {new Date(e.created_at).toLocaleString()}
                        </div>
                        <div className="mt-1 whitespace-pre-wrap text-gray-100">
                          {e.entry_text}
                        </div>
                        <div className="mt-2">
                          <button
                            onClick={() => deleteEntry(e.id)}
                            className="text-xs px-2 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Sentinel for infinite scroll */}
            <div ref={sentinelRef} className="h-10 flex items-center justify-center text-xs text-gray-500">
              {loadingMore ? "Loading more…" : hasMore ? " " : "You’ve reached the beginning."}
            </div>
          </section>

          {/* Gentle footer note */}
          <p className="text-xs text-gray-400">
            Private and personal. Supportive guidance, not medical advice.
          </p>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </>
  );
}
