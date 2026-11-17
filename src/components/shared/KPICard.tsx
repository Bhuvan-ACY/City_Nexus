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
    NORMAL: 'text-[#444444] bg-[#e8e8e8] border-[#cfd9de]',
    WARNING: 'text-[#222222] bg-[#e8e8e8] border-[#808080]',
    CRITICAL: 'text-white bg-[#222222] border-[#0a0a0a]',
  };

  const resolvedDelta = deltaText || (trend ? `${trend.direction === 'up' ? '+' : '-'}${trend.percentage}%` : subtext || '');

  return (
    <div
      onClick={() => navigate(detailLink)}
      className={cn(
        'bg-white border border-[#cfd9de] p-4 rounded-lg cursor-pointer hover:border-[#444444] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)] group flex flex-col justify-between'
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-[#71767b] uppercase tracking-wider">{title}</span>
          <div className="flex items-center gap-1.5">
            <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border uppercase tracking-wider', statusBadge[status])}>
              {status}
            </span>
            {Icon && <Icon className="w-3.5 h-3.5 text-[#71767b] group-hover:text-[#222222] transition-colors" />}
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-2xl font-bold text-[#222222] tracking-tight">{value}</span>
          {unit && <span className="text-xs font-semibold text-[#71767b]">{unit}</span>}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-[#e8e8e8]">
        <span className={cn('font-mono text-[11px] font-medium text-[#444444]')}>
          {resolvedDelta}
        </span>
        <span className="text-[11px] font-medium text-[#006be6] group-hover:underline">View Sector →</span>
      </div>
    </div>
  );
};
