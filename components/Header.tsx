import Link from "next/link";
import React from "react";
import styles from "./HeaderFooter.module.css";

type NavLink = { href: string; label: string; bgColor: string };

const navLinks: NavLink[] = [
  { href: "/", label: "🏠 Home", bgColor: "#059669" },        // Emerald
  { href: "/coach", label: "🧘 Coach", bgColor: "#ec4899" },  // Pink
  { href: "/rewire", label: "🔥 7-Day Challenge", bgColor: "#f59e0b" }, // Amber
  { href: "/resources", label: "📚 Resources", bgColor: "#84cc16" },    // Lime
  { href: "/founder", label: "💬 Message from Founder", bgColor: "#facc15" }, // Yellow
  { href: "/about", label: "👤 About Us", bgColor: "#a3e635" },         // Lime alt
  { href: "/community", label: "🤝 Myelination", bgColor: "#fb7185" },  // Rose
  { href: "/dashboard", label: "📈 Dashboard", bgColor: "#60a5fa" },    // Blue
  { href: "/journal", label: "📝 Journal", bgColor: "#8b5cf6" },        // Violet
];

export default function Header({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className={styles.section} role="banner">
      <div className={styles.inner}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        <nav className={styles.nav} aria-label="Primary navigation">
          {navLinks.map(({ href, label, bgColor }) => (
            <Link key={href} href={href} legacyBehavior>
              <a
                className={styles.navLink}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = bgColor;
                  el.style.color = "#000000";
                  el.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "#1f2937";
                  el.style.color = "#ffffff";
                  el.style.transform = "scale(1)";
                }}
              >
                {label}
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
