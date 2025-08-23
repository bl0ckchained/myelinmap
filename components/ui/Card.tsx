// components/ui/Card.tsx
import React from "react";
import Link from "next/link";
import styles from "./Card.module.css";
import { cn } from "@/lib/utils";

type Variant = "default" | "glass" | "magical" | "premium";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  /** Visual style */
  variant?: Variant;
  /** Lift + stronger shadow on hover */
  hover?: boolean;
  /** Outer glow gradient ring on hover */
  glow?: boolean;
  /** Show shimmering overlay (nice with `variant="magical"`) */
  shimmer?: boolean;
};

type DivProps = BaseProps &
  React.HTMLAttributes<HTMLDivElement> & {
    as?: "div" | "section" | "article";
  };

type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as: "button";
  };

type AnchorProps = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: "a";
    href: string;
  };

type CardProps = DivProps | ButtonProps | AnchorProps;

export default function Card(props: CardProps) {
  const {
    children,
    className,
    variant = "default",
    hover = true,
    glow = false,
    shimmer = false,
    ...rest
  } = props as CardProps & Record<string, unknown>;

  const classes = cn(
    styles.card,
    styles[variant],
    hover && styles.hover,
    glow && styles.glow,
    className
  );

  const overlay =
    variant === "magical" && shimmer ? (
      <span className={styles.magicalOverlay} aria-hidden>
        <span className={styles.shimmer} />
      </span>
    ) : null;

  // Render as anchor
  if ((props as AnchorProps).as === "a") {
    const {
      href,
      target,
      rel,
      children: _children, // prevent passing children via spread
      ...aRest
    } = props as AnchorProps;

    const isInternal = href?.startsWith("/");
    if (isInternal) {
      // Next.js Link (internal)
      return (
        <Link href={href} className={classes} target={target} rel={rel} {...aRest}>
          {overlay}
          <div className={styles.content}>{children}</div>
        </Link>
      );
    }

    // External <a>
    const safeRel = target === "_blank" ? rel ?? "noopener noreferrer" : rel;
    return (
      <a href={href} target={target} rel={safeRel} className={classes} {...aRest}>
        {overlay}
        <div className={styles.content}>{children}</div>
      </a>
    );
  }

  // Render as button
  if ((props as ButtonProps).as === "button") {
    const {
      as: _as,
      type,
      children: _children, // prevent duplicate children
      ...btnRest
    } = props as ButtonProps;
    return (
      <button type={type ?? "button"} className={classes} {...btnRest}>
        {overlay}
        <div className={styles.content}>{children}</div>
      </button>
    );
  }

  // Default: div/section/article — use createElement to avoid JSX generic tag TS issues
  const asTag = (props as DivProps).as ?? "div";
  const divRest = rest as React.HTMLAttributes<HTMLDivElement>;

  return React.createElement(
    asTag,
    { className: classes, ...divRest },
    <>
      {overlay}
      <div className={styles.content}>{children}</div>
    </>
  );
}
