import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import { createClient, User } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const navLinks = [
  { href: "/", label: "🏠 Home", hoverColor: "hover:bg-emerald-500" },
  { href: "/rewire", label: "🔥 7-Day Challenge", hoverColor: "hover:bg-amber-400" },
  { href: "/about", label: "👤 About Us", hoverColor: "hover:bg-lime-400" },
  { href: "/visualizer", label: "🧬 Visualizer", hoverColor: "hover:bg-cyan-500" },
  { href: "/coach", label: "🧠 Coach", hoverColor: "hover:bg-pink-400" },
  { href: "/community", label: "🤝 Myelin Nation", hoverColor: "hover:bg-rose-400" },
  { href: "/dashboard", label: "📈 Dashboard", hoverColor: "hover:bg-blue-400" },
];

const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <header className="bg-gradient-to-r from-gray-900 via-purple-900 to-black text-white text-center py-12 px-4 shadow-xl">
    <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">{title}</h1>
    {subtitle && <p className="text-lg mt-4 max-w-xl mx-auto text-gray-300">{subtitle}</p>}
    <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
      {navLinks.map(({ href, label, hoverColor }) => (
        <Link key={href} href={href} legacyBehavior>
          <a className={`px-4 py-2 rounded-full bg-gray-800 text-white ${hoverColor} hover:text-black transition-all duration-300 shadow-md transform hover:-translate-y-1 hover:scale-105`}>
            {label}
          </a>
        </Link>
      ))}
    </nav>
  </header>
);

const Footer = () => (
  <footer className="text-center p-8 bg-gray-900 text-white text-sm">
    <div className="space-y-2 mb-4">
      <p className="text-gray-400 mt-2">Special thanks to Matt Stewart &mdash; your belief helped light this path.</p>
      <p>🧠 Designed to wire greatness into your day 🧠</p>
    </div>
    <div className="space-y-2 mb-4">
      <p>&copy; 2025 MyelinMap.com Made with 💙 in Michigan &middot; Powered by Quantum Step Consultants LLC</p>
      <p>
        <Link href="/legalpage" legacyBehavior>
          <a className="underline hover:text-blue-300">Privacy Policy & Terms</a>
        </Link>
      </p>
    </div>
    <div className="flex justify-center items-center gap-2">
      <span className="text-gray-400">Join our journey</span>
      <a
        href="https://www.youtube.com/@myelinmap"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80 transition"
        aria-label="YouTube Channel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
          <path d="M19.615 3.184c-1.007-.372-5.615-.372-5.615-.372s-4.608 0-5.615.372a3.21 3.21 0 0 0-2.262 2.262c-.373 1.007-.373 3.108-.373 3.108s0 2.101.373 3.108a3.21 3.21 0 0 0 2.262 2.262c1.007.372 5.615.372 5.615.372s4.608 0 5.615-.372a3.21 3.21 0 0 0 2.262-2.262c.373-1.007.373-3.108.373-3.108s0-2.101-.373-3.108a3.21 3.21 0 0 0-2.262-2.262zm-10.615 8.816v-5l5 2.5-5 2.5z" />
        </svg>
      </a>
    </div>
  </footer>
);

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data) {
        setPosts(data as Post[]);
      }
    };

    fetchPosts();

    const channel = supabase.channel("community_channel");
    channel.on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "community_posts",
    }, (payload) => {
      setPosts(prev => [...prev, payload.new as Post]);
    }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!postContent.trim() || !user) return;
    setLoading(true);
    const { error } = await supabase
      .from("community_posts")
      .insert({ user_id: user.id, content: postContent });
    if (!error) setPostContent("");
    setLoading(false);
  };

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [posts]);

  return (
    <>
      <Head>
        <title>Myelin Nation &mdash; A Community of Growth</title>
        <meta name="description" content="Join the Myelin Nation to share your journey, offer support, and connect with others on a path of growth." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header title="Myelin Nation 🤝" subtitle="A community built on repetition, support, and growth." />

      <main className="bg-gray-900 text-white px-4 py-16 min-h-screen">
        <div className="max-w-3xl mx-auto space-y-12">
          <section className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-white/10">
            {user ? (
              <>
                <h2 className="text-2xl font-bold text-emerald-400 mb-4">Share Your Rep</h2>
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="A moment of courage, a small win, or a thought you want to share."
                    className="w-full h-24 p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    className="w-full bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!postContent.trim() || loading}
                  >
                    {loading ? "Sharing..." : "Share with Myelin Nation"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-yellow-300">Join Myelin Nation to Post</h2>
                <p className="mt-2 text-gray-400">Sign in to share your journey with others.</p>
                <button
                  onClick={() => supabase.auth.signInWithOAuth({ provider: "github" })}
                  className="mt-6 bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-emerald-600 transition"
                >
                  Sign In to Post
                </button>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-6">Community Feed</h2>
            <div className="space-y-6">
              {posts.length > 0 ? posts.map((post) => (
                <div key={post.id} className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 space-y-2">
                  <p className="text-sm text-gray-400">Posted by: <span className="font-mono text-xs break-all">{post.user_id}</span></p>
                  <p className="text-lg leading-relaxed text-gray-200">{post.content}</p>
                  {post.created_at && <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</p>}
                </div>
              )) : (
                <p className="text-gray-400 text-center italic">Be the first to share your story. Your voice matters.</p>
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
