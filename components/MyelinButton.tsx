// MyelinButton.tsx (To be placed in components/MyelinButton.tsx)
import React from 'react';
import Link from 'next/link';

interface MyelinButtonProps {
  href: string;
  color: string;
  size?: 'normal' | 'large';
  children: React.ReactNode;
}

const MyelinButton = ({ href, color, size = 'normal', children }: MyelinButtonProps) => {
  const sizeClasses = size === 'large' ? 'px-8 py-4 text-lg' : 'px-6 py-3';
  return (
    <Link href={href}>
      <button
        className={`${color} text-black rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-md ${sizeClasses}`}
      >
        {children}
      </button>
    </Link>
  );
};

export default MyelinButton;
