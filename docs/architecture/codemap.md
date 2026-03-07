## EBC Architecture Codemap

This document gives a high-level map of the EBC frontend codebase: major domains, directories, and how data flows between them.

For a generated overview, also see the DeepWiki entry: [`EBC DeepWiki`](https://deepwiki.com/rupamkairi/ebc).

---

### 1. High-level system view

- **Frontend**: Next.js 16 App Router (React 19, TypeScript 5).
- **Backend**: Separate API server (not in this repo) exposing `/api/*` endpoints.
- **State management**:
  - **Zustand** (`src/store`) for client/session/UI state.
  - **TanStack Query** (via `src/services`) for server state and caching.
  - **TanStack Form / React Hook Form** for complex forms.
- **Domains represented in the frontend**:
  - **Authentication** (admin + user).
  - **Business Entity** (seller/service provider entities).
  - **Catalog & Item Listing** (categories, brands, specs, items, listings).
  - **Activity** (enquiry, appointment, quotation, visit, assignment).
  - **Conference Hall** (events, offers, content).
  - **Wallet, Pricing & Transactions**.
  - **Notification & Notification Channel**.
  - **Attachments / Media / Documents**.
  - **Forum, Reviews, Support, and auxiliary tools**.

The frontend’s domain model is reflected in `src/types`, `src/services`, `src/store`, and `src/app` routes.

---

### 2. Directory map

#### 2.1 `src/app` – Routes, layouts, and entry points

App Router routes implement the UX for each persona (admin, buyer, seller) and public visitors.

- **Auth & onboarding**
  - `src/app/auth/admin-login/**` – admin email/password login.
  - `src/app/auth/login/**` – user phone/OTP login for buyers and sellers.
  - `src/app/auth/register/**` – phone-based registration and onboarding.

- **Dashboards (route group `(dashboard)`)**
  - `src/app/(dashboard)/admin-dashboard/**`
    - Admin-facing panels for user management, sellers, catalog, reviews, costs, conference hall management, and settings.
  - `src/app/(dashboard)/buyer-dashboard/**`
    - Buyer home, enquiries, appointments, visits, offers, and account settings.
  - `src/app/(dashboard)/seller-dashboard/**`
    - Seller home, catalog management, customers, enquiries, quotations, appointments, visits, conference hall content, wallet, and support.

- **Activity flows (route group `(activity)`)**
  - `src/app/(activity)/enquiry/**` – multi-step enquiry creation, review, and success screens.
  - `src/app/(activity)/appointment/**` – multi-step appointment creation and confirmation.

- **Public & marketing**
  - `src/app/(public)/features/**` – “for buyers” and “for sellers” feature pages.
  - `src/app/how-it-helps/**`, `src/app/hire/**` – explainer and hiring flows.
  - `src/app/browse/**` – buyer browse experience and funnel into enquiries/appointments.
  - `src/app/conference-hall/**` – public-facing view of events, offers, and content.

These route files typically:

- Wire up layout and guard components (auth, dashboard).
- Compose feature-level components from `src/components/**`.
- Fetch data indirectly through hooks/services in `src/services/**`.

#### 2.2 `src/components` – UI and feature components

- **`src/components/ui`**
  - Design system primitives built on Tailwind and Radix UI (buttons, inputs, tables, dialogs, popovers, calendars, etc.).
  - Used throughout dashboards and flows; keep styling and behavior consistent by reusing these.

- **`src/components/layouts`**
  - Dashboard layouts (`buyer-dashboard-*`, `admin-dashboard-*`, seller layout provider, sidebar, header).
  - Browse layouts and panels (`browse.layout`, inquiry panel, floating inquiry button).
  - Auth layouts and onboarding form wrappers.

- **`src/components/dashboard`**
  - **Buyer**: dashboard cards, offers discovery, shared buyer components (OTP forms, etc.).
  - **Seller**: catalog creation and management, quotation forms, wallet components, activity-shared cards.
  - **Notifications**: inbox and channel management components used by dashboards.

- **`src/components/admin`**
  - Tables and forms for admin users (admin roles, catalog config, conference hall verification).

- **`src/components/landing`**
  - Marketing sections: pricing, services, FAQs, problem/solution, conference hall promos, etc.

- **`src/components/shared` & others**
  - Reviews, forum, WhatsApp buttons, footers, and other cross-cutting elements.
  - Autocomplete components, advanced form pieces (region search, state/pincode search), language switcher, providers (theme, i18n).

#### 2.3 `src/lib` – Core utilities and configuration

- **`api-endpoints.ts`**
  - Structured map of backend API paths grouped by domain:
    - `AUTH`, `CATALOG`, `ITEM_LISTING`, `CONFERENCE_HALL`, `ACTIVITY`, `ENTITY`, `WALLET`, `PRICING`, `TRANSACTION`, `NOTIFICATION`, `NOTIFICATION_CHANNEL`, `ATTACHMENT`, `PINCODE_DIRECTORY`.
  - Services and hooks should use these constants rather than hardcoding strings.

- **`api-client.ts`**
  - HTTP client helpers (e.g. base URL handling, auth headers, generic fetch wrappers).

- **`activity-utils.ts`**
  - Shared helpers for activity flows (enquiry, appointment, quotation, visit).

- **`utils.ts`, `path-breadcrumbs.ts`**
  - Generic utility functions and breadcrumb helpers for routes.

#### 2.4 `src/services` – API service layer

Each file in `src/services` corresponds roughly to one backend domain and typically:

- Imports `API_ENDPOINTS` from `src/lib/api-endpoints.ts`.
- Uses `api-client.ts` to talk to the backend.
- Exposes functions and/or React Query hooks for components and pages.

Examples:

- `authService.ts` – login, OTP, session verification helpers.
- `adminService.ts` – admin user management.
- `catalogService.ts` – categories, brands, specs, items.
- `entityService.ts` – business entities.
- `activityService.ts` – enquiries, appointments, quotations, visits, assignments.
- `conferenceHallService.ts` – events, offers, content.
- `walletService.ts`, `pricingService.ts`, `packageService.ts` – wallet, pricing, coin packages.
- `notificationService.ts`, `locationService.ts` – notifications and location utilities.

#### 2.5 `src/store` – Client state (Zustand)

Stores encapsulate client-side state that should survive navigation and sometimes refresh:

- `authStore.ts` – authenticated session (admin or user), user profile, logout.
- `browseStore.ts` – browse filters and current selection.
- `categoryStore.ts`, `brandStore.ts`, `specificationStore.ts`, `itemStore.ts` – catalog configuration state.
- `enquiryStore.ts`, `appointmentStore.ts`, `quotationStore.ts` – activity-related wizards and state.

Components and pages should access this state via hooks rather than duplicating local state.

#### 2.6 `src/types` – Domain models

TypeScript interfaces and types used across the app:

- `auth.ts` – admin login, auth responses, session structures.
- `catalog.ts` – categories, brands, specifications, items, item listings.
- `entity.ts` – business entities and verification statuses.
- `activity.ts` – enquiries, appointments, quotations, visits, assignments.
- `conference-hall.ts` – events, offers, content.
- `wallet.ts` – wallets, coin packages, transactions, pricing configs.
- `notification.ts`, `forum.ts`, `support.ts`, `review.ts`, `region.ts` – supporting domains.

These should be treated as the single source of truth for frontend domain types.

#### 2.7 `docs` – Documentation and prompts

- `docs/apis/api-endpoints.md` – canonical API reference for the backend.
- `docs/architecture/*` – architectural docs for agents and human contributors (this codemap plus flows and tech stack).
- Prompting and design system docs that guide how flows and UIs are built.

---

### 3. Data and control flow

At a high level, requests typically follow this path:

1. **User interaction** in a route component under `src/app/**`.
2. Route composes **feature components** from `src/components/**`.
3. Components call into **services** (`src/services/**`) that:
   - Use `API_ENDPOINTS` and `api-client.ts` to talk to `/api/*`.
   - Use TanStack Query for caching, loading/error states, and mutation side-effects.
4. Responses are modeled using **TypeScript types** from `src/types/**`.
5. **Zustand stores** (`src/store/**`) hold session and in-progress flow state (e.g. multi-step wizards).

This separation allows UI to stay declarative while services encapsulate domain logic and networking.

---

### 4. Feature modules and where they live

- **Authentication**
  - Routes in `src/app/auth/**`.
  - Types in `src/types/auth.ts`.
  - Services in `src/services/authService.ts`.
  - State in `src/store/authStore.ts`.

- **Business Entity**
  - Admin views under `admin-dashboard/sellers/**`.
  - Seller views mixed into seller dashboard flows (e.g. profile/settings).
  - Types in `src/types/entity.ts`.
  - Services in `src/services/entityService.ts`.

- **Catalog & Item Listing**
  - Admin configuration under `admin-dashboard/catalog/**`.
  - Seller listing management under `seller-dashboard/catalog/**`.
  - Types in `src/types/catalog.ts`.
  - Services in `src/services/catalogService.ts` and item-listing portions of other services.
  - Stores in `src/store/categoryStore.ts`, `brandStore.ts`, `specificationStore.ts`, `itemStore.ts`.

- **Activity (Enquiry, Appointment, Quotation, Visit, Assignment)**
  - Creation flows in `src/app/(activity)/**`.
  - Buyer-side management in `buyer-dashboard/enquiries/**`, `buyer-dashboard/appointments/**`, `buyer-dashboard/visits/**`.
  - Seller-side management in `seller-dashboard/enquiries/**`, `seller-dashboard/quotations/**`, `seller-dashboard/appointments/**`, `seller-dashboard/visits/**`.
  - Types in `src/types/activity.ts`.
  - Services in `src/services/activityService.ts`.
  - Stores in `src/store/enquiryStore.ts`, `appointmentStore.ts`, `quotationStore.ts`.

- **Conference Hall (Events, Offers, Content)**
  - Admin moderation in `admin-dashboard/conference-hall/**`.
  - Seller creation and management in `seller-dashboard/conference-hall/**`.
  - Public discovery in `src/app/conference-hall/**` and buyer-facing components.
  - Types in `src/types/conference-hall.ts`.
  - Services in `src/services/conferenceHallService.ts`.

- **Wallet, Pricing & Packages**
  - Seller wallet views in `seller-dashboard/wallet/**`.
  - Admin wallet and cost panels under `admin-dashboard/costs/**` and related routes.
  - Types in `src/types/wallet.ts`.
  - Services in `src/services/walletService.ts`, `pricingService.ts`, `packageService.ts`.

- **Notifications & Forum**
  - Notification inbox and channel management components in `components/dashboard/notifications/**`.
  - Types in `src/types/notification.ts` and `src/types/forum.ts`.
  - Services in `src/services/notificationService.ts`.

---

### 5. How to extend the architecture safely

When introducing new features or refactoring:

- **Reuse domain boundaries**:
  - If a feature belongs to an existing domain (e.g. Activity, Conference Hall), add to its service, types, and stores instead of creating parallel structures.

- **Keep routes thin**:
  - Route files should primarily orchestrate layouts, guards, and feature components.
  - Offload fetching and mutations to `src/services/**` and `src/store/**`.

- **Align docs and code**:
  - If you add a new major route group or module, document it here under the relevant section.
  - If you change how flows behave (e.g. new steps in enquiry or appointment), update `docs/architecture/app-flows.md`.

This codemap should remain the **authoritative, human-readable index** of how the frontend is structured. Update it whenever architectural decisions or new modules are introduced.

