// components/ui/Button.tsx
import React, { forwardRef } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "magical" | "ghost" | "premium";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  glow?: boolean;
  loading?: boolean;
}

const srOnly: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      glow = false,
      loading = false,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const buttonClasses = [
      styles.button,
      styles[variant],
      styles[size],
      glow ? styles.glow : "",
      loading ? styles.loading : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && (
          <>
            <div className={styles.spinner}>
              <div className={styles.spinnerRing} />
            </div>
            <span aria-live="polite" style={srOnly}>
              Loading
            </span>
          </>
        )}
        <span className={loading ? styles.hiddenText : ""}>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
