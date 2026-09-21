import { Headphones, PlusCircle, Ticket as TicketIcon } from 'lucide-react';
import { CurrentView } from '../types/ticket';

interface HeaderProps {
  currentView: CurrentView;
  onNavigate: (view: CurrentView) => void;
  ticketCount: number;
}

export function Header({ currentView, onNavigate, ticketCount }: HeaderProps) {
  const isTicketsActive = currentView.type === 'list' || currentView.type === 'details';
  const isCreateActive = currentView.type === 'create';

  return (
    <header id="app-header" className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand / Logo */}
        <button
          id="brand-home-button"
          onClick={() => onNavigate({ type: 'list' })}
          className="group flex items-center gap-3 text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 rounded-md"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs transition group-hover:bg-indigo-700">
            <Headphones className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 tracking-tight text-base sm:text-lg">
                Varanchi Support Desk
              </span>
              <span className="hidden sm:inline-block rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Customer issue tracking & resolution
            </p>
          </div>
        </button>

        {/* Navigation */}
        <nav id="main-navigation" className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="nav-tickets-button"
            onClick={() => onNavigate({ type: 'list' })}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition cursor-pointer ${
              isTicketsActive
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <TicketIcon className="h-4 w-4" aria-hidden="true" />
            <span>Tickets</span>
            {ticketCount > 0 && (
              <span className="ml-1 rounded-full bg-slate-200 px-1.5 py-0.2 text-[11px] font-semibold text-slate-700">
                {ticketCount}
              </span>
            )}
          </button>

          <button
            id="nav-create-ticket-button"
            onClick={() => onNavigate({ type: 'create' })}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition cursor-pointer ${
              isCreateActive
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            <span>Create Ticket</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
