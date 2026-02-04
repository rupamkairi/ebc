# Unified Notifications Channel: System Design & Implementation Plan

## Overview

The Unified Notifications Channel is a robust, scalable system designed to handle multi-channel communication (Email, SMS, Push, WhatsApp) with high reliability and observability. It leverages BullMQ and Upstash Redis for asynchronous job processing, and integrates deeply with the project's Activity system.

## 1. Infrastructure: Redis & BullMQ

To ensure reliable delivery and process isolation, we use **BullMQ** for job queuing.

- **Redis Provider**: Upstash Redis (Serverless).
- **Queues**:
  - `notification-router`: Distributes jobs to specific channel queues.
  - `email-queue`, `sms-queue`, `push-queue`, `whatsapp-queue`: Dedicated workers for each channel.
- **Features**:
  - Asynchronous delivery.
  - Automatic retries with exponential backoff.
  - Ability to pause/resume individual channel queues for maintenance or template updates.
  - Persistent job state for delivery tracking.

## 2. Data Modeling (Prisma)

The schema is restructured to separate notification content from delivery state.

### `Notification` Model (The Inbox)

- Acts as a shared header for a single event (e.g., "New Enquiry").
- Linked to `Activity` (1:1 or 1:N).
- Stores shared metadata.

### `NotificationSendee` Model (Delivery Tracking)

- Represents a delivery attempt to a specific `User` via a specific `Channel`.
- Fields: `status` (PENDING, SENT, DELIVERED, FAILED), `sentAt`, `deliveredAt`, `failedAt`, `error`, `metadata` (JSON).

### `NotificationChannel` Model (Management)

- CRUD-able system for enabling/disabling notification methods.
- Stores channel-specific configuration (e.g., API keys, sender IDs).

## 3. Core Services & Logic

### `TemplateManager`

- Modular directory structure: `src/utilities/notifications/templates/`.
- Supports dynamic content resolution using placeholders.
- Channel-specific template formats (HTML for Email, Plain Text for SMS).

### `UnifiedNotificationManager`

- High-level coordinator that validates channel availability (ENV & DB).
- Maps notification types to templates.
- Dispatches jobs to BullMQ.

### `NotificationService`

- Handles higher-level API logic.
- Creates `Notification` and `NotificationSendee` records.
- Orchestrates the multi-sendee delivery flow.

### `ActivityNotificationService`

- Automatically triggers notifications based on `Activity` logs.
- Essential for linking behavior (e.g., assigning an enquiry) to user alerts.

## 4. Implementation Phases

1.  **Phase 1: Foundations**: Schema changes, migrations, and Redis/BullMQ setup.
2.  **Phase 2: Channel Strategies**: Implementation of Email, SMS, Push, and WhatsApp logic (including stubs for third-party providers).
3.  **Phase 3: Service Integration**: Linking Activities to Notifications and implementing the Signup initialization logic.
4.  **Phase 4: API & UI**: Finalizing REST controllers and documenting all endpoints.

---
