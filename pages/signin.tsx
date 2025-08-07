import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Redirect if already signed in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/dashboard");
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setMessage("There was an error. Please try again.");
      console.error(error.message);
    } else {
      setMessage("Check your email for a magic link!");
    }
  };

  return (
    <main style={{ minHeight: "70vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "400px", padding: "2rem", border: "1px solid #ccc", borderRadius: "12px", textAlign: "center" }}>
        <h1>Sign In to Myelin Map</h1>
        <p style={{ marginBottom: "1rem", color: "#666" }}>Use your email to receive a magic login link.</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem", fontSize: "1rem" }}
        />
        <button
          type="submit"
          style={{ padding: "0.75rem 2rem", fontSize: "1rem", cursor: "pointer" }}
        >
          Send Magic Link
        </button>

        {message && <p style={{ marginTop: "1rem", color: "#007bff" }}>{message}</p>}
      </form>
    </main>
  );
}
