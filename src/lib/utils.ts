import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMetric(val: number, unit: string) {
  return `${val.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit}`;
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'CRITICAL':
      return 'text-status-critical bg-status-critical/10 border-status-critical/30';
    case 'WARNING':
      return 'text-status-warning bg-status-warning/10 border-status-warning/30';
    case 'NORMAL':
    default:
      return 'text-status-normal bg-status-normal/10 border-status-normal/30';
  }
}

export function getDomainColor(domain: string) {
  switch (domain) {
    case 'traffic':
      return 'text-domain-trafficLight bg-domain-traffic/10 border-domain-traffic/30';
    case 'electricity':
      return 'text-domain-electricityLight bg-domain-electricity/10 border-domain-electricity/30';
    case 'utilities':
      return 'text-domain-utilitiesLight bg-domain-utilities/10 border-domain-utilities/30';
    default:
      return 'text-ink-muted bg-surface-2 border-hairline';
  }
}
