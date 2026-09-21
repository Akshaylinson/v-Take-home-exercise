export type TicketStatus = 'open' | 'resolved';

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string; // ISO 8601 string
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  customerName: string;
  orderNumber: string;
  phoneNumber: string;
  status: TicketStatus;
  createdAt: string; // ISO 8601 string
  resolvedAt?: string; // ISO 8601 string
  comments: Comment[];
}

export interface TicketFormData {
  customerName: string;
  orderNumber: string;
  phoneNumber: string;
  title: string;
  description: string;
}

export interface TicketFormErrors {
  customerName?: string;
  orderNumber?: string;
  phoneNumber?: string;
  title?: string;
  description?: string;
}

export type StatusFilter = 'all' | 'open' | 'resolved';

export type CurrentView = 
  | { type: 'list' }
  | { type: 'create' }
  | { type: 'details'; ticketId: string };
