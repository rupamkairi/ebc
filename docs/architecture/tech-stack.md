## EBC Tech Stack & Conventions

This document explains the main technologies used in the EBC frontend and how they are intended to be used.

For a higher-level overview, see [`EBC DeepWiki`](https://deepwiki.com/rupamkairi/ebc) and `package.json`.

---

### 1. Core framework

- **Next.js 16 (App Router)** – Application framework.
  - All routes live under `src/app/**` and use the App Router paradigm (layouts, nested routes, route groups like `(dashboard)` and `(activity)`).
  - Prefer **server components** where possible and **client components** where state or browser APIs are required.

- **React 19** – UI library.
  - Use functional components and hooks exclusively.
  - Prefer composition over inheritance for building complex UIs from smaller primitives.

- **TypeScript 5** – Type safety.
  - Domain types live in `src/types/**` and should be reused across components, services, and stores.
  - Avoid `any` and keep type aliases and interfaces close to their domain.

---

### 2. State management

- **Zustand (`src/store/**`)**
  - Used for **client/session/UI state** that should be accessible across routes:
    - Authentication state (`authStore`).
    - Catalog configuration state (`categoryStore`, `brandStore`, `specificationStore`, `itemStore`).
    - Browsing and flow-related state (`browseStore`, `enquiryStore`, `appointmentStore`, `quotationStore`).
  - **Conventions**:
    - Create one store per domain or tightly related set of concerns.
    - Provide hook-based accessors like `useAuthStore()` instead of exporting raw stores.
    - Keep stores lean; heavy async work belongs in services using React Query.

- **TanStack Query (@tanstack/react-query)**
  - Used for **server state** (data fetched from `/api/*` endpoints).
  - Usually wrapped by services in `src/services/**` that export hooks like `useSomethingQuery` or `useSomethingMutation`.
  - **Conventions**:
    - Keep query keys structured by domain (e.g. `['activity', 'enquiries', params]`).
    - Use optimistic updates cautiously and document any complex cache invalidation logic.

- **Forms (TanStack Form, React Hook Form)**
  - For complex, multi-step forms (e.g. activity flows), use TanStack Form or React Hook Form for:
    - Validation.
    - Controlled inputs.
    - Wizard-style multi-step persistence together with Zustand stores when needed.

---

### 3. UI and styling

- **Tailwind CSS 4**
  - Utility-first styling across the entire app.
  - Use `class-variance-authority`, `clsx`, and `tailwind-merge` to manage conditional and variant-based classes.
  - **Conventions**:
    - Centralize design tokens and avoid arbitrary, one-off values where possible.
    - Prefer extracting reusable, styled components to `src/components/ui/**`.

- **Radix UI + Shadcn-style components**
  - Radix primitives (dialogs, popovers, dropdowns, tooltips, etc.) wrapped as local components in `src/components/ui/**`.
  - Use these instead of raw Radix imports when building new UIs to keep behavior and styling consistent.

- **Icon libraries**
  - `lucide-react` and `@tabler/icons-react` for icons.
  - Reuse existing icons for consistency; only introduce new ones when necessary and keep styles coherent.

- **Theming**
  - `next-themes` and custom providers (e.g. `app-theme-provider`) handle light/dark or other theme settings.
  - New components should respect theme tokens and not hardcode colors that break theming.

---

### 4. Internationalization (i18n)

- **i18next / react-i18next**
  - Used for translations and locale-aware text.
  - `docs/i18n/**` contains planning docs for page coverage and translation strategy.

- **Conventions**:
  - Use translation hooks/components instead of hardcoded strings when working on areas that are (or will be) localized.
  - Keep translation keys organized by domain and page rather than by component file names.

---

### 5. Data, APIs, and networking

- **`src/lib/api-endpoints.ts`**
  - Single source of truth for frontend API paths.
  - Grouped by domain: `AUTH`, `CATALOG`, `ITEM_LISTING`, `CONFERENCE_HALL`, `ACTIVITY`, `ENTITY`, `WALLET`, `PRICING`, `TRANSACTION`, `NOTIFICATION`, `NOTIFICATION_CHANNEL`, `ATTACHMENT`, `PINCODE_DIRECTORY`.
  - **Rule**: Do **not** hardcode API strings in components; always go through this file (typically via services).

- **`src/lib/api-client.ts`**
  - Shared HTTP client helpers (base URL, headers, error handling).
  - Services should use this instead of using `fetch` directly.

- **`src/services/**`**
  - One service per domain (or small set of related domains).
  - Responsibilities:
    - Translate domain operations into HTTP calls using `api-client.ts` and `API_ENDPOINTS`.
    - Provide React Query hooks and possibly thin wrappers for mutations.
  - **Conventions**:
    - Keep domain logic in services or dedicated utilities; components should mostly orchestrate UI and call service hooks.
    - Reflect backend request/response shapes using `src/types/**`.

- **API documentation**
  - `docs/apis/api-endpoints.md` is the canonical human-readable reference.
  - When backend contracts change, this doc **and** `src/lib/api-endpoints.ts` plus related `src/types/**` should be updated together.

---

### 6. Utilities and tooling

- **Linting and formatting**
  - ESLint 9 with `eslint-config-next` 16.
  - **Command**: `npm run lint`.
  - Keep new code aligned with existing patterns and fix lints introduced by your changes.

- **Build and dev commands**
  - `npm run dev` – development server (`next dev -p 10001`).
  - `npm run build` – production build (`next build`).
  - `npm run start` – production server (`next start`).

- **Other dev libraries**
  - `@tanstack/react-devtools` – debugging TanStack Query state.
  - `tw-animate-css` – Tailwind animation utilities (used sparingly for motion).
  - `date-fns` – date utilities; prefer it over ad-hoc date manipulation.

---

### 7. Patterns to follow when adding new code

- **Choose the right layer**
  - **UI-only behavior** → `src/components/**` using `src/components/ui/**` primitives.
  - **Domain operations / networking** → `src/services/**` + `src/lib/api-endpoints.ts` + `src/lib/api-client.ts`.
  - **Shared business models** → `src/types/**`.
  - **Client session or cross-page state** → `src/store/**`.

- **Respect domain boundaries**
  - Do not mix unrelated domains in the same service or store.
  - If a feature cuts across domains (e.g. notification triggered by an activity), keep each domain’s core logic in its own place and connect them via well-defined calls.

- **Make changes discoverable**
  - When introducing new modules or changing patterns, update:
    - `docs/architecture/codemap.md` to reflect the new structural element.
    - `docs/architecture/app-flows.md` if the user or system flow changes.

This document should act as a quick **technology and conventions reference**—update it when introducing new frameworks, major libraries, or cross-cutting patterns.

