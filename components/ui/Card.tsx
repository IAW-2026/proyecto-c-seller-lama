import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className, hoverable = true }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-[#8fa18d]/10
        ${hoverable ? 'hover:border-[#8fa18d]/30 hover:shadow-lg hover:shadow-[#8fa18d]/10 transition-all' : ''}
        ${className || ''}
      `}
    >
      {children}
    </div>
  );
}
