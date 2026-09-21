import { Ticket, TicketFormData, Comment } from '../types/ticket';

export const STORAGE_KEY = 'varanchi_support_tickets';

/**
 * Safely loads tickets from browser localStorage.
 * Handles missing data, empty values, and corrupted JSON.
 */
export function loadTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch (error) {
    console.error('Failed to read tickets from localStorage:', error);
    return [];
  }
}

/**
 * Safely saves the full list of tickets to browser localStorage.
 */
export function saveTickets(tickets: Ticket[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    return true;
  } catch (error) {
    console.error('Failed to save tickets to localStorage:', error);
    return false;
  }
}

/**
 * Finds a ticket by ID.
 */
export function getTicketById(id: string): Ticket | undefined {
  const tickets = loadTickets();
  return tickets.find((t) => t.id.toLowerCase() === id.toLowerCase());
}

/**
 * Generates a clean human-readable ticket ID like TK-1042
 */
function generateTicketId(existingTickets: Ticket[]): string {
  // If we have tickets, try to increment sequence or pick unique random 4-digit code
  let newId = '';
  let attempts = 0;
  while (attempts < 100) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    newId = `TK-${randomNum}`;
    if (!existingTickets.some((t) => t.id === newId)) {
      return newId;
    }
    attempts++;
  }
  return `TK-${Date.now().toString().slice(-4)}`;
}

/**
 * Creates and stores a new ticket.
 * Preserves all existing tickets.
 */
export function createTicket(data: TicketFormData): Ticket {
  const existingTickets = loadTickets();
  const id = generateTicketId(existingTickets);
  const now = new Date().toISOString();

  const newTicket: Ticket = {
    id,
    title: data.title.trim(),
    description: data.description.trim(),
    customerName: data.customerName.trim(),
    orderNumber: data.orderNumber.trim(),
    phoneNumber: data.phoneNumber.trim(),
    status: 'open',
    createdAt: now,
    comments: [],
  };

  const updatedTickets = [newTicket, ...existingTickets];
  saveTickets(updatedTickets);
  return newTicket;
}

/**
 * Adds a comment to an existing ticket.
 */
export function addCommentToTicket(
  ticketId: string,
  content: string,
  author: string
): Ticket | null {
  const existingTickets = loadTickets();
  const index = existingTickets.findIndex(
    (t) => t.id.toLowerCase() === ticketId.toLowerCase()
  );

  if (index === -1) {
    return null;
  }

  const target = existingTickets[index];
  const newComment: Comment = {
    id: `cm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    content: content.trim(),
    author: author.trim() || 'Support Agent',
    createdAt: new Date().toISOString(),
  };

  const updatedTicket: Ticket = {
    ...target,
    comments: [...target.comments, newComment],
  };

  existingTickets[index] = updatedTicket;
  saveTickets(existingTickets);
  return updatedTicket;
}

/**
 * Marks a ticket as resolved.
 */
export function resolveTicket(ticketId: string): Ticket | null {
  const existingTickets = loadTickets();
  const index = existingTickets.findIndex(
    (t) => t.id.toLowerCase() === ticketId.toLowerCase()
  );

  if (index === -1) {
    return null;
  }

  const target = existingTickets[index];
  if (target.status === 'resolved') {
    return target; // Already resolved
  }

  const updatedTicket: Ticket = {
    ...target,
    status: 'resolved',
    resolvedAt: new Date().toISOString(),
  };

  existingTickets[index] = updatedTicket;
  saveTickets(existingTickets);
  return updatedTicket;
}

/**
 * Re-opens a resolved ticket (useful convenience action).
 */
export function reopenTicket(ticketId: string): Ticket | null {
  const existingTickets = loadTickets();
  const index = existingTickets.findIndex(
    (t) => t.id.toLowerCase() === ticketId.toLowerCase()
  );

  if (index === -1) {
    return null;
  }

  const target = existingTickets[index];
  const updatedTicket: Ticket = {
    ...target,
    status: 'open',
  };

  existingTickets[index] = updatedTicket;
  saveTickets(existingTickets);
  return updatedTicket;
}

/**
 * Sample dataset for demonstration or testing if user clicks "Load Sample Data".
 */
export function getSampleTickets(): Ticket[] {
  return [
    {
      id: 'TK-1001',
      title: 'Damaged item received in package',
      description:
        'Customer received order with broken seal and dented metal housing. They requested an immediate replacement or full refund.',
      customerName: 'Aarav Sharma',
      orderNumber: 'ORD-88291',
      phoneNumber: '+1 (555) 234-5678',
      status: 'open',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      comments: [
        {
          id: 'cm_1',
          author: 'Support Agent',
          content: 'Contacted warehouse logistics to verify packaging quality inspection photos.',
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        },
        {
          id: 'cm_2',
          author: 'Customer Care Lead',
          content: 'Requested photo evidence from customer via WhatsApp/SMS.',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ],
    },
    {
      id: 'TK-1002',
      title: 'Delayed delivery beyond scheduled window',
      description:
        'Order was scheduled for express two-day delivery on Friday, but tracking still shows in-transit at regional sorting hub.',
      customerName: 'Priya Patel',
      orderNumber: 'ORD-89410',
      phoneNumber: '+1 (555) 876-5432',
      status: 'resolved',
      createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
      resolvedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      comments: [
        {
          id: 'cm_3',
          author: 'Support Agent',
          content: 'Dispatched expedited courier pickup with courier partner supervisor.',
          createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        },
        {
          id: 'cm_4',
          author: 'Support Agent',
          content: 'Customer confirmed package arrived safely and intact. Issue resolved.',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ],
    },
    {
      id: 'TK-1003',
      title: 'Billing address typo preventing invoice generation',
      description:
        'Customer entered incorrect ZIP code during checkout and needs updated tax invoice for corporate reimbursement.',
      customerName: 'David Miller',
      orderNumber: 'ORD-90214',
      phoneNumber: '+1 (555) 432-1098',
      status: 'open',
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      comments: [],
    },
  ];
}
