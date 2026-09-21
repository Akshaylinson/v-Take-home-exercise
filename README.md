# Varanchi Support Desk

Customer Support Ticket Management System built for the **Varanchi Software Developer Take-Home Assignment**.

A clean, responsive, and standalone web application that allows customer support agents to track customer issues, manage order inquiries, maintain chronological notes/comment threads, and mark tickets as resolved.

---

## 1. Project Overview

**Varanchi Support Desk** is a dedicated support desk tool designed to empower support agents to quickly log, inspect, and resolve customer issues. It operates entirely in the browser using client-side React and TypeScript, persisting all state directly inside the browser's `localStorage`. No external servers, databases, or API keys are required.

---

## 2. Features

- **Ticket Creation**:
  - Customer identification capture: Customer Name, Order Number, Phone Number.
  - Ticket details: Title and detailed Issue Description.
  - Comprehensive form validation with live feedback and accessible error messages.
  - Automatic unique Ticket ID generation (`TK-XXXX`).
  - Automatic timestamping in ISO 8601 format and initial "Open" status.
- **Ticket List View**:
  - Displays all tickets with ID, title, customer name, order number, status badge, creation date, and comment counts.
  - Filter by ticket status: **All**, **Open**, or **Resolved** with live counters.
  - Quick search across Ticket ID, title, customer name, and order numbers.
  - Friendly empty state with clear calls-to-action.
- **Ticket Details View**:
  - Full display of ticket information, customer contact details, and timestamp history.
  - Copyable Ticket ID for quick reference.
  - Responsive layout separating customer context from the running activity thread.
  - Graceful "Not Found" state handling for invalid ticket IDs with navigation back to the list.
- **Activity & Comment Thread**:
  - Running chronological conversation and update thread for each ticket.
  - Shows author name/role and formatted timestamp.
  - Configurable author name (defaults to "Support Agent").
  - Real-time updates without refreshing the page.
- **Resolution Workflow**:
  - One-click "Mark as Resolved" action that updates status and records resolution timestamp.
  - Clear visual distinction between Open and Resolved tickets.
  - Reversible "Reopen" action if additional investigation is needed.
- **Persistent Storage**:
  - Robust browser `localStorage` engine under key `varanchi_support_tickets`.
  - Resilient JSON parsing with error handling and fallback defaults.
  - Preserves existing tickets on every write.
  - Optional "Load Sample Data" action to quickly preview realistic customer support scenarios.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript
- **Build Tool & Dev Server**: Vite
- **Styling**: Tailwind CSS v4 (utility-first, responsive, accessible contrast)
- **Icons**: `lucide-react`
- **State Management**: Built-in React state (`useState`, `useEffect`, `useCallback`, `useMemo`)
- **Routing**: Lightweight hash-based router (`#tickets`, `#create`, `#ticket/:id`) providing browser history support without heavy external router dependencies
- **Data Persistence**: Browser `localStorage` (Key: `varanchi_support_tickets`)

---

## 4. Storage Approach

Data persistence is encapsulated in `src/utils/storage.ts`:

- **Storage Key**: `varanchi_support_tickets`
- **Data Format**: Standard JSON array containing typed `Ticket` objects.
- **Resilience**:
  - `loadTickets()` wraps `localStorage.getItem` in a `try...catch` block.
  - Checks whether parsed data is a valid array; if null or corrupted, it safely falls back to `[]`.
  - `saveTickets()` writes the entire array atomically to ensure existing tickets and comments are never inadvertently overwritten.
  - Ticket ID generator ensures unique IDs across multiple ticket creations.

---

## 5. Setup Instructions

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

---

## 6. Installation Commands

Clone or extract the repository and install dependencies:

```bash
npm install
```

---

## 7. How to Run Locally

Start the Vite local development server:

```bash
npm run dev
```

The application will be accessible at:
```
http://localhost:3000
```
*(Or the host/port displayed in your terminal).*

---

## 8. How to Build the Project

To verify TypeScript types and generate the optimized production static bundle:

