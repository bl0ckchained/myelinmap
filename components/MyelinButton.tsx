import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Tone = "default" | "primary" | "danger";

interface MyelinButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** Prefer this over `color`. Maps to your .btn variants. */
  tone?: Tone;
  /** Padding/typography bump */
  size?: "normal" | "large";
  /** Optional hard color override (CSS color or var()) */
  color?: string; // backward-compat / one-off styling
  children: React.ReactNode;
}

/** MyelinButton — uses global .btn styles from basic.css */
export default function MyelinButton({
  href,
  tone = "default",
  size = "normal",
  color,
  children,
  className,
  style,
  target,
  rel,
  ...rest
}: MyelinButtonProps) {
  const toneClass =
    tone === "primary" ? "primary" : tone === "danger" ? "danger" : undefined;

  const sizeStyle: React.CSSProperties =
    size === "large"
      ? { padding: "12px 18px", fontSize: "1.05rem", fontWeight: 700 }
      : { padding: "10px 14px" };

  // Optional color override (e.g., "#7ee0c3" or "var(--accent)")
  const colorStyle: React.CSSProperties = color
    ? {
        // Keep your button look but tint the background
        background: color,
        // Subtle border so it still feels like your system
        borderColor: "rgba(255,255,255,.18)",
        color: "#0b0f14",
      }
    : {};

  // External link safety
  const safeRel =
    target === "_blank" ? [rel, "noopener", "noreferrer"].filter(Boolean).join(" ") : rel;

  return (
    <Link
      href={href}
      className={cn("btn", toneClass, className)}
      style={{ ...sizeStyle, ...colorStyle, ...style }}
      target={target}
      rel={safeRel}
      {...rest}
    >
      {children}
    </Link>
  );
}
