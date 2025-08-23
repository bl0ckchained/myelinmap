// components/ui/LinkButton.tsx
import React from "react";
import Link from "next/link";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "magical" | "ghost" | "premium";
type Size = "sm" | "md" | "lg";

export interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  glow?: boolean;
  /** Force treating this as external even if href looks internal */
  external?: boolean;
  /** Next.js prefetch for internal links */
  prefetch?: boolean;
  /** Convenience disabled; maps to aria-disabled and non-clickable */
  disabled?: boolean;
}

export default function LinkButton({
  href,
  children,
  className = "",
  variant = "primary",
  size = "md",
  glow = false,
  external,
  prefetch,
  disabled,
  // typical anchor props
  target,
  rel,
  "aria-disabled": ariaDisabled,
  ...rest
}: LinkButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    glow ? styles.glow : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const looksExternal =
    /^([a-z][a-z0-9+.-]*:)?\/\//i.test(href) ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:");
  const isExternal = external ?? looksExternal;
  const isDisabled = disabled || ariaDisabled === true || ariaDisabled === "true";

  // Disabled link: render a span with role="link" so it reads correctly
  if (isDisabled) {
    return (
      <span
        role="link"
        aria-disabled="true"
        className={`${classes} ${styles.loading}`}
        style={{ pointerEvents: "none" }}
        {...rest}
      >
        {children}
      </span>
    );
  }

  if (isExternal) {
    const safeRel =
      rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);
    return (
      <a
        href={href}
        target={target}
        rel={safeRel}
        className={classes}
        {...rest}
      >
        {children}
      </a>
    );
  }

  // Internal link via Next.js
  return (
    <Link href={href} prefetch={prefetch} className={classes} {...rest}>
      {children}
    </Link>
  );
}
