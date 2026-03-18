# EBC Frontend Code Map & Context

This document outlines the codebase structure and key architectural patterns for the `ebc` frontend application. It serves as context for AI assistants and developers.

## Tech Stack
- Framework: Next.js (App Router)
- Routing: File-system based routing (Next.js App Router)
- Styling: Tailwind CSS (globals.css, UI components)
- State Management/Data Fetching: React Query (queries directory) and local stores (Zustand or Context - store directory)
- API Communication: Axios / Fetch via `services/` 
- Types: TypeScript

## Directory Structure Overview

### 1. `src/app/` (Routing Layer)
Handles routing and high-level page layouts.
- `(activity)`: Route group for transaction processes (`appointment`, `enquiry`). Contains creation flows and review pages.
- `(dashboard)`: Multi-role dashboards (`admin`, `buyer`, `seller`).
  - `admin-dashboard`: Accountants, executives, managers, catalog management, verification tables.
  - `buyer-dashboard`: Buyer tracking (appointments, enquiries, quotations, events, offers).
  - `seller-dashboard`: Seller tools for catalog management, quotation generation, events, reviews, wallet.
- `(public)`: Public facing feature pages.
- `auth`: Authentication flows (`admin-login`, `login`, `register`, `onboarding`).
- `browse`: Public directory to browse categories, brands, specifications, and items.
- `conference-hall`: Live events, content, and offers.

### 2. `src/components/` (UI Layer)
Organized heavily by feature and domain.
- `admin`, `buyer`, `seller`, `dashboard`: Distinct components for multi-tenancy.
- `advanced-forms`: Specialized inputs like date-time slot selection, item search, region selection.
- `autocompletes`: Reusable component patterns for looking up specifications, regions, states.
- `browse`: Used on the public browsing interfaces.
- `datatable`: Standardized tables (e.g., Shadcn-like data tables).
- `landing`: Contains sections for the landing page.
- `layouts`: Standardized navbars, sidebars, and wrappers for different routes.
- `shared`: Global common components (headers, footers, region-selectors, upload utilities).
- `ui`: Base design system components (buttons, dialogs, inputs, tabs).

### 3. `src/services/` (API Client Layer)
Functions here execute HTTP requests to the `ebc-server`. Files map 1:1 with backend entities:
- `activityService.ts`, `authService.ts`, `catalogService.ts`, `entityService.ts`, `walletService.ts`, etc.

### 4. `src/queries/` (Query Layer)
React Query hooks encapsulating the services. Examples include fetching caching, mutations, refetching logic:
- `activityQueries.ts`, `adminQueries.ts`, `catalogQueries.ts`, etc.

### 5. `src/store/` (State Management)
Local state stores for complex user flows (e.g., building a quotation or enquiry step-by-step).
- `appointmentStore.ts`, `browseStore.ts`, `quotationStore.ts`, etc.

### 6. `src/types/` (Type Definitions)
TypeScript interfaces defining domain models. They should map somewhat closely to Prisma generated types on the backend.

### 7. `src/lib/`, `src/hooks/`, `src/constants/`, `src/i18n/`
Utilities, shared React hooks, constants (roles, enums), and localization (en/hn).

## Development Guidelines for AI
1. **Component Design**: Favor `src/components/ui/` base components for any new feature.
2. **Data Fetching**: Always construct a `service` method first, test the API, then build a `query` hook. Components should use the `queries/` hooks, never direct `fetch`/`axios` calls.
3. **Routing**: When creating new pages, ensure they live under the correct route group (dashboard vs activity vs public) to inherit layouts and middlewares.
4. **Icons & Assets**: Utilize the `icon-wrapper.tsx` for consistency.
