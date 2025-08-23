import React from "react";
import Link from "next/link";

interface MyelinButtonProps {
  href: string;
  /** Any valid CSS color (e.g. "#10b981", "rgb(16,185,129)", "rebeccapurple") */
  color: string;
  size?: "normal" | "large";
  className?: string;
  children: React.ReactNode;
}

export default function MyelinButton({
  href,
  color,
  size = "normal",
  className = "",
  children,
}: MyelinButtonProps) {
  const sizeClasses = size === "large" ? "px-8 py-4 text-lg" : "px-6 py-3 text-sm";

  const baseClasses =
    "inline-block rounded-full font-semibold transition-transform duration-200 " +
    "hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900";

  return (
    <Link
      href={href}
      className={`${baseClasses} ${sizeClasses} ${className}`}
      style={{ backgroundColor: color, color: "#000000" }}
    >
      {children}
    </Link>
  );
}
