import React from 'react';

interface ScoreBadgeProps {
  score: number;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  const getScoreColor = () => {
    if (score >= 80) return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (score >= 50) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Très Important';
    if (score >= 50) return 'Important';
    return 'Modéré';
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${getScoreColor()}`}>
      <div className="flex items-center gap-1">
        <span className="text-xs opacity-70">Score</span>
        <span className="font-bold">{score}</span>
      </div>
      <span className="text-xs opacity-80">• {getScoreLabel()}</span>
    </div>
  );
};
