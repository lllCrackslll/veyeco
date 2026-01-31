import React from 'react';

interface TagChipProps {
  tag: string;
}

export const TagChip: React.FC<TagChipProps> = ({ tag }) => {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] uppercase tracking-[0.16em] bg-sky-500/10 text-sky-200 border border-sky-500/20">
      {tag}
    </span>
  );
};
