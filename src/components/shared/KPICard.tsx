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
  detailLink = '/dashboard',
  trend,
}) => {
  const navigate = useNavigate();

  const statusBadge = {
    NORMAL: 'text-[#444444] dark:text-slate-300 bg-[#e8e8e8] dark:bg-slate-800 border-[#cfd9de] dark:border-slate-700',
    WARNING: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700',
    CRITICAL: 'text-white bg-rose-600 dark:bg-rose-700 border-rose-700 dark:border-rose-800',
  };

  const resolvedDelta = deltaText || (trend ? `${trend.direction === 'up' ? '+' : '-'}${trend.percentage}%` : subtext || '');

  return (
    <div
      onClick={() => navigate(detailLink)}
      className={cn(
        'bg-white dark:bg-[#111827] border border-[#cfd9de] dark:border-slate-800 p-5 rounded-lg cursor-pointer hover:border-[#444444] dark:hover:border-slate-600 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)] dark:shadow-none group flex flex-col justify-between'
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-[#71767b] dark:text-slate-400 uppercase tracking-wider">{title}</span>
          <div className="flex items-center gap-2">
            <span className={cn('px-2 py-0.5 rounded text-xs font-mono font-bold border uppercase tracking-wider', statusBadge[status])}>
              {status}
            </span>
            {Icon && <Icon className="w-4 h-4 text-[#71767b] dark:text-slate-400 group-hover:text-[#222222] dark:group-hover:text-slate-100 transition-colors" />}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2.5">
          <span className="text-2xl sm:text-3xl font-bold text-[#222222] dark:text-slate-100 tracking-tight">{value}</span>
          {unit && <span className="text-sm font-semibold text-[#71767b] dark:text-slate-400">{unit}</span>}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs sm:text-sm pt-2.5 border-t border-[#e8e8e8] dark:border-slate-800">
        <span className={cn('font-mono text-xs font-medium text-[#444444] dark:text-slate-300')}>
          {resolvedDelta}
        </span>
        <span className="text-xs sm:text-sm font-medium text-[#006be6] dark:text-blue-400 group-hover:underline">View Sector →</span>
      </div>
    </div>
  );
};
