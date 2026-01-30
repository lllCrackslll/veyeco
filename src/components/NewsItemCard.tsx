import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { TagChip } from './TagChip';
import { ScoreBadge } from './ScoreBadge';
import { ExternalLink, Clock } from 'lucide-react';
import type { NewsItem } from '@/lib/mockData';

interface NewsItemCardProps {
  item: NewsItem;
}

export const NewsItemCard: React.FC<NewsItemCardProps> = ({ item }) => {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `Il y a ${diffMins} min`;
    }
    if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    }
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
            {item.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <Badge variant="primary">{item.source}</Badge>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(item.publishedAt)}
            </span>
            <Badge>{item.country}</Badge>
          </div>
        </div>
        <ScoreBadge score={item.importanceScore} />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag, idx) => (
          <TagChip key={idx} tag={tag} />
        ))}
      </div>

      {/* Summary */}
      <ul className="space-y-2">
        {item.summaryBullets.map((bullet, idx) => (
          <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
            <span className="text-sky-400 mt-1.5">•</span>
            <span className="flex-1">{bullet}</span>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="pt-3 border-t border-white/10">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition-colors"
        >
          Ouvrir la source
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </Card>
  );
};
