// components/ui/Card.tsx
import React from "react";
import styles from "./Card.module.css";

type Variant = "default" | "glass" | "magical" | "premium";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  glow?: boolean;
  hover?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * Elegant glassy card with optional shimmer (when variant="magical").
 * - Adds role+keyboard activation when onClick is provided
 * - Forwards ref for parent measurement/focus if needed
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className = "",
      variant = "default",
      glow = false,
      hover = true,
      onClick,
      ...rest
    },
    ref
  ) => {
    const cardClasses = [
      styles.card,
      styles[variant],
      glow ? styles.glow : "",
      hover ? styles.hover : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Enable keyboard activation when clickable
    const isClickable = typeof onClick === "function";
    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
      if (!isClickable) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        (e.currentTarget as HTMLDivElement).click();
      }
    };

    return (
      <div
        ref={ref}
        className={cardClasses}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        {...rest}
      >
        {variant === "magical" && (
          <div className={styles.magicalOverlay} aria-hidden>
            <div className={styles.shimmer} />
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    );
  }
);

Card.displayName = "Card";
export default Card;
