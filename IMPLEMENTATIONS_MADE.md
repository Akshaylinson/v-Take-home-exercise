# Varanchi Support Desk: Implementation Guide

## Purpose and scope

Varanchi Support Desk is a small single-page customer-support application. It lets an agent create a ticket, browse and search tickets, open a ticket’s complete context, add timestamped notes to that ticket, and resolve or reopen it.

It is intentionally a browser-only application. It has no server-side API, database, login system, or external network call in the ticket workflow. The source code does not call `fetch`, `axios`, Express, or the Google GenAI package. Ticket data is persisted in the current browser through `localStorage`.

## Technology and runtime architecture

- **React 19 + TypeScript** renders the UI and defines the ticket data contracts.
- **Vite** starts the development server and creates the production build.
- **Tailwind CSS** provides the responsive visual styles; **lucide-react** supplies icons.
- **Browser `localStorage`** is the persistence layer, under the key `varanchi_support_tickets`.
- **Hash routing** controls views without React Router:
  - `#tickets` — ticket list
  - `#create` — new-ticket form
  - `#ticket/TK-1234` — an individual ticket

The entry point is `src/main.tsx`. It mounts `App` into the `#root` element from `index.html`. `src/App.tsx` is the coordinator: it loads ticket data, keeps the active screen in state, performs navigation, invokes storage functions, and passes callbacks down to page components.

```text
User action
   ↓
Page/component event handler
   ↓
Callback owned by App.tsx
   ↓
src/utils/storage.ts reads/writes localStorage
   ↓
App reloads tickets into React state
   ↓
Affected list/detail/comment UI re-renders immediately
```

## Ticket and comment data model

The types in `src/types/ticket.ts` define the core records.

```ts
Ticket {
  id: string;                 // Generated e.g. TK-1042
  title: string;
  description: string;
  customerName: string;
  orderNumber: string;
  phoneNumber: string;
  status: 'open' | 'resolved';
  createdAt: string;          // ISO timestamp
  resolvedAt?: string;        // ISO timestamp when resolved
  comments: Comment[];
}

Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;          // ISO timestamp
}
```

Each ticket owns its own `comments` array. Therefore, notes added while viewing one ticket cannot appear on another ticket. The array is appended in order, so the UI displays the oldest note first and the newest note last.

## Application startup and navigation workflow

1. `main.tsx` renders `<App />`.
2. On mount, the `useEffect` in `App.tsx` calls `loadTickets()` from `src/utils/storage.ts` and stores the result in React state (`tickets`).
3. The same effect calls `syncViewFromHash()` and listens for `hashchange`. This makes direct links and browser back/forward navigation work.
4. When a page requests navigation, `navigate(view)` updates both React state and `window.location.hash`, then scrolls the window to the top.
5. `App.tsx` conditionally renders one of these page containers:
   - `TicketsPage` for the list
   - `CreateTicketPage` for the form
   - `TicketDetailsPage` for one ticket

If a ticket ID in the URL does not exist, `TicketDetailsPage` shows a clear “Ticket Not Found” screen rather than failing.

## Workflow: create a ticket

### User experience

An agent clicks **Create Ticket** in the header or list page, fills in customer name, order number, phone number, short title, and issue description, then presses **Create Ticket**. The app opens the newly created ticket immediately and displays a success toast.

### Execution path

1. `src/components/Header.tsx` or `src/pages/TicketsPage.tsx` invokes `onCreateTicket`.
2. `App.tsx` calls `navigate({ type: 'create' })`, setting the URL to `#create`.
3. `CreateTicketPage.tsx` renders `TicketForm.tsx`.
4. `TicketForm` manages the inputs with `useState`. Its `handleBlur` validates a field when it loses focus; `handleSubmit` validates every field before it calls `onSubmit(formData)`.
5. Validation is implemented in `TicketForm.validateField()`:
   - customer name: required, minimum two characters
   - order number: required, minimum three characters
   - phone number: required, at least seven numeric/`+` characters
   - title: required, minimum four characters
   - description: required, minimum ten characters
6. The callback reaches `App.handleCreateTicket(formData)`.
7. `createTicket(formData)` in `storage.ts`:
   - calls `loadTickets()` to preserve current records;
   - creates a unique `TK-XXXX` ID with `generateTicketId()`;
   - trims the submitted text;
   - assigns status `open`, a `createdAt` ISO timestamp, and an empty comments array;
   - saves the new ticket at the beginning of the array with `saveTickets()`.
8. `App` calls `loadTickets()` again to refresh its state, shows a success message, and navigates to `#ticket/<new-id>`.

The “Auto-fill sample data” control in `TicketForm` only fills the form for demonstration; it does not save anything until the agent submits it.

## Workflow: view, search, and filter tickets

### User experience

The list page shows ticket cards with the ticket ID, title, a short description, customer, order number, creation date, status, and comment count. An agent can choose **All**, **Open**, or **Resolved**, search by ticket ID/title/customer/order number, and click a card to open it.

### Execution path

1. `App.tsx` renders `TicketsPage` with the current `tickets` array.
2. `TicketsPage.tsx` uses `useMemo` to derive:
   - status counts (`all`, `open`, `resolved`);
   - `filteredTickets`, based on the selected status and text search.
3. Each result is rendered with `TicketCard.tsx`.
4. A card click or keyboard Enter/Space invokes `onSelect(ticket.id)`.
5. `App` navigates to `#ticket/<id>`, finds the corresponding ticket in its in-memory `tickets` state, and passes it to `TicketDetailsPage`.

The filter and search values are page-local UI state. They do not change or write the tickets themselves.

