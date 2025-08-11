// pages/community.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

type DBPost = {
  id?: string | number | null;     // be defensive
  user_id?: string | null;
  content?: string | null;
  created_at?: string | null;
};

type Post = {
  id: string;         // normalized
  user_id: string;    // normalized
  content: string;    // normalized
  created_at: string; // normalized ISO
};

function normalize(row: DBPost): Post | null {
  const id =
    typeof row.id === "string"
      ? row.id
      : typeof row.id === "number"
      ? String(row.id)
      : null;
  const user_id = typeof row.user_id === "string" ? row.user_id : "anon";
  const content = typeof row.content === "string" ? row.content : "";
  const created_at =
    typeof row.created_at === "string"
      ? row.created_at
      : new Date().toISOString();

  if (!content.trim()) return null; // skip empty/invalid rows
  return {
    id: id ?? `missing-${Math.random().toString(36).slice(2)}`,
    user_id,
    content,
    created_at,
  };
}

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);
  const feedTopRef = useRef<HTMLDivElement>(null);

  const MAX_LEN = 500;
  const remaining = MAX_LEN - postContent.length;
  const trimmed = useMemo(() => postContent.trim(), [postContent]);

  // --- Auth ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub?.subscription.unsubscribe();
  }, []);

  // --- Initial fetch + realtime ---
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false }); // newest first
      if (error) {
        console.error("load posts error:", error);
        return;
      }
      const normalized = (data as DBPost[])
        .map(normalize)
        .filter((x): x is Post => !!x);
      setPosts(normalized);
    };
    load();

    const channel = supabase
      .channel("community_posts_live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_posts" },
        (payload) => {
          const norm = normalize(payload.new as DBPost);
          if (!norm) return;
          // avoid dup if optimistic temp was already swapped
          setPosts((prev) => {
            if (prev.find((p) => p.id === norm.id)) return prev;
            return [norm, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // --- Helpers ---
  const timeAgo = (iso: string) => {
    const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d ago`;
    return new Date(iso).toLocaleString();
  };

  // --- Post submit (optimistic) ---
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed || !user || loading) return;

    setLoading(true);
    const tempId = `temp-${Date.now()}`;
    const tempPost: Post = {
      id: tempId,
      user_id: user.id,
      content: trimmed,
      created_at: new Date().toISOString(),
    };

    setPosts((prev) => [tempPost, ...prev]);
    setPostContent("");

    try {
      const { data, error } = await supabase
        .from("community_posts")
        .insert({ user_id: user.id, content: trimmed })
        .select()
        .single();

      if (error || !data) throw error || new Error("No data returned");

      const real = normalize(data as DBPost);
      if (!real) throw new Error("Invalid inserted row");

      setPosts((prev) => prev.map((p) => (p.id === tempId ? real : p)));
    } catch (error) {
      console.error(error);
      // rollback optimistic and restore text
      setPosts((prev) => prev.filter((p) => p.id !== tempId));
      setPostContent(trimmed);
      alert("Couldn’t share right now. Try again in a moment.");
    } finally {
      setLoading(false);
      feedTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Head>
        <title>Myelin Nation 🤝</title>
        <meta
          name="description"
          content="A feed of courage, progress, and real transformation."
        />
      </Head>

      <Header
        title="Myelin Nation 🤝"
        subtitle="A feed of courage, progress, and real transformation."
      />

      <main className="bg-gray-950 text-white min-h-screen py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Composer */}
          <section
            className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-900/40 to-teal-900/30 p-5 shadow-lg shadow-emerald-900/30 ring-1 ring-emerald-300/10 backdrop-blur-sm"
            aria-label="Create a community post"
          >
            {user ? (
              <form onSubmit={handlePostSubmit} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div
                    className="text-4xl select-none animate-[float_4s_ease-in-out_infinite]"
                    aria-hidden
                  >
                    ✨
                  </div>
                  <textarea
                    value={postContent}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_LEN)
                        setPostContent(e.target.value);
                    }}
                    placeholder="Share a rep, a realization, a tiny win… your words might be someone else’s spark."
                    rows={4}
                    className="flex-1 px-4 py-3 rounded-xl bg-emerald-800/30 text-emerald-50 placeholder-emerald-100/60 border border-emerald-400/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-300/60"
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-xl font-medium disabled:opacity-50"
                    disabled={!trimmed || loading}
                  >
                    {loading ? "Sharing…" : "Share with Myelin Nation"}
                  </button>
                  <span
                    className={`ml-auto text-sm ${
                      remaining < 0 ? "text-rose-300" : "text-emerald-100/80"
                    }`}
                  >
                    {remaining} characters
                  </span>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-emerald-200 font-medium">
                  Sign in to share your energy with the Nation.
                </p>
                <Link
                  href={{ pathname: "/signin", query: { redirect: "/community" } }}
                  className="inline-block bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-full"
                >
                  Sign in
                </Link>
              </div>
            )}
          </section>

          {/* Feed */}
          <section aria-live="polite" aria-relevant="additions">
            <div ref={feedTopRef} />
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Community Feed
            </h2>

            {posts.length === 0 ? (
              <p className="text-gray-500 italic">
                No posts yet. Be the first to spark the feed. 🔥
              </p>
            ) : (
              <ul className="space-y-4">
                {posts.map((post, index) => {
                  const isTemp =
                    typeof post.id === "string" && post.id.startsWith("temp-");
                  const displayId =
                    typeof post.user_id === "string" && post.user_id.length > 0
                      ? post.user_id
                      : "anon";
                  const initials = displayId.slice(0, 4);
                  const when =
                    typeof post.created_at === "string" && post.created_at
                      ? timeAgo(post.created_at)
                      : "now";

                  return (
                    <li
                      key={`${post.id}-${index}`}
                      className="rounded-xl border border-white/10 bg-black/25 p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar stub */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/40 to-teal-500/40 border border-emerald-300/30 flex items-center justify-center text-xs text-emerald-100/90">
                          {initials}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="font-mono truncate max-w-[160px]">
                              {displayId}
                            </span>
                            <span>•</span>
                            <time dateTime={post.created_at}>{when}</time>
                            {isTemp && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-300">posting…</span>
                              </>
                            )}
                          </div>
                          <div className="mt-1 whitespace-pre-wrap leading-relaxed text-gray-100">
                            {post.content}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {/* tiny float animation keyframes (matches your style) */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </>
  );
}
