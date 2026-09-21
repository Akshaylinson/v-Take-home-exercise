import { useEffect, useState, useCallback } from 'react';
import { CurrentView, Ticket, TicketFormData } from './types/ticket';
import {
  addCommentToTicket,
  createTicket,
  getSampleTickets,
  loadTickets,
  reopenTicket,
  resolveTicket,
  saveTickets,
} from './utils/storage';
import { Header } from './components/Header';
import { TicketsPage } from './pages/TicketsPage';
import { CreateTicketPage } from './pages/CreateTicketPage';
import { TicketDetailsPage } from './pages/TicketDetailsPage';
import { CheckCircle, X } from 'lucide-react';

interface ToastNotice {
  id: string;
  message: string;
  type: 'success' | 'info';
}

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentView, setCurrentView] = useState<CurrentView>({ type: 'list' });
  const [toast, setToast] = useState<ToastNotice | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Helper to show brief feedback toast
  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  }, []);

  // Hash-based view sync for back/forward navigation and deep links
  const syncViewFromHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#/, '').trim();
    if (hash === 'create') {
      setCurrentView({ type: 'create' });
    } else if (hash.startsWith('ticket/')) {
      const ticketId = hash.replace(/^ticket\//, '');
      if (ticketId) {
        setCurrentView({ type: 'details', ticketId });
      } else {
        setCurrentView({ type: 'list' });
      }
    } else {
      setCurrentView({ type: 'list' });
    }
  }, []);

  // Load tickets on mount & sync hash
  useEffect(() => {
    const storedTickets = loadTickets();
    setTickets(storedTickets);

    syncViewFromHash();
    window.addEventListener('hashchange', syncViewFromHash);
    return () => {
      window.removeEventListener('hashchange', syncViewFromHash);
    };
  }, [syncViewFromHash]);

  // Navigate helper that keeps hash in sync
  const navigate = useCallback((view: CurrentView) => {
    setCurrentView(view);
    if (view.type === 'list') {
      window.location.hash = 'tickets';
    } else if (view.type === 'create') {
      window.location.hash = 'create';
    } else if (view.type === 'details') {
      window.location.hash = `ticket/${view.ticketId}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Action: Create ticket
  const handleCreateTicket = (formData: TicketFormData) => {
    setIsCreating(true);
    try {
      const newTicket = createTicket(formData);
      // Reload tickets state
      setTickets(loadTickets());
      showToast(`Ticket ${newTicket.id} was successfully created!`);
      // Navigate to newly created ticket details as specified in 3.1
      navigate({ type: 'details', ticketId: newTicket.id });
    } catch (err) {
      console.error('Failed to create ticket:', err);
    } finally {
      setIsCreating(false);
    }
  };

  // Action: Resolve ticket
  const handleResolveTicket = (ticketId: string) => {
    const updated = resolveTicket(ticketId);
    if (updated) {
      setTickets(loadTickets());
      showToast(`Ticket ${ticketId} marked as Resolved.`);
    }
  };

  // Action: Reopen ticket
  const handleReopenTicket = (ticketId: string) => {
    const updated = reopenTicket(ticketId);
    if (updated) {
      setTickets(loadTickets());
      showToast(`Ticket ${ticketId} re-opened.`);
    }
  };

  // Action: Add comment
  const handleAddComment = (ticketId: string, content: string, author: string) => {
    const updated = addCommentToTicket(ticketId, content, author);
    if (updated) {
      setTickets(loadTickets());
      showToast('New comment note posted successfully.');
    }
  };

  // Action: Load sample data if user wants to populate mock records
  const handleLoadSampleData = () => {
    const samples = getSampleTickets();
    saveTickets(samples);
    setTickets(samples);
    showToast('Sample support tickets loaded into local storage.');
  };

  // Get active ticket for details view
  const activeTicket =
    currentView.type === 'details'
      ? tickets.find(
          (t) => t.id.toLowerCase() === currentView.ticketId.toLowerCase()
        )
      : undefined;

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Application Header */}
      <Header
        currentView={currentView}
        onNavigate={navigate}
        ticketCount={tickets.length}
      />

      {/* Toast Feedback Notification Banner */}
      {toast && (
        <div
          id="toast-notification"
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2"
        >
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" aria-hidden="true" />
          <span className="text-xs font-medium text-slate-800">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded-sm"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {currentView.type === 'list' && (
          <TicketsPage
            tickets={tickets}
            onSelectTicket={(ticketId) => navigate({ type: 'details', ticketId })}
            onCreateTicket={() => navigate({ type: 'create' })}
            onLoadSampleData={handleLoadSampleData}
          />
        )}

        {currentView.type === 'create' && (
          <CreateTicketPage
            onBack={() => navigate({ type: 'list' })}
            onSubmit={handleCreateTicket}
            isSubmitting={isCreating}
          />
        )}

        {currentView.type === 'details' && (
          <TicketDetailsPage
            ticket={activeTicket}
            onBack={() => navigate({ type: 'list' })}
            onResolve={handleResolveTicket}
            onReopen={handleReopenTicket}
            onAddComment={handleAddComment}
          />
        )}
      </main>

      {/* Footer */}
      <footer id="app-footer" className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Varanchi Software Developer Take-Home Assignment</span>
          <span className="text-slate-400 text-[11px]">
            Browser LocalStorage Persistence • Standalone Client-Side
          </span>
        </div>
      </footer>
    </div>
  );
}
