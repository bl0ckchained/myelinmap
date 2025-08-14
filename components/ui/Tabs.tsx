import React from 'react';
import styles from './Tabs.module.css';

interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'magical' | 'premium';
  className?: string;
}

export default function Tabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = 'default',
  className = '' 
}: TabsProps) {
  const tabsClasses = [
    styles.tabs,
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <nav className={tabsClasses} role="tablist">
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon && <span className={styles.icon}>{tab.icon}</span>}
            <span className={styles.label}>{tab.label}</span>
            {activeTab === tab.id && (
              <div className={styles.activeIndicator} />
            )}
          </button>
        ))}
        <div 
          className={styles.glider}
          style={{
            transform: `translateX(${tabs.findIndex(t => t.id === activeTab) * 100}%)`,
            width: `${100 / tabs.length}%`
          }}
        />
      </div>
    </nav>
  );
}
