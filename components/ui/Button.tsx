import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'magical' | 'ghost' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  loading?: boolean;
}

export default function Button({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  glow = false,
  loading = false,
  disabled,
  ...props 
}: ButtonProps) {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    glow ? styles.glow : '',
    loading ? styles.loading : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={buttonClasses} 
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className={styles.spinner}>
          <div className={styles.spinnerRing}></div>
        </div>
      )}
      <span className={loading ? styles.hiddenText : ''}>{children}</span>
    </button>
  );
}
