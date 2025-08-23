// components/ui/Tabs.tsx
import React, { useMemo, useCallback } from "react";
import styles from "./Tabs.module.css";

interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: "default" | "magical" | "premium";
  className?: string;
}

export default function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = "default",
  className = "",
}: TabsProps) {
  const tabsClasses = [styles.tabs, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  const activeIndex = useMemo(
    () => Math.max(0, tabs.findIndex((t) => t.id === activeTab)),
    [tabs, activeTab]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
      if (!tabs.length) return;
      const last = tabs.length - 1;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = idx === last ? 0 : idx + 1;
        onTabChange(tabs[next].id);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = idx === 0 ? last : idx - 1;
        onTabChange(tabs[prev].id);
      }
    },
    [tabs, onTabChange]
  );

  return (
    <nav className={tabsClasses} role="tablist" aria-label="Tabs">
      <div className={styles.tabList}>
        {tabs.map((tab, idx) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              className={`${styles.tab} ${isActive ? styles.active : ""}`}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {tab.icon && <span className={styles.icon}>{tab.icon}</span>}
              <span className={styles.label}>{tab.label}</span>
              {isActive && <div className={styles.activeIndicator} />}
            </button>
          );
        })}
        {/* Guard against divide-by-zero if tabs is empty */}
        {tabs.length > 0 && (
          <div
            className={styles.glider}
            style={{
              transform: `translateX(${activeIndex * 100}%)`,
              width: `${100 / tabs.length}%`,
            }}
            aria-hidden
          />
        )}
      </div>
    </nav>
  );
}
