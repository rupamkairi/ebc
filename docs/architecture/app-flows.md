## EBC Application Flows

This document captures the main user and system flows across admins, buyers, and sellers, and points to where they are implemented in the codebase.

Use it together with `docs/architecture/codemap.md`, `docs/architecture/tech-stack.md`, and `docs/apis/api-endpoints.md`.

---

### 1. Authentication & onboarding

#### 1.1 Admin authentication (email/password)

- **User flow**
  - Admin visits the admin login route.
  - Submits email/password.
  - On success, a session is created and the admin is redirected to the admin dashboard.

- **Implementation sketch**
  - Routes: `src/app/auth/admin-login/**`, `src/app/(dashboard)/admin-dashboard/**`.
  - Types: `src/types/auth.ts` – `AdminLoginRequest`, `AuthResponse`, `SessionResponse`, etc.
  - Services: `src/services/authService.ts` using `API_ENDPOINTS.AUTH.ADMIN.LOGIN` and `AUTH.SESSION`.
  - State: `src/store/authStore.ts` for storing the current session/user and providing guards.

#### 1.2 User authentication (phone/OTP)

- **User flow**
  - Buyer or seller enters phone (and basic details for first-time users).
  - System sends an OTP.
  - User submits OTP and is logged in.
  - Depending on role/type, user is taken through onboarding (e.g. entity setup for sellers) and into buyer or seller dashboard.

- **Implementation sketch**
  - Routes: `src/app/auth/login/**`, `src/app/auth/register/**`.
  - Types: `src/types/auth.ts` – user session and related structures.
  - Services: `authService` using `API_ENDPOINTS.AUTH.USER.SEND_OTP` and `AUTH.USER.VERIFY_OTP`.
  - State: `authStore` for session, onboarding state leveraged by auth and dashboard guards.

---

### 2. Dashboards & personas

#### 2.1 Admin dashboard

- **Key responsibilities**
  - Manage admin users and roles.
  - Manage seller/service provider entities.
  - Configure catalog (categories, brands, specs, items).
  - Review and verify conference hall events/offers/content.
  - Manage wallet, pricing, and costs.
  - View and moderate reviews and forum content.

- **Implementation sketch**
  - Routes: `src/app/(dashboard)/admin-dashboard/**`.
  - Components: `src/components/admin/**`, plus shared dashboard layouts.
  - Types & services:
    - Auth and admin roles – `src/types/auth.ts`, `src/services/adminService.ts`.
    - Catalog – `src/types/catalog.ts`, `src/services/catalogService.ts`.
    - Entities – `src/types/entity.ts`, `src/services/entityService.ts`.
    - Conference hall – `src/types/conference-hall.ts`, `src/services/conferenceHallService.ts`.
    - Wallet/pricing – `src/types/wallet.ts`, `src/services/walletService.ts`, `pricingService.ts`, `packageService.ts`.

#### 2.2 Buyer dashboard

- **Key responsibilities**
  - Track and manage enquiries, appointments, and visits.
  - Discover offers and events relevant to the buyer.
  - Manage account/profile and settings.

- **Implementation sketch**
  - Routes: `src/app/(dashboard)/buyer-dashboard/**`.
  - Components: `src/components/dashboard/buyer/**` and shared notification/review components.
  - Activity state and services:
    - Types: `src/types/activity.ts`.
    - Services: `src/services/activityService.ts`.
    - Stores: `enquiryStore`, `appointmentStore`, `quotationStore` where in-progress flows are persisted.

#### 2.3 Seller dashboard

- **Key responsibilities**
  - Set up and maintain business entity details.
  - Create and manage catalog listings (items, regions, rates).
  - Handle buyer enquiries, send quotations, and manage appointments/visits.
  - Create and publish conference hall events, offers, and content.
  - Manage wallet, coin balance, and lead pricing.
  - Access support, reviews, and notifications.

