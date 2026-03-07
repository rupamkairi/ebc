## EBC Project – AI Agent Guide

This document explains how AI agents should navigate the EBC codebase, which docs to rely on, and how to keep documentation in sync with code changes.

For a higher-level, AI-generated overview of the system, also see the DeepWiki entry: [`EBC DeepWiki`](https://deepwiki.com/rupamkairi/ebc).

---

### 1. What this project is

- **App type**: Next.js 16 App Router frontend for a marketplace-style platform.
- **Domains**:
  - **Authentication** (admin email/password, user phone/OTP).
  - **Business Entities** (seller/service provider profiles).
  - **Catalog & Item Listings** (categories, brands, specs, items, item listings).
  - **Activity** (enquiries, appointments, quotations, visits, activity assignments).
  - **Conference Hall** (events, offers, content – publishable lead sources).
  - **Wallet & Pricing** (coin packages, lead pricing, transactions).
  - **Notifications & Channels**.
  - **Forum / Discussion** plus reviews/support tooling.

The frontend talks to a separate backend via `/api/*` endpoints described in `docs/apis/api-endpoints.md` and `src/lib/api-endpoints.ts`.

---

### 2. Key directories and responsibilities

- **`src/app`**:
  - Next.js App Router routes and layouts.
  - **Route groups**:
    - `(public)` – marketing and static-ish pages (e.g. features, landing).
    - `(dashboard)` – authenticated dashboards:
      - `admin-dashboard` – admin operations (roles, sellers, catalog, reviews, costs, settings).
      - `buyer-dashboard` – buyer activities (enquiries, appointments, visits, settings).
      - `seller-dashboard` – seller activities, catalog, offers/events/content, wallet, settings.
    - `(activity)` – step-wise flows for creating enquiries and appointments.
    - `auth` – login/register/onboarding flows for admins and users.
    - Other top-level routes: `browse`, `conference-hall`, `hire`, `how-it-helps`, etc.

- **`src/components`**:
  - **`components/ui`** – Shadcn/Radix-based primitives (buttons, inputs, dialogs, tables, etc.).
  - **`components/layouts`** – shared layouts for dashboards, browse flows, auth forms.
  - **`components/dashboard`** – buyer/seller/admin dashboard widgets and feature-specific UIs.
  - **`components/admin`** – admin tables, forms, and management UIs.
  - **`components/landing`** – public marketing sections.
  - **`components/shared`** – cross-cutting features (reviews, forum, footer, etc.).
  - **`components/auth`** – guards, onboarding, and auth-specific components.

- **`src/lib`**:
  - `api-endpoints.ts` – centralized API path constants grouped by domain.
  - `api-client.ts` – HTTP client utilities (typically used by `src/services`).
  - `activity-utils.ts`, `utils.ts`, `path-breadcrumbs.ts` – shared helpers.

- **`src/services`**:
  - Service modules per domain (auth, catalog, activity, entity, wallet, pricing, conference hall, notifications, location, packages).
  - Typically expose React Query hooks and domain-specific data-fetching helpers.

- **`src/store`**:
  - Zustand-based client state stores for auth, browse, catalog entities, and activities.

- **`src/types`**:
  - Domain models for auth, catalog, entity, activity, conference hall, wallet, notifications, forum, reviews, etc.

- **`docs`**:
  - API documentation (`docs/apis/api-endpoints.md`).
  - Prompting and design documents.
  - New architecture docs created for agents live under `docs/architecture`.

---

### 3. Docs to read before making changes

When taking on any non-trivial task, **read (or skim) these first**:

- **Codemap & architecture**
  - `docs/architecture/codemap.md` – high-level map of modules, directories, and how pieces fit together.
  - `docs/architecture/app-flows.md` – core user and system flows (auth, dashboards, activity, conference hall, wallet, notifications).
- **Tech stack & conventions**
  - `docs/architecture/tech-stack.md` – frameworks, packages, and how they are used.
- **API contracts**
  - `docs/apis/api-endpoints.md` – canonical backend API reference.
  - `src/lib/api-endpoints.ts` – frontend mapping to those APIs.
- **External overview**
  - [`EBC DeepWiki`](https://deepwiki.com/rupamkairi/ebc) – generated architectural overview of the repository.

Always align new work with the patterns and boundaries described in these docs.

---

### 4. Standard workflow for AI-led changes

**Step 1 – Identify the domain and entry points**

- Classify the task into one or more domains: **Auth**, **Entity**, **Catalog/Listing**, **Activity**, **Conference Hall**, **Wallet/Pricing**, **Notifications**, **Forum/Reviews/Support**, **Dashboards/UX**.
- Locate:
  - The relevant **routes** in `src/app/**`.
  - The relevant **components** in `src/components/**`.
  - Any **services** in `src/services/**` and **stores** in `src/store/**`.
  - Any **types** in `src/types/**` and API constants in `src/lib/api-endpoints.ts`.

**Step 2 – Read the right docs**

- Skim `docs/architecture/codemap.md` to understand which modules are involved.
- Check `docs/architecture/app-flows.md` for how the user/system flow should behave.
- Check `docs/apis/api-endpoints.md` and `src/lib/api-endpoints.ts` for the backend contract.
- If in doubt, cross-check overall context in the DeepWiki page.

**Step 3 – Make cohesive, minimal changes**

- Prefer updating existing patterns (components, hooks, services, stores) over inventing new ones.
- Keep boundaries clear:
  - UI components should not hardcode API URLs – go through services and `API_ENDPOINTS`.
  - Domain types in `src/types` should remain the single source of truth for TypeScript models.
  - Zustand stores should be the single source of client-side state for their domain.

**Step 4 – Keep docs in sync with code**

Whenever you change or add:

- **Routes / pages / layouts (`src/app/**`)**:
  - Update **`docs/architecture/codemap.md`** if:
    - You introduce a new route group or dashboard area.
    - You add a new major page (e.g. new dashboard section) that changes the mental model.
  - Update **`docs/architecture/app-flows.md`** if:
    - The user journey changes (new steps, different sources of an activity, new publishing flow).

- **Domain services or APIs (`src/services/**`, `src/lib/api-endpoints.ts`, server contract changes)**:
  - If you only add a new frontend call that uses existing endpoints, update **codemap** if it represents a new capability.
  - If the **API contract** itself changes (paths, request/response shape), update:
    - `docs/apis/api-endpoints.md` to match the backend.
    - Any type definitions in `src/types/**` that describe the payloads.

- **State stores (`src/store/**`)**:
  - When adding new slices or changing the responsibilities of a store, update the relevant sections in:
    - `docs/architecture/codemap.md` (state management overview).
    - `docs/architecture/app-flows.md` if it affects how flows manage state.

- **New domains / modules**:
  - Add a new subsection under **Feature Modules** in `docs/architecture/codemap.md`.
  - Extend `docs/architecture/app-flows.md` with any new user/system flows.

Keep documentation high-level and conceptual – describe **what** the module does, **where** it lives, and **how** it connects to the rest.

**Step 5 – Sanity checks**

- Run local validations when possible:
  - `npm run lint`
  - `npm run dev` for runtime checks if appropriate.
- Verify that the docs you updated still read coherently (no dangling references or obsolete terminology).

---

### 5. Patterns and conventions to follow

- **Framework & state**
  - Next.js 16 App Router with React 19.
  - Zustand (`src/store`) for client session and UI state.
  - TanStack Query for server state (data fetching and caching) via `src/services`.
  - TanStack Form and React Hook Form patterns for form flows.

- **UI & styling**
  - Tailwind CSS v4 utilities with project-tailored design tokens.
  - Radix UI primitives wrapped as Shadcn-style components under `src/components/ui`.
  - Reuse existing dashboard and layout components for consistent UX.

- **Domain structure**
  - Keep business logic inside services and utils, not in route files.
  - Use `src/types/**` models consistently in components, services, and stores.
  - Prefer feature-structured components (e.g. `components/dashboard/seller/**`) over generic ones when they implement domain-specific UX.

---

### 6. When you’re unsure

- Prefer **reading** over guessing:
  - Start from the relevant route in `src/app`.
  - Drill into the associated components, services, stores, and types.
  - Cross-reference with `docs/architecture/*` and `docs/apis/api-endpoints.md`.
- If a pattern appears inconsistent, align with:
  - The documentation in `docs/architecture`.
  - The conventions implied by the majority of existing implementations.

When in doubt about where a change belongs, document your reasoning briefly in a code comment or the relevant architecture doc so future contributors understand the intent.

