import { useState, useMemo } from 'react';
import { Database, Filter, PlusCircle, Search, Ticket as TicketIcon } from 'lucide-react';
import { StatusFilter, Ticket } from '../types/ticket';
import { TicketCard } from '../components/TicketCard';

interface TicketsPageProps {
  tickets: Ticket[];
  onSelectTicket: (ticketId: string) => void;
  onCreateTicket: () => void;
  onLoadSampleData?: () => void;
}

export function TicketsPage({
  tickets,
  onSelectTicket,
  onCreateTicket,
  onLoadSampleData,
}: TicketsPageProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts
  const counts = useMemo(() => {
    const open = tickets.filter((t) => t.status === 'open').length;
    const resolved = tickets.filter((t) => t.status === 'resolved').length;
    return {
      all: tickets.length,
      open,
      resolved,
    };
  }, [tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Status filter
      if (statusFilter === 'open' && ticket.status !== 'open') return false;
      if (statusFilter === 'resolved' && ticket.status !== 'resolved') return false;

      // Search query (matches ID, title, customer name, order number)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchId = ticket.id.toLowerCase().includes(query);
        const matchTitle = ticket.title.toLowerCase().includes(query);
        const matchCustomer = ticket.customerName.toLowerCase().includes(query);
        const matchOrder = ticket.orderNumber.toLowerCase().includes(query);
        return matchId || matchTitle || matchCustomer || matchOrder;
      }

      return true;
    });
  }, [tickets, statusFilter, searchQuery]);

  return (
    <div id="tickets-page" className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 id="tickets-page-heading" className="text-2xl font-bold tracking-tight text-slate-900">
            Support Tickets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage, investigate, and resolve incoming customer service inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tickets.length === 0 && onLoadSampleData && (
            <button
              type="button"
              id="btn-load-sample-data"
              onClick={onLoadSampleData}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400 transition cursor-pointer"
            >
              <Database className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              <span>Load Sample Data</span>
            </button>
          )}

          <button
            type="button"
            id="btn-create-ticket-page"
            onClick={onCreateTicket}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-indigo-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 transition cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        {/* Status Filter Tabs */}
        <div
          id="status-filter-group"
          role="tablist"
          aria-label="Filter tickets by status"
          className="inline-flex items-center rounded-lg bg-slate-100 p-1 text-xs font-medium"
        >
          <button
            type="button"
            id="filter-tab-all"
            role="tab"
            aria-selected={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>All</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                statusFilter === 'all'
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-slate-200/60 text-slate-600'
              }`}
            >
              {counts.all}
            </span>
          </button>

          <button
            type="button"
            id="filter-tab-open"
            role="tab"
            aria-selected={statusFilter === 'open'}
            onClick={() => setStatusFilter('open')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition cursor-pointer ${
              statusFilter === 'open'
                ? 'bg-white text-amber-800 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
            <span>Open</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                statusFilter === 'open'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-200/60 text-slate-600'
              }`}
            >
              {counts.open}
            </span>
          </button>

          <button
            type="button"
            id="filter-tab-resolved"
            role="tab"
            aria-selected={statusFilter === 'resolved'}
            onClick={() => setStatusFilter('resolved')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition cursor-pointer ${
              statusFilter === 'resolved'
                ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>Resolved</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                statusFilter === 'resolved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200/60 text-slate-600'
              }`}
            >
              {counts.resolved}
            </span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            id="ticket-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets, orders, names..."
            className="block w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Ticket List / States */}
      <div id="tickets-list-container">
        {tickets.length === 0 ? (
          /* Empty state: No tickets at all */
          <div
            id="empty-tickets-state"
            className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-2xs"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-3">
              <TicketIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">No support tickets yet</h2>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
              Create your first ticket to get started tracking customer requests and orders.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                id="btn-create-first-ticket"
                onClick={onCreateTicket}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-2xs hover:bg-indigo-700 transition cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
                <span>Create your first ticket</span>
              </button>
              {onLoadSampleData && (
                <button
                  type="button"
                  id="btn-load-sample-empty-state"
                  onClick={onLoadSampleData}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  <Database className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                  <span>Load Sample Tickets</span>
                </button>
              )}
            </div>
          </div>
        ) : filteredTickets.length === 0 ? (
          /* Empty state: Filter returned nothing */
          <div
            id="filter-empty-state"
            className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center"
          >
            <Filter className="h-8 w-8 text-slate-400 mb-2" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-slate-900">No matching tickets found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              {searchQuery
                ? `No tickets match "${searchQuery}" in ${statusFilter} tickets.`
                : `There are currently no tickets with status "${statusFilter}".`}
            </p>
            <button
              type="button"
              id="btn-reset-filters"
              onClick={() => {
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div id="tickets-grid" className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onSelect={onSelectTicket}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