```bash
# Typecheck
npm run lint

# Production build
npm run build
```

The compiled static files are generated in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## 9. How to Use the Application

1. **Viewing Tickets**: The main dashboard displays all tickets. Use the filter tabs (**All**, **Open**, **Resolved**) or the search bar to find specific records.
2. **Creating a Ticket**: Click **Create Ticket** in the top navigation or on the dashboard. Fill out the Customer Name, Order Number, Phone Number, Title, and Description. Click **Create Ticket**. You will be taken directly to the newly created ticket.
3. **Reviewing Details**: Click any ticket card in the list to view its customer information, issue description, and activity thread.
4. **Adding Updates**: Scroll down to the **Activity & Comments** section on the ticket details view, write an update, and click **Add Comment**.
5. **Resolving a Ticket**: On the details view, click the green **Mark as Resolved** button. The ticket status updates immediately to "Resolved" and is reflected across the application.

---

## 10. Project Structure

```
├── public/
├── src/
│   ├── components/
│   │   ├── CommentThread.tsx   # Chronological comments list and add-comment form
│   │   ├── Header.tsx          # Navigation bar with brand and active view indicator
│   │   ├── StatusBadge.tsx     # Reusable Open / Resolved visual badge
│   │   ├── TicketCard.tsx      # Individual ticket card component for the list view
│   │   └── TicketForm.tsx      # Validated ticket creation form
│   ├── pages/
│   │   ├── CreateTicketPage.tsx # Page container for creating tickets
│   │   ├── TicketDetailsPage.tsx# Page displaying ticket info, customer info, and comments
│   │   └── TicketsPage.tsx      # Dashboard page with filtering and ticket grid
│   ├── types/
│   │   └── ticket.ts           # Core TypeScript interfaces (Ticket, Comment, Form)
│   ├── utils/
│   │   └── storage.ts          # Encapsulated localStorage CRUD and validation logic
│   ├── App.tsx                 # Root application component and view router
│   ├── index.css               # Global styling entry point with Tailwind CSS
│   └── main.tsx                # React application DOM root
├── index.html                  # HTML5 entry document
├── metadata.json               # Platform configuration metadata
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite bundler configuration
```

---

## 11. Known Limitations

- **Browser Storage Scope**: Data is stored inside browser `localStorage`. Tickets created in one browser or in incognito mode will not sync to another browser.
- **Single-Tenant Demo Author**: While comments allow custom author names, there is no real-world multi-user authentication system since the brief explicitly prioritized a standalone client-side solution.
- **Attachment Uploads**: File/photo attachments are not stored in tickets to avoid exceeding the ~5MB quota limit of browser `localStorage`.

---

## 12. Future Improvements

- **Export & Import**: Ability to export tickets to JSON or CSV for reporting, or import backups.
- **Priority & Categorization**: Introducing Priority levels (High, Medium, Low) and Category tags (Shipping, Billing, Returns).
- **Canned Responses**: Quick template notes for common customer inquiries (e.g., tracking link sent, refund initiated).
- **Backend Synchronization**: Optional REST or GraphQL API backend integration with PostgreSQL or Firestore for team-wide collaboration.

---

## 13. AI Usage Note

During the development of this project:
- **What AI was asked to do**: AI was asked to implement the customer support ticket management application according to the Varanchi assignment specification, ensuring clean TypeScript types, reliable localStorage persistence, status filtering, accessible form validation, and a cohesive UI layout.
- **Where AI helped**: AI rapidly generated the initial component skeletons, TypeScript interface definitions, and Tailwind CSS layouts, ensuring adherence to the strict take-home assignment requirements.
- **Corrections and Overrides Made**:
  - Streamlined routing to use a resilient URL hash synchronization mechanism rather than injecting an oversized external router library, preventing router misconfigurations in sandboxed environments.
  - Implemented safe JSON parsing and schema verification within `storage.ts` so malformed or legacy browser data would not break the UI.
  - Enforced clear button states and confirmation notifications to prevent accidental double-clicks or repeated resolution actions.
