import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'magical' | 'premium';
  glow?: boolean;
  hover?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export default function Card({ 
  children, 
  className = '', 
  variant = 'default',
  glow = false,
  hover = true,
  onClick
}: CardProps) {
  const cardClasses = [
    styles.card,
    styles[variant],
    glow ? styles.glow : '',
    hover ? styles.hover : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {variant === 'magical' && (
        <div className={styles.magicalOverlay}>
          <div className={styles.shimmer}></div>
        </div>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
