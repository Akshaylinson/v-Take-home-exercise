# Varanchi Software Developer Take-Home Assignment

## Customer Support Ticket Management System

### Objective
Build a small web application that allows a customer support agent to track customer issues as support tickets.

The application must be standalone and work independently without requiring Varanchi's systems, APIs, or data.

### Tech Stack
- Frontend: React + TypeScript + Vite
- Data Storage: Browser localStorage
- Styling: Tailwind CSS
- State Management: React built-in state (useState, useEffect)

### Core Functional Requirements
1. **Create a Support Ticket**:
   - Customer Identification: Customer Name, Order Number, Phone Number
   - Ticket Information: Short Title, Description
   - Validation on all required fields
   - Assign initial status "Open", timestamp, unique ID
   - Persist to localStorage and navigate to ticket details
2. **View Ticket List**:
   - Display existing tickets with ID, title, customer, order number, status, creation date
   - Empty state when no tickets exist
3. **View Ticket Details**:
   - Display full ticket and customer info
   - Display chronological comments thread
   - Handle invalid ticket IDs with not-found state
4. **Add Comments to a Ticket**:
   - Comment author, timestamp, content
   - Chronological order
   - Validation against empty comments
5. **Resolve a Ticket**:
   - Mark as Resolved action
   - Update status in localStorage and UI
6. **Filter Tickets by Status**:
   - All, Open, Resolved
