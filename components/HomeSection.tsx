import React from "react";
import styles from "./HomeSection.module.css";

interface HomeSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  id?: string;
  /** tighter vertical padding */
  compact?: boolean;
  /** optional actions area (right side of header) */
  actions?: React.ReactNode;
}

const HomeSection: React.FC<HomeSectionProps> = ({
  title,
  subtitle,
  children,
  id,
  compact = false,
  actions,
}) => {
  return (
    <section
      id={id}
      className={`${styles.section} ${compact ? styles.compact : ""}`}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <header className={styles.header}>
        <div className={styles.titles}>
          <h2 id={id ? `${id}-title` : undefined} className={styles.title}>
            {title}
          </h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </header>

      <div className={styles.body}>{children}</div>
    </section>
  );
};

export default HomeSection;
