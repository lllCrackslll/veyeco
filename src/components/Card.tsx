import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`glass-card rounded-xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.06] ${className}`}
    >
      {children}
    </div>
  );
};
