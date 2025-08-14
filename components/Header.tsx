import Link from "next/link";
import React from "react";

type NavLink = { href: string; label: string; bgColor: string };

const navLinks: NavLink[] = [
  { href: "/", label: "🏠 Home", bgColor: "#059669" }, // Emerald
  { href: "/coach", label: "🧘 Coach", bgColor: "#ec4899" }, // Pink
  { href: "/rewire", label: "🔥 7-Day Challenge", bgColor: "#f59e0b" }, // Amber
  // ❌ Removed Visualizer
  { href: "/resources", label: "📚 Resources", bgColor: "#84cc16" }, // Lime
  { href: "/founder", label: "💬 Message from Founder", bgColor: "#facc15" }, // Yellow
  { href: "/about", label: "👤 About Us", bgColor: "#a3e635" }, // Lime alt
  { href: "/community", label: "🤝 Myelination", bgColor: "#fb7185" }, // Rose
  { href: "/dashboard", label: "📈 Dashboard", bgColor: "#60a5fa" }, // Blue
  { href: "/journal", label: "📝 Journal", bgColor: "#8b5cf6" }, // Violet
];

export default function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header
      style={{
        backgroundColor: "#111827", // gray-900
        color: "#ffffff",
        textAlign: "center",
        padding: "3rem 1rem",
      }}
    >
      {/* Title and Subtitle */}
      <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", margin: 0 }}>
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: "1.125rem",
            marginTop: "0.5rem",
            maxWidth: "40rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Navigation */}
      <nav
        style={{
          marginTop: "2rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.75rem",
          fontSize: "0.875rem",
        }}
      >
        {navLinks.map(({ href, label, bgColor }) => (
          <Link key={href} href={href} legacyBehavior>
            <a
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                color: "#ffffff",
                backgroundColor: "#1f2937", // gray-800
                textDecoration: "none",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  bgColor;
                (e.currentTarget as HTMLAnchorElement).style.color = "#000000";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "scale(1.05)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "#1f2937";
                (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "scale(1)";
              }}
            >
              {label}
            </a>
          </Link>
        ))}
      </nav>
    </header>
  );
}
