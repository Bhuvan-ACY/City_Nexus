import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  deltaText?: string;
  isPositive?: boolean;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  icon?: LucideIcon;
  domain?: 'traffic' | 'electricity' | 'utilities';
  domainColor?: 'traffic' | 'electricity' | 'utilities';
  detailLink?: string;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit = '',
  subtext,
  deltaText,
  isPositive = false,
  status,
  icon: Icon,
  domain,
  domainColor,
  detailLink = '/dashboard',
  trend,
}) => {
  const navigate = useNavigate();
  const effectiveDomain = domainColor || domain || 'traffic';

  const domainStyles = {
    traffic: 'border-l-4 border-l-domain-traffic',
    electricity: 'border-l-4 border-l-domain-electricity',
    utilities: 'border-l-4 border-l-domain-utilities',
  };

  const statusBadge = {
    NORMAL: 'text-status-normal bg-status-normal/10 border-status-normal/30',
    WARNING: 'text-status-warning bg-status-warning/10 border-status-warning/30',
    CRITICAL: 'text-status-critical bg-status-critical/10 border-status-critical/30',
  };

  const resolvedDelta = deltaText || (trend ? `${trend.direction === 'up' ? '+' : '-'}${trend.percentage}%` : subtext || '');

  return (
    <div
      onClick={() => navigate(detailLink)}
      className={cn(
        'bg-surface-1 border border-hairline p-5 rounded-xl cursor-pointer hover:bg-surface-2 transition-all shadow-sm hover:border-hairline/80 group',
        domainStyles[effectiveDomain]
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">{title}</span>
        <div className="flex items-center gap-2">
          <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider', statusBadge[status])}>
            {status}
          </span>
          {Icon && <Icon className="w-4 h-4 text-ink-muted group-hover:text-ink transition-colors" />}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-extrabold text-ink tracking-tight">{value}</span>
        {unit && <span className="text-sm font-semibold text-ink-muted">{unit}</span>}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className={cn('font-medium', isPositive ? 'text-status-critical' : 'text-status-normal')}>
          {resolvedDelta}
        </span>
        <span className="text-[11px] text-ink-muted group-hover:underline">View Sector →</span>
      </div>
    </div>
  );
};