- **Implementation sketch**
  - Routes: `src/app/(dashboard)/seller-dashboard/**`.
  - Components: `src/components/dashboard/seller/**` and supporting layouts.
  - Types & services:
    - Entities – `src/types/entity.ts`, `src/services/entityService.ts`.
    - Catalog/listings – `src/types/catalog.ts`, `src/services/catalogService.ts`, item-listing-related endpoints.
    - Activity – `src/types/activity.ts`, `src/services/activityService.ts`.
    - Conference hall – `src/types/conference-hall.ts`, `src/services/conferenceHallService.ts`.
    - Wallet – `src/types/wallet.ts`, `src/services/walletService.ts`, `pricingService.ts`, `packageService.ts`.

---

### 3. Browse & lead generation flows

#### 3.1 Browse → Enquiry / Appointment

- **User flow (buyer)**
  - Buyer navigates to `browse` or marketing pages.
  - Filters and explores items/services.
  - Creates an enquiry or appointment from a listing.
  - Completes a multi-step flow: details → review → submit → success.

- **Implementation sketch**
  - Routes:
    - `src/app/browse/**` – browsing listings and entry points into activity flows.
    - `src/app/(activity)/enquiry/**` – enquiry creation steps.
    - `src/app/(activity)/appointment/**` – appointment creation steps.
  - Components:
    - Browse cards and modals (e.g. `components/browse/**`, add-to-enquiry/appointment modals).
    - Activity-specific forms and review components under dashboard/activity components.
  - Domain:
    - Endpoints: `API_ENDPOINTS.ACTIVITY.ENQUIRY` and `.APPOINTMENT`.
    - Types: `src/types/activity.ts`.
    - Services: `src/services/activityService.ts`.
    - Stores: `enquiryStore`, `appointmentStore` for multi-step state.

#### 3.2 Activity lifecycle (enquiry → quotation → visit/appointment)

- **Conceptual flow**
  - Buyer submits an **enquiry**.
  - Seller receives the enquiry, can respond with a **quotation**.
  - Buyer can accept a quotation, leading to a **visit** or **appointment**, and associated wallet transactions.
  - Activities can be completed or cancelled, and may trigger notifications.

- **Implementation sketch**
  - Endpoints: `API_ENDPOINTS.ACTIVITY.ENQUIRY`, `.QUOTATION`, `.VISIT`, `.APPOINTMENT`, `.ASSIGNMENT`.
  - Types: `src/types/activity.ts`.
  - Services: `activityService` for CRUD and list operations.
  - UI:
    - Buyer and seller dashboards for activity management.
    - Notification components for activity-related events.

---

### 4. Conference Hall publishing flows

#### 4.1 Events

- **Flow**
  - Seller (or admin) creates an event draft with details, regions, and attachments.
  - Admin verifies/approves the event.
  - Seller or admin publishes the event; coins are deducted from the seller entity’s wallet.
  - Buyers can discover and join events (which may also create activities and/or notifications).

- **Implementation sketch**
  - Endpoints: `API_ENDPOINTS.CONFERENCE_HALL.EVENT.*` and related endpoints in `docs/apis/api-endpoints.md`.
  - Routes:
    - Seller: `seller-dashboard/conference-hall/events/**`.
    - Admin: `admin-dashboard/conference-hall/events/**`.
    - Public: `src/app/conference-hall/**`.
  - Types & services: `src/types/conference-hall.ts`, `src/services/conferenceHallService.ts`.
  - Wallet integration: `WALLET` and `PRICING` endpoints used when publishing.

#### 4.2 Offers

- **Flow**
  - Seller creates an offer draft linked to catalog entities (categories, brands, items, listings).
  - Admin verifies the offer.
  - Publishing deducts coins and makes the offer discoverable for buyers.

- **Implementation sketch**
  - Endpoints: `API_ENDPOINTS.CONFERENCE_HALL.OFFER.*`.
  - Routes:
    - Seller: `seller-dashboard/conference-hall/offers/**`.
    - Admin: `admin-dashboard/conference-hall/offers/**`.
  - Types & services: `src/types/conference-hall.ts`, `src/services/conferenceHallService.ts`.
  - Wallet integration: `WALLET` and `PRICING` via wallet services.

