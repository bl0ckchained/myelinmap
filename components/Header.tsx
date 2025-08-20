import Link from "next/link";
import React from "react";
import styles from "../styles/Dashboard.module.css";

type NavLink = { href: string; label: string; bgColor: string };

const navLinks: NavLink[] = [
  { href: "/", label: "🏠 Home", bgColor: "#059669" }, // Emerald
  { href: "/coach", label: "🧘 Coach", bgColor: "#ec4899" }, // Pink
  { href: "/rewire", label: "🔥 7-Day Challenge", bgColor: "#f59e0b" }, // Amber
  { href: "/resources", label: "📚 Resources", bgColor: "#84cc16" }, // Lime
  { href: "/founder", label: "💬 Message from Founder", bgColor: "#facc15" }, // Yellow
  { href: "/about", label: "👤 About Us", bgColor: "#a3e635" }, // Lime alt
  { href: "/community", label: "🤝 Myelination", bgColor: "#fb7185" }, // Rose
  { href: "/dashboard", label: "📈 Dashboard", bgColor: "#60a5fa" }, // Blue
  { href: "/journal", label: "📝 Journal", bgColor: "#8b5cf6" }, // Violet
];

interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export default function Header({
  title,
  subtitle,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
}: HeaderProps) {
  return (
    <header className={`${styles.header} ${className}`} role="banner">
      <div className={styles.container}>
        <h1 className={`${styles.title} ${titleClassName}`}>{title}</h1>
        {subtitle && (
          <p className={`${styles.subtitle} ${subtitleClassName}`}>
            {subtitle}
          </p>
        )}
        <nav className={styles.nav} aria-label="Primary navigation">
          {navLinks.map(({ href, label, bgColor }) => (
            <Link key={href} href={href} legacyBehavior>
              <a
                className={`${styles.navLink} ${styles.fadeIn}`}
                style={{ "--nav-bg-color": bgColor } as React.CSSProperties}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = bgColor;
                  el.style.color = "#000000";
                  el.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "transparent";
                  el.style.color = "rgba(226, 232, 240, 0.95)";
                  el.style.transform = "scale(1)";
                }}
                aria-label={label.replace(/[^a-zA-Z\s]/g, "").trim()}
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