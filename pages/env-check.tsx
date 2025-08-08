// pages/env-check.tsx
export default function EnvCheck() {
  return (
    <pre style={{ padding: 16 }}>
      {JSON.stringify(
        {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_ANON_KEY_START: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').slice(0, 12) + '...',
        },
        null,
        2
      )}
    </pre>
  );
}
