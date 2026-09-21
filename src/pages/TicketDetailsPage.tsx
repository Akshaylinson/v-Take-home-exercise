import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Copy,
  FileText,
  Package,
  Phone,
  RefreshCw,
  User,
} from 'lucide-react';
import { Ticket } from '../types/ticket';
import { StatusBadge } from '../components/StatusBadge';
import { CommentThread } from '../components/CommentThread';

interface TicketDetailsPageProps {
  ticket: Ticket | undefined;
  onBack: () => void;
  onResolve: (ticketId: string) => void;
  onReopen?: (ticketId: string) => void;
  onAddComment: (ticketId: string, content: string, author: string) => void;
}

export function TicketDetailsPage({
  ticket,
  onBack,
  onResolve,
  onReopen,
  onAddComment,
}: TicketDetailsPageProps) {
  const [copied, setCopied] = useState(false);

  // If ticket not found
  if (!ticket) {
    return (
      <div
        id="ticket-not-found-view"
        className="max-w-xl mx-auto my-12 text-center rounded-xl border border-slate-200 bg-white p-8 shadow-xs"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mx-auto mb-3">
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Ticket Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-5">
          The requested ticket does not exist, may have been removed, or the ID is invalid.
        </p>
        <button
          type="button"
          id="btn-return-to-tickets"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-2xs hover:bg-indigo-700 transition cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Return to Support Tickets</span>
        </button>
      </div>
    );
  }

  const isResolved = ticket.status === 'resolved';

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return dateString;
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(ticket.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="ticket-details-page" className="max-w-4xl mx-auto space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          id="btn-back-to-tickets-from-details"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to Tickets</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Quick copy ID */}
          <button
            type="button"
            id="btn-copy-ticket-id"
            onClick={handleCopyId}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Copy Ticket ID to clipboard"
          >
            <Copy className="h-3 w-3" aria-hidden="true" />
            <span>{copied ? 'Copied!' : ticket.id}</span>
          </button>
        </div>
      </div>

      {/* Main Ticket Summary Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7 shadow-2xs space-y-5">
        {/* Header: Title, ID, Status and Action */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {ticket.id}
              </span>
              <StatusBadge status={ticket.status} />
            </div>
            <h1 id="ticket-details-title" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {ticket.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-0.5">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                Created: {formatDate(ticket.createdAt)}
              </span>
              {ticket.resolvedAt && (
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  Resolved: {formatDate(ticket.resolvedAt)}
                </span>
              )}
            </div>
          </div>

          {/* Action: Mark as Resolved */}
          <div className="flex items-center gap-2 pt-1 sm:pt-0">
            {!isResolved ? (
              <button
                type="button"
                id="btn-mark-resolved"
                onClick={() => onResolve(ticket.id)}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 transition cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Mark as Resolved</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  id="ticket-already-resolved-notice"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-800"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  <span>Ticket Resolved</span>
                </span>
                {onReopen && (
                  <button
                    type="button"
                    id="btn-reopen-ticket"
                    onClick={() => onReopen(ticket.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                    title="Re-open ticket if further investigation is required"
                  >
                    <RefreshCw className="h-3 w-3" aria-hidden="true" />
                    <span>Reopen</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Customer Information Panel */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4 text-xs">
            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                Customer Name
              </span>
              <p id="details-customer-name" className="font-semibold text-slate-900">
                {ticket.customerName}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Package className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                Order Number
              </span>
              <p id="details-order-number" className="font-mono font-semibold text-slate-900">
                {ticket.orderNumber}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                Phone Number
              </span>
              <a
                id="details-phone-number"
                href={`tel:${ticket.phoneNumber}`}
                className="font-semibold text-indigo-600 hover:underline"
              >
                {ticket.phoneNumber}
              </a>
            </div>
          </div>
        </div>

        {/* Issue Description */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            Issue Description
          </h2>
          <div className="rounded-lg border border-slate-100 bg-slate-50/40 p-4 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
            <p id="details-description">{ticket.description}</p>
          </div>
        </div>
      </div>

      {/* Comments & Activity Section */}
      <CommentThread
        comments={ticket.comments}
        ticketId={ticket.id}
        onAddComment={(content, author) => onAddComment(ticket.id, content, author)}
      />
    </div>
  );
}
