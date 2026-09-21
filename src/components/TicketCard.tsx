import { Calendar, ChevronRight, MessageSquare, Package, User } from 'lucide-react';
import { Ticket } from '../types/ticket';
import { StatusBadge } from './StatusBadge';

interface TicketCardProps {
  ticket: Ticket;
  onSelect: (ticketId: string) => void;
}

export function TicketCard({ ticket, onSelect }: TicketCardProps) {
  // Format creation date nicely
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div
      id={`ticket-card-${ticket.id}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(ticket.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(ticket.id);
        }
      }}
      className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xs transition-all duration-150 hover:border-slate-300 hover:shadow-xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 cursor-pointer"
    >
      <div>
        {/* Top bar: ID and Status */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span
              id={`ticket-id-tag-${ticket.id}`}
              className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 tracking-wider"
            >
              {ticket.id}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              {formatDate(ticket.createdAt)}
            </span>
          </div>
          <StatusBadge status={ticket.status} size="sm" />
        </div>

        {/* Title */}
        <h3
          id={`ticket-title-${ticket.id}`}
          className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1.5"
        >
          {ticket.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {ticket.description}
        </p>
      </div>

      {/* Footer Info: Customer, Order, Comments count */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <User className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span id={`ticket-customer-${ticket.id}`}>{ticket.customerName}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span className="font-mono" id={`ticket-order-${ticket.id}`}>
              {ticket.orderNumber}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {ticket.comments.length > 0 && (
            <span
              id={`ticket-comments-count-${ticket.id}`}
              className="flex items-center gap-1 text-slate-500 font-medium"
              title={`${ticket.comments.length} comments`}
            >
              <MessageSquare className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>{ticket.comments.length}</span>
            </span>
          )}
          <span className="inline-flex items-center text-xs font-medium text-indigo-600 group-hover:translate-x-0.5 transition-transform">
            View Details
            <ChevronRight className="h-3.5 w-3.5 ml-0.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </div>
  );
}