#### 4.3 Content

- **Flow**
  - Seller creates content drafts (articles, posts) with attachments and target regions.
  - Admin verifies and approves content.
  - Content is published (coins deducted), then appears in public discovery surfaces.

- **Implementation sketch**
  - Endpoints: `API_ENDPOINTS.CONFERENCE_HALL.CONTENT.*`.
  - Routes:
    - Seller: `seller-dashboard/conference-hall/content/**`.
    - Admin: `admin-dashboard/conference-hall/content/**`.
    - Public: conference hall views under `src/app/conference-hall/**`.
  - Types & services: `src/types/conference-hall.ts`, `src/services/conferenceHallService.ts`.
  - Wallet integration: same pattern as events and offers.

---

### 5. Wallet, pricing, and transactions

- **Flow**
  - Sellers obtain coins via wallet top-ups or manual adjustments (admin).
  - Lead types (quotation, visit, offer publish, event publish, content publish, etc.) have configured coin costs.
  - When certain actions occur (e.g. publishing an offer, joining/publishing an event, submitting a quotation/visit), a **wallet transaction** is recorded and balance updated.

- **Implementation sketch**
  - Endpoints:
    - `API_ENDPOINTS.WALLET.*` and `PRICING`, `TRANSACTION`.
    - Contracts documented in `docs/apis/api-endpoints.md` under “Wallet”.
  - Types: `src/types/wallet.ts`.
  - Services: `src/services/walletService.ts`, `pricingService.ts`, `packageService.ts`.
  - UI:
    - Seller wallet views in `seller-dashboard/wallet/**`.
    - Admin wallet/cost panels under `admin-dashboard/**`.

---

### 6. Notifications & channels

- **Flow**
  - Domain events (e.g. new enquiry, quotation accepted, event/offer/content updates) can trigger notification records.
  - Notifications are delivered through channels configured by users (SMS/email/other).
  - Users can manage channels, verify them via OTP, and mark notifications as read.

- **Implementation sketch**
  - Endpoints:
    - `API_ENDPOINTS.NOTIFICATION.*` – notifications.
    - `API_ENDPOINTS.NOTIFICATION_CHANNEL.*` – channels.
    - Contracts in `docs/apis/api-endpoints.md` under “Notification”.
  - Types: `src/types/notification.ts`.
  - Services: `src/services/notificationService.ts`.
  - UI:
    - Notification inbox and channel management components under `src/components/dashboard/notifications/**`.
    - Dashboard pages that surface notifications and channel management.

---

### 7. Forum, reviews, and support

These flows are more auxiliary but still important for the user experience.

- **Forum / Discussion**
  - Domain: `src/types/forum.ts`.
  - Backend endpoints under `/api/forum` (see `docs/apis/api-endpoints.md`).
  - Components: forum widgets and utilities under `src/components/shared/forum/**`.

- **Reviews and reputation**
  - Types: `src/types/review.ts`.
  - Components: `src/components/shared/reviews/**`.
  - Flows: driven by activity and conference hall usage (e.g. reviewed events, offers, sellers).

- **Support**
  - Types: `src/types/support.ts`.
  - Seller dashboard support pages under `seller-dashboard/support/**` and related components.

---

### 8. Keeping flow docs up to date

When you change or add flows:

- **If you add a new step or change order in a wizard** (e.g. enquiry or appointment creation):
  - Update the relevant subsection of this document under **Browse & lead generation flows** or **Dashboards & personas**.

- **If you introduce a new lead type or wallet interaction**:
  - Extend **Wallet, pricing, and transactions** to describe the new behavior.

- **If you add new notification or forum flows**:
  - Document them under **Notifications & channels** or **Forum, reviews, and support** as appropriate.

Use concise, flow-oriented language (who does what, in which order, and which modules are involved) so future contributors can quickly understand the lifecycle of key operations.

