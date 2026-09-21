import { ArrowLeft } from 'lucide-react';
import { TicketFormData } from '../types/ticket';
import { TicketForm } from '../components/TicketForm';

interface CreateTicketPageProps {
  onBack: () => void;
  onSubmit: (formData: TicketFormData) => void;
  isSubmitting?: boolean;
}

export function CreateTicketPage({
  onBack,
  onSubmit,
  isSubmitting = false,
}: CreateTicketPageProps) {
  return (
    <div id="create-ticket-page" className="max-w-2xl mx-auto space-y-6">
      {/* Top navigation back button */}
      <div>
        <button
          type="button"
          id="btn-back-to-tickets-from-create"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition mb-3 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to Tickets</span>
        </button>

        <h1 id="create-ticket-heading" className="text-2xl font-bold tracking-tight text-slate-900">
          Create New Support Ticket
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Record a new customer support issue. All fields are required to ensure timely resolution.
        </p>
      </div>

      {/* Form */}
      <TicketForm
        onSubmit={onSubmit}
        onCancel={onBack}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
