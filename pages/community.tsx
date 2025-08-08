// pages/community.tsx
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import { createClient, User } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error && data) setPosts(data as Post[]);
    };
    fetchPosts();

    const channel = supabase.channel("community_channel");
    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_posts" },
        (payload) => {
          setPosts((prev) => [...prev, payload.new as Post]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() || !user) return;
    setLoading(true);
    await supabase.from("community_posts").insert({ user_id: user.id, content: postContent });
    setPostContent("");
    setLoading(false);
  };

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [posts]);

  return (
    <>
      <Head>
        <title>Myelin Nation 🤝</title>
        <meta name="description" content="A feed of courage, progress, and real transformation." />
      </Head>

      <main className="bg-gray-950 text-white min-h-screen py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-16">
          <header className="text-center">
            <h1 className="text-4xl font-bold text-rose-400">Myelin Nation 🤝</h1>
            <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
              A feed of courage, progress, and real transformation. Read the reps. Feel the energy.
            </p>
          </header>

          <section className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-white/10">
            {user ? (
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share a rep. A moment of growth. A lesson learned."
                  className="w-full h-24 p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="w-full bg-rose-500 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!postContent.trim() || loading}
                >
                  {loading ? "Sharing..." : "Share with Myelin Nation"}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-rose-300 font-bold">Sign in to share your energy with the Nation.</p>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">Community Feed</h2>
            <div className="space-y-6">
              {posts.length ? (
                posts.map((post) => (
                  <div key={post.id} className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow-sm">
                    <p className="text-gray-400 text-sm font-mono">{post.user_id}</p>
                    <p className="text-lg text-white mt-2">{post.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No posts yet. Be the first to spark the feed. 🔥</p>
              )}
              <div ref={feedEndRef} />
            </div>
          </section>

          <footer className="text-center text-gray-600 text-sm mt-12">
            <p>Powered by 💙 MyelinMap.com · Supabase · Michigan Energy</p>
          </footer>
        </div>
      </main>
    </>
  );
}
// Add any additional styles or components as needed