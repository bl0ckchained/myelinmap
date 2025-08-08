// pages/community.tsx
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <header className="bg-gray-900 text-white text-center py-12 px-4">
    <h1 className="text-4xl font-bold">{title}</h1>
    {subtitle && <p className="text-lg mt-2 max-w-xl mx-auto">{subtitle}</p>}
  </header>
);

const Footer = () => (
  <footer className="text-center p-8 bg-gray-900 text-white text-sm">
    <p className="text-gray-400">Join our journey · Powered by Quantum Step Consultants LLC</p>
    <p className="mt-1">&copy; 2025 MyelinMap.com 💙 Made in Michigan</p>
  </footer>
);

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const feedEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data) setPosts(data as Post[]);
    };
    fetchPosts();

    const channel = supabase.channel("public_feed");
    channel
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "community_posts" }, (payload) => {
        setPosts((prev) => [...prev, payload.new as Post]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (feedEndRef.current) feedEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [posts]);

  return (
    <>
      <Head>
        <title>Myelin Nation | Open Community</title>
      </Head>

      <Header
        title="Myelin Nation 🤝"
        subtitle="A public community feed for those building new lives, one rep at a time."
      />

      <main className="bg-gray-900 text-white px-4 py-16 min-h-screen">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center">
            <h2 className="text-xl font-bold text-emerald-400 mb-2">Want to share?</h2>
            <p className="text-gray-400 mb-4">Sign in to post your story and inspire others.</p>
            <Link
              href="/signin"
              className="bg-emerald-500 px-6 py-3 rounded-full font-bold text-white hover:bg-emerald-600 transition"
            >
              Sign In to Post
            </Link>
          </div>

          <section>
            <h2 className="text-2xl font-bold mb-6">Community Feed</h2>
            <div className="space-y-6">
              {posts.length ? (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-700 space-y-2"
                  >
                    <p className="text-sm text-gray-400">
                      User: <span className="font-mono text-xs break-all">{post.user_id}</span>
                    </p>
                    <p className="text-lg text-gray-200 leading-relaxed">{post.content}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 italic">No posts yet — be the first to leave a mark.</p>
              )}
              <div ref={feedEndRef} />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
