import React from 'react';
import { NewsItem } from '@/lib/mockData';
import { Card } from './Card';
import { Badge } from './Badge';
import { TagChip } from './TagChip';
import { ExternalLink, Clock } from 'lucide-react';

interface SimpleNewsCardProps {
  item: NewsItem;
}

export const SimpleNewsCard: React.FC<SimpleNewsCardProps> = ({ item }) => {
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
    });
  };

  return (
    <Card className="hover:bg-white/[0.06] transition-all cursor-pointer">
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-white leading-snug">
          {item.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-400 uppercase tracking-[0.12em]">
          <Badge variant="primary">{item.source}</Badge>
          <span className="flex items-center gap-1 normal-case tracking-normal text-sm text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(item.publishedAt)}
          </span>
          <Badge>{item.country}</Badge>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag, idx) => (
            <TagChip key={idx} tag={tag} />
          ))}
        </div>

        {/* Summary - First 2 bullets only */}
        <ul className="space-y-1.5">
          {item.summaryBullets.slice(0, 2).map((bullet, idx) => (
            <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
              <span className="text-sky-400 mt-0.5">•</span>
              <span className="flex-1">{bullet}</span>
            </li>
          ))}
        </ul>

        {/* Link */}
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition-colors"
        >
          Lire l'article
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </Card>
  );
};