## Workflow: inspect one ticket and its customer context

### User experience

The details screen presents the complete ticket: its ID, status, title, created/resolved time, customer name, order number, phone number, full issue description, and activity/comments thread. The phone number is rendered as a `tel:` link, and the ticket ID can be copied to the clipboard.

### Execution path

1. `TicketDetailsPage.tsx` receives a `Ticket | undefined` from `App.tsx`.
2. It determines `isResolved` from `ticket.status` and formats stored ISO dates for the agent’s locale.
3. It renders the ticket fields directly from the received record and embeds `CommentThread` with `ticket.comments`.
4. When the ticket does not exist, it renders the not-found state and a button back to the list.

## Workflow: add an agent update or comment paragraph

### User experience

At the bottom of a ticket’s details page, the agent enters a comment paragraph in **Activity & Comments**. They may change the “Posting as” name; it defaults to **Support Agent**. After **Add Comment** is pressed, the new note appears in the same ticket’s running thread with the author and timestamp.

### Execution path

1. `CommentThread.tsx` stores `author`, `content`, validation error, and submitting state locally.
2. `CommentThread.handleSubmit()` trims the comment and rejects an empty value. If an author is blank, it uses `Support Agent`.
3. It calls `onAddComment(content, author)`, which `TicketDetailsPage` forwards as `onAddComment(ticket.id, content, author)`.
4. `App.handleAddComment()` calls `addCommentToTicket(ticketId, content, author)` in `storage.ts`.
5. `addCommentToTicket()` loads all tickets, locates the target by ID, creates a comment ID/timestamp, and replaces only that ticket with a copy containing `comments: [...target.comments, newComment]`.
6. It saves the full updated array to `localStorage`.
7. `App` reloads tickets into state, which causes `TicketDetailsPage` and `CommentThread` to re-render with the new entry, then displays a toast.

`CommentThread` maps the comment array in its stored order and formats every `createdAt` value. It also labels likely staff authors (names containing “agent”, “support”, or “lead”) as **Staff**; this is presentation-only and does not provide authorization.

## Workflow: resolve and reopen a ticket

### Resolve

1. On an open ticket, `TicketDetailsPage` shows **Mark as Resolved**.
2. Clicking it invokes `App.handleResolveTicket(ticket.id)`.
3. `resolveTicket()` in `storage.ts` loads the record, changes `status` to `resolved`, and records `resolvedAt` with the current ISO timestamp.
4. It saves, `App` reloads state, and the details page immediately switches to the resolved appearance.
5. `StatusBadge.tsx`, ticket cards, list counters, and the resolved filter all reflect the new status after the state refresh.

### Reopen

A resolved ticket displays a **Reopen** action. `App.handleReopenTicket()` calls `reopenTicket()` in `storage.ts`, which changes the status back to `open` and saves the record. The existing `resolvedAt` value is retained as historical information.

## Persistence behavior and sample data

All persistence is centralized in `src/utils/storage.ts`.

- `loadTickets()` reads and parses the local-storage JSON. Missing, malformed, or non-array values safely return `[]`.
- `saveTickets(tickets)` serializes the complete ticket array back to the same key.
- `createTicket`, `addCommentToTicket`, `resolveTicket`, and `reopenTicket` are the write operations used by the UI.
- `getSampleTickets()` returns three sample records. The **Load Sample Data** button in `TicketsPage` invokes `App.handleLoadSampleData()`, which replaces the current local data with that sample set.

Refreshing the page preserves tickets and comments because `App` reloads them from `localStorage`. Clearing site data, using a different browser profile/device, or using private browsing may remove or isolate the records.

## File responsibility map

| File | Responsibility |
| --- | --- |
| `src/main.tsx` | Browser entry point; mounts React. |
| `src/App.tsx` | App state, hash navigation, workflow callbacks, toast feedback, and page selection. |
| `src/types/ticket.ts` | TypeScript contracts for tickets, comments, filters, and views. |
| `src/utils/storage.ts` | Local-storage read/write operations, IDs, timestamps, ticket mutations, and sample records. |
| `src/pages/TicketsPage.tsx` | List page, status filters, text search, empty states, and ticket-card rendering. |
| `src/components/TicketCard.tsx` | Clickable, keyboard-accessible ticket summary card. |
| `src/pages/CreateTicketPage.tsx` | Create-page wrapper and back navigation. |
| `src/components/TicketForm.tsx` | Input state, validation, form submission, and demo autofill. |
| `src/pages/TicketDetailsPage.tsx` | Full ticket/customer context, resolve/reopen controls, and comments composition. |
| `src/components/CommentThread.tsx` | Chronological note display and agent-comment form. |
| `src/components/StatusBadge.tsx` | Reusable Open/Resolved status presentation. |
| `src/components/Header.tsx` | Global navigation and ticket count. |
| `package.json` | npm scripts and dependencies. |
| `vite.config.ts` | Vite, React, Tailwind, alias, and development-server configuration. |

## Commands and verification

```bash
npm install       # install dependencies
npm run dev       # start the local app at port 3000
npm run lint      # run TypeScript checking without emitting files
npm run build     # create an optimized production build in dist/
```

The application is best validated by creating a ticket, adding at least one comment, resolving it, filtering for resolved tickets, refreshing the browser, and confirming that the ticket and comment remain available.

## Current boundaries and possible next steps

The current implementation covers the requested support-desk scope well, but it is a local prototype rather than a multi-agent production system. A production evolution would add an authenticated backend API and database, real user identities instead of free-text author names, cross-device synchronization, authorization rules, audit history, attachments, and automated tests.
