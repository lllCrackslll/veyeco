import React from 'react';

interface PlanBadgeProps {
  plan: 'FREE' | 'PRO';
  className?: string;
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({ plan, className = '' }) => {
  if (plan === 'PRO') {
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-500 to-blue-600 text-white ${className}`}>
        PRO
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-gray-300 border border-white/20 ${className}`}>
      GRATUIT
    </span>
  );
};
