import { TicketStatus } from '../types/ticket';
import { CheckCircle2, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const isResolved = status === 'resolved';

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : 'px-2.5 py-1 text-xs font-medium tracking-wide';

  if (isResolved) {
    return (
      <span
        id={`status-badge-${status}`}
        className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 ${sizeClasses}`}
        title="Ticket is Resolved"
      >
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
        <span>Resolved</span>
      </span>
    );
  }

  return (
    <span
      id={`status-badge-${status}`}
      className={`inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-800 ${sizeClasses}`}
      title="Ticket is Open"
    >
      <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" aria-hidden="true" />
      <span>Open</span>
    </span>
  );
}
