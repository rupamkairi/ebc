# EBC API Documentation

This document provides a consolidated view of all API endpoints available in the EBC Server.

## Table of Contents

1. [Authentication](#1-authentication)
2. [Business Entity](#2-business-entity)
3. [Catalog (Categories, Brands, Items)](#3-catalog)
4. [Item Listing](#4-item-listing)
5. [Conference Hall (Events, Offers & Content)](#5-conference-hall)
6. [Activity (Enquiry, Appointment, etc.)](#6-activity)
7. [Wallet](#7-wallet)
8. [Notification](#8-notification)
9. [Attachments](#9-attachments)
10. [Miscellaneous (Pincode Directory)](#10-miscellaneous)
11. [Forum (Discussion)](#11-forum)

---

## 1. Authentication

**Base URL:** `/api/auth`

### Admin Routes

All Admin creation and update routes require `Authorization: Bearer <token>` header (except `login` and `create-admin` if no admin exists).

#### 1.1 Admin Login

**POST** `/admin/login`

- **Request Body:**
  ```json
  {
    "email": "root@example.com",
    "password": "password"
  }
  ```
- **Response:**
  ```json
  {
    "id": "session-uuid",
    "token": "jwt-token-string",
    "userId": "user-uuid",
    "expiresAt": "2024-12-25T00:00:00.000Z"
  }
  ```

#### 1.2 Create Root Admin

**POST** `/admin/create-admin`
_Note: Publicly accessible only if no Admins exist in the system._

- **Request Body:**
  ```json
  {
    "email": "root@example.com",
    "name": "Root Admin",
    "password": "password"
  }
  ```

#### 1.3 Create Admin Subordinates

Only accessible by specific roles (defined in `permissions.json`).

- **Endpoints:**
  - **POST** `/admin/create-admin-manager` (Requires ADMIN)
  - **POST** `/admin/create-admin-accountant` (Requires ADMIN)
  - **POST** `/admin/create-admin-executive` (Requires ADMIN_MANAGER)
- **Request Body:**
  ```json
  {
    "email": "manager@example.com",
    "name": "Admin Manager",
    "password": "password"
  }
  ```

#### 1.4 Admin Role Management

**PUT** `/admin/set-role` (Requires ADMIN role)

- **Request Body:**
  ```json
  {
    "userId": "target-user-uuid",
    "role": "ADMIN_EXECUTIVE"
  }
  ```
- **Valid Roles:** `ADMIN_MANAGER`, `ADMIN_ACCOUNTANT`, `ADMIN_EXECUTIVE`, `UNASSIGNED`.

#### 1.5 Update Profile (Self)

**PUT** `/admin/update`

- **Request Body:**
  ```json
  {
    "name": "Updated Name",
    "password": "newpassword" // Optional
  }
  ```

#### 1.6 Get Current Session

**GET** `/session`

- **Response:**
  ```json
  {
    "session": { ... },
    "user": { ... }
  }
  ```

#### 1.7 List Users

**POST** `/admin/list-users` (Requires ADMIN, ADMIN_MANAGER, or ADMIN_EXECUTIVE)

- **Request Body:**
  ```json
  {
    "role": "USER_PRODUCT_SELLER_ADMIN", // Optional
    "phoneVerified": true, // Optional
    "search": "john" // Optional search text
  }
  ```

### User Routes (Phone/OTP)

#### 1.8 Send OTP

**POST** `/user/send-otp`

- **Request Body:**
  ```json
  {
    "phone": "+919876543210",
    "name": "John Doe",
    "type": "PRODUCT" // "PRODUCT" | "SERVICE" | "BUYER"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User created successfully and OTP sent to the phone number",
    "isNewUser": true
  }
  ```

#### 1.9 Verify OTP

**POST** `/user/verify-otp`

- **Request Body:**
  ```json
  {
    "phone": "+919876543210",
    "otp": "123456"
  }
  ```
- **Response:** Same as Admin Login (Session Object).

#### 1.10 Create User Staff

Only accessible by specific roles.

- **Endpoints:**
  - **POST** `/user/create-user-seller-staff` (Requires USER_PRODUCT_SELLER_ADMIN)
  - **POST** `/user/create-user-service-staff` (Requires USER_SERVICE_PROVIDER_ADMIN)
- **Request Body:**
  ```json
  {
    "name": "Staff Name",
    "phone": "+919876543210"
  }
  ```

#### 1.11 Update Profile (Self)

**PUT** `/user/update`

- **Request Body:**
  ```json
  {
    "name": "Updated Name"
  }
  ```

---

## 2. Business Entity

**Base URL:** `/api/entity`
_All routes require `Authorization: Bearer <token>` header._

### 2.1 Create Entity

**POST** `/`

- **Roles:** `USER_PRODUCT_SELLER_ADMIN`, `USER_SERVICE_PROVIDER_ADMIN`.
- **Constraint:** Limit 1 entity per user.
- **Request Body:**
  ```json
  {
    "name": "My Business",
    "legalName": "My Business Pvt Ltd",
    "description": "A description of the business.",
    "primaryContactNumber": "+919876543210",
    "secondaryContactNumber": "+919876543211",
    "contactEmail": "contact@business.com",
    "supportEmail": "support@business.com",
    "addressLine1": "123 Business Street",
    "addressLine2": "Industrial Area",
    "city": "Mumbai",
    "pincodeId": "uuid-of-pincode"
  }
  ```

### 2.2 Get Entities

**GET** `/`

- **Roles:** `USER_PRODUCT_SELLER_ADMIN`, `USER_SERVICE_PROVIDER_ADMIN` (Fetch own), `ADMIN_MANAGER`, `ADMIN_EXECUTIVE` (Fetch all).

### 2.3 Update Entity Details

**PATCH** `/:id`

- **Roles:** `USER_PRODUCT_SELLER_ADMIN`, `USER_SERVICE_PROVIDER_ADMIN`.

### 2.4 Verify Entity

**PATCH** `/:id/verify`

- **Roles:** `ADMIN_MANAGER`, `ADMIN_EXECUTIVE`.
- **Request Body:**
  ```json
  {
    "status": "APPROVED", // "APPROVED" | "REJECTED"
    "remark": "All documents are valid."
  }
  ```

---

## 3. Catalog

**Base URL:** `/api/catalog`

### 3.1 Category

- **Create:** `POST /category`
- **Update:** `PATCH /category`
- **Delete:** `DELETE /category`
- **List:** `POST /category/list`

### 3.2 Brand

- **Create:** `POST /brand`
- **Update:** `PATCH /brand`
- **Delete:** `DELETE /brand`
- **List:** `POST /brand/list`

### 3.3 Specification

- **Create:** `POST /specification`
- **Update:** `PATCH /specification`
- **Delete:** `DELETE /specification`
- **List:** `POST /specification/list`

### 3.4 Item

- **Create:** `POST /item`
- **Update:** `PATCH /item`
- **Delete:** `DELETE /item`
- **List:** `POST /item/list`

### 3.5 Bulk Upload

- **POST** `/upload`
- Accepts an array of objects to create categories, brands, specifications, and items in bulk.

---

## 4. Item Listing

**Base URL:** `/api/item-listing`

### 4.1 Item Listing

- **Composite Create**: `POST /listing`
- **Update**: `PATCH /listing/:id`
- **Delete**: `DELETE /listing/:id`
- **List**: `POST /listing/list`

### 4.2 Item Rate (Granular)

- **Create**: `POST /rate`
- **Update**: `PATCH /rate/:id`
- **Delete**: `DELETE /rate/:id`
- **List**: `POST /rate/list`

### 4.3 Item Region (Granular)

- **Create**: `POST /region`
- **Update**: `PATCH /region/:id`
- **Delete**: `DELETE /region/:id`
- **List**: `POST /region/list`

---

## 5. Conference Hall (Events, Offers & Content)

**Base URL:** `/api/conference-hall`

### 5.1 Event

**Base Path:** `/event`

- **Create**: `POST /`
- **Update**: `PATCH /:id`
- **Get**: `GET /:id`
- **Delete**: `DELETE /:id`
- **List**: `POST /list`

### 5.2 Offer

**Base Path:** `/offer`

Detailed endpoints for managing offers within the conference hall.

#### 5.2.1 Create Offer

**POST** `/`
Create a new offer draft. Does not publish it.

**Request Body**

```json
{
  "name": "Offer Name",
  "description": "Offer Description",
  "entityId": "uuid",
  "categoryIds": ["uuid", "uuid"],
  "brandIds": ["uuid"],
  "specificationIds": [],
  "itemIds": [],
  "itemListingIds": [],
  "pincodeIds": ["uuid"],
  "attachmentIds": [{ "mediaId": "uuid" }, { "documentId": "uuid" }],
  "startDate": "2024-01-25T00:00:00.000Z",
  "endDate": "2024-12-25T00:00:00.000Z"
}
```

**Response**
Returns the created offer object.

---

#### 5.2.2 Publish Offer

**POST** `/:id/publish`
Publishes transactionally. Deducts coins from entity's wallet.

**Response**

```json
{
  "message": "Offer published successfully",
  "offerId": "uuid"
}
```

---

#### 5.2.3 Update Offer

**PATCH** `/:id`
Updates an offer. If published, only `name`, `description`, and `isActive` can be updated. If draft, relations and regions can also be updated.

**Request Body**

```json
{
  "name": "Updated Name",
  "description": "Updated Description",
  "isActive": true,
  "categoryIds": ["uuid"], // Only allowed if NOT published
  "startDate": "2024-01-25T00:00:00.000Z",
  "endDate": "2024-12-25T00:00:00.000Z"
}
```

**Response**
Returns the updated offer object.

---

#### 5.2.4 Delete Offer

**DELETE** `/:id`
Soft deletes the offer.

**Response**
Returns the updated (deleted) offer object.

---

#### 5.2.5 Get Offer

**GET** `/:id`
Get offer details including relations, regions, and attachments.

---

#### 5.2.6 List Offers

**POST** `/list`
List offers with filtering.

**Request Body**

```json
{
  "entityId": "uuid",
  "isActive": true,
  "isPublic": true,
  "search": "keyword"
}
```

**Response**
Returns array of offer objects.

---

### 5.3 Content

**Base Path:** `/content`

Detailed endpoints for managing content within the conference hall.

#### 5.3.1 Create Content

**POST** `/`
Create a new content draft.

**Request Body**

```json
{
  "name": "Content Name",
  "description": "Content Description",
  "entityId": "uuid",
  "isActive": true,
  "attachmentIds": [{ "mediaId": "uuid" }, { "documentId": "uuid" }]
}
```

**Response**
Returns the created content object.

---

#### 5.3.2 Publish Content

**POST** `/:id/publish`
Publishes the content.

**Response**

```json
{
  "id": "uuid",
  "name": "Content Name",
  "isPublic": true,
  "publishedAt": "2024-01-25T00:00:00.000Z",
  ...
}
```

---

#### 5.3.3 Update Content

**PATCH** `/:id`
Updates a content entry.

**Request Body**

```json
{
  "name": "Updated Name",
  "description": "Updated Description",
  "isActive": true,
  "isPublic": false
}
```

---

#### 5.3.4 Delete Content

**DELETE** `/:id`
Soft deletes the content.

---

#### 5.3.5 Get Content

**GET** `/:id`
Get content details including attachments.

---

#### 5.3.6 List Contents

**POST** `/list`
List contents with filtering.

**Request Body**

```json
{
  "entityId": "uuid",
  "isActive": true,
  "isPublic": true,
  "search": "keyword"
}
```

---

## 6. Activity

**Base URL:** `/api/activity`

### 6.1 Enquiry

- **Create:** `POST /enquiry`
- **Get Details:** `GET /enquiry/:id`
- **Delete:** `DELETE /enquiry/:id`
- **List:** `POST /enquiry/list`

### 6.2 Appointment

- **Create:** `POST /appointment`
- **Get Details:** `GET /appointment/:id`
- **Delete:** `DELETE /appointment/:id`
- **List:** `POST /appointment/list`

### 6.3 Quotation

- **Create:** `POST /quotation`
- **Get Details:** `GET /quotation/:id`
- **Delete:** `DELETE /quotation/:id`
- **List:** `POST /quotation/list`

### 6.4 Activity Assignment

- **Create:** `POST /activity-assignment`
- **Get Details:** `GET /activity-assignment/:id`
- **List:** `POST /activity-assignment/list`

### 6.5 Visit

- **Create:** `POST /visit`
- **Get Details:** `GET /visit/:id`
- **Delete:** `DELETE /visit/:id`
- **List:** `POST /visit/list`

---

## 7. Wallet

**Base URL:** `/api/wallet`

### 7.1 Get Wallet

**GET** `/:entityId`

- Returns balance and recent transactions.

### 7.2 Process Transaction

**POST** `/transaction`

- **Reasons:** `QUOTATION_SUMBIT`, `VISIT_SUBMIT`
- **Types:** `CREDIT`, `DEBIT`
- **Ref Types:** `QUOTATION`, `VISIT`

---

## 8. Notification

**Base URL:** `/api/notification`

### 8.1 Management

- **Create:** `POST /`
  - Body:
    ```json
    {
      "type": "ENQUIRY_RECEIVE",
      "activityId": "activity-uuid",
      "metadata": { "subject": "Hello" },
      "recipients": [
        {
          "userId": "uuid",
          "channelId": "uuid",
          "destination": "email@example.com"
        }
      ]
    }
    ```
- **Get Details:** `GET /:id` (Returns notification + list of sendees)
- **List:** `POST /list`
  - Body: `{ "type": "TYPE", "activityId": "uuid" }`
- **Delete:** `DELETE /:id`

### 8.2 Channel Management

**Base URL:** `/api/notification-channel`

> [!NOTE]
> Channels are linked to the authenticated user. Users can only manage their own channels.

- **Create:** `POST /`
  - Body:
    ```json
    {
      "name": "Primary Phone",
      "type": "SMS",
      "destination": "+919999999901",
      "isActive": true
    }
    ```
- **List:** `GET /` (Returns only channels owned by user)
- **Get:** `GET /:id` (Owner only)
- **Update:** `PATCH /:id`
  - Body: `{ "name": "...", "destination": "...", "isActive": true }`
  - Note: Changing `destination` resets `isVerified` to false.
- **Delete:** `DELETE /:id`
- **Request Verification:** `POST /:id/request-verification`
- **Confirm Verification:** `POST /:id/verify`
  - Body: `{ "otp": "123456" }`

---

## 9. Attachments

**Base URL:** `/api/attachment`

### 9.1 Media Routes (`/media`)

- **Single Upload:** `POST /upload/single`
- **Multiple Upload:** `POST /upload/multiple`
- **Get URL:** `GET /url/:id`

### 9.2 Document Routes (`/document`)

- **Single Upload:** `POST /upload/single`
- **Multiple Upload:** `POST /upload/multiple`
- **Get URL:** `GET /url/:id`
- **Supported Types:** PDF, Doc, Docx, txt, md

---

## 10. Miscellaneous

**Base URL:** `/api/pincode-directory`

### 10.1 Pincode Directory

- **Search:** `POST /list`
- **Body:**
  ```json
  {
    "state": "maharashtra",
    "district": "mumbai",
    "pincode": "400001"
  }
  ```

---

## 11. Forum (Discussion)

**Base URL:** `/api/forum`

### 11.1 Get Discussion Context

**GET** `/context`
Get or create a discussion for a specific context (Event, Offer, Item, or Content).

**Query Parameters:**

- `eventId`: (Optional) UUID of the event.
- `offerId`: (Optional) UUID of the offer.
- `itemId`: (Optional) UUID of the item.
- `contentId`: (Optional) UUID of the content.
- `slug`: (Optional) Unique slug for the discussion.

**Response:**
Returns the discussion object along with its posts.

### 11.2 Post Message

**POST** `/:discussionId/post`
Post a new message to a discussion. Requires authentication.

**Request Body:**

```json
{
  "content": "Your message here..."
}
```

### 11.3 Flag Post

**PATCH** `/post/:postId/flag`
Flag a post for moderation.

**Request Body:**

```json
{
  "reason": "Reason for flagging"
}
```

### 11.4 Hide/Unhide Post

**PATCH** `/post/:postId/hide`
Hide or unhide a post. Requires ADMIN or ADMIN_MANAGER role.

**Request Body:**

```json
{
  "isHidden": true
}
```
