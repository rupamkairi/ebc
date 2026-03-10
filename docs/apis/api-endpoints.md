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

User login uses Phone/OTP.

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
- **Note:** `isNewUser` will be `true` if a new user record was created, and `false` if an existing user was found and their OTP was updated. Check server console logs for the OTP.

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
- **Note:** Newly created users must use "Send OTP" to login.

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
- **Note:** `op_type` is automatically assigned based on the user's role (`PRODUCT` for `USER_PRODUCT_SELLER_ADMIN` or `SERVICE` for `USER_SERVICE_PROVIDER_ADMIN`).

### 2.2 Get Entities

**GET** `/`

- **Roles:** `USER_PRODUCT_SELLER_ADMIN`, `USER_SERVICE_PROVIDER_ADMIN` (Fetch own), `ADMIN_MANAGER`, `ADMIN_EXECUTIVE` (Fetch all).
- **Response:** Array of Entity objects including Pincode details.

### 2.3 Update Entity Details

**PATCH** `/:id`

- **Roles:** `USER_PRODUCT_SELLER_ADMIN`, `USER_SERVICE_PROVIDER_ADMIN`.
- Updates the entity with the specified ID. Must be owned by the user.

### 2.4 Verify Entity

**PATCH** `/:id/verify`

- **Roles:** `ADMIN_MANAGER`, `ADMIN_EXECUTIVE`.
- **Request Body:**
  ```json
  {
    "status": "APPROVED", // "APPROVED" | "REJECTED" | "PAUSED"
    "remark": "All documents are valid."
  }
  ```

---

## 3. Catalog

**Base URL:** `/api/catalog`

### 3.1 Category

- **Create:** `POST /category`
  - Body (Top Level):
    ```json
    {
      "name": "Cement & Binders",
      "type": "PRODUCT",
      "categoryIconId": "UUID?"
    }
    ```
  - Body (Sub-Category):
    ```json
    {
      "name": "Cement",
      "type": "PRODUCT",
      "parentCategoryId": "UUID",
      "categoryIconId": "UUID?"
    }
    ```
- **Update:** `PATCH /category`
  - Body: `{ "id": "UUID", "name": "String", ... }`
- **Delete:** `DELETE /category`
  - Body: `{ "id": "UUID" }`
- **List:** `POST /category/list`
  - Body: `{ "type": "PRODUCT?", "isSubCategory": "Boolean?", "parentCategoryId": "UUID?", "search": "String?" }`

### 3.2 Brand

- **Create:** `POST /brand`
  - Body: `{ "name": "String", "brandLogoId": "UUID?" }`
- **Update:** `PATCH /brand`
  - Body: `{ "id": "UUID", "name": "String" }`
- **Delete:** `DELETE /brand`
  - Body: `{ "id": "UUID" }`
- **List:** `POST /brand/list`
  - Body: `{ "search": "String?" }`

### 3.3 Specification

- **Create:** `POST /specification`
  - Body: `{ "name": "String", "description": "String?" }`
- **Update:** `PATCH /specification`
- **Delete:** `DELETE /specification`
- **List:** `POST /specification/list`

### 3.4 Item

- **Create:** `POST /item`
  - Body:
    ```json
    {
      "name": "ACC 10kg Cement",
      "description": "Corrosion Resistant...",
      "type": "PRODUCT",
      "HSNCode": "2524",
      "GSTPercentage": 5,
      "categoryId": "UUID",
      "brandId": "UUID",
      "specificationId": "UUID"
    }
    ```
- **Update:** `PATCH /item`
- **Delete:** `DELETE /item`
- **Get by Id:** `GET /item/:id`
- **List:** `POST /item/list`
  - Body: `{ "search": "String?", "categoryId": "UUID?", "brandId": "UUID?", "specificationId": "UUID?", "type": "PRODUCT" }`

### 3.5 Import Catalog (CSV)

- **POST** `/import/csv`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (CSV file)
- **Response**: Streaming JSON indicating progress.

### 3.6 Bulk Upload (JSON)

- **POST** `/upload`
- **Body**: Array of Objects
  ```json
  [
    {
      "type": "PRODUCT",
      "category": "Electronics",
      "subCategory": "Laptops",
      "brand": "Dell",
      "specification": "Core i7",
      "item": "XPS 15",
      "HSNCode": "8471",
      "GSTPercentage": "18"
    }
  ]
  ```

---

## 4. Item Listing

**Base URL:** `/api/item-listing`

### 4.1 Item Listing

- **Composite Create**: `POST /listing`
- **Update**: `PATCH /listing/:id`
- **Delete**: `DELETE /listing/:id`
- **Get Details**: `GET /listing/:id`
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
- **Verify**: `PATCH /:id/verify` (Admin Only)
- **Publish**: `POST /:id/publish` (Seller/Admin)

#### 5.1.1 Event Request Body

```json
{
  "name": "Event Name",
  "description": "Description",
  "type": "LIVE",
  "isPublic": false,
  "isPhysical": false,
  "isRemote": true,
  "startDate": "2024-01-25T10:00:00.000Z",
  "endDate": "2024-01-25T12:00:00.000Z",
  "location": "Venue",
  "meetingUrl": "https://zoom.us/j/...",
  "targetRegions": [{ "pincodeId": "uuid" }],
  "attachmentIds": [{ "mediaId": "uuid" }]
}
```

### 5.2 Offer

**Base Path:** `/offer`

#### 5.2.1 Create Offer

**POST** `/`
Create a new offer draft.

**Request Body**

```json
{
  "name": "Offer Name",
  "description": "Offer Description",
  "entityId": "uuid",
  "categoryIds": ["uuid"],
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

#### 5.2.2 Publish Offer

**POST** `/:id/publish`
Deducts coins from entity's wallet and makes the offer public.

#### 5.2.3 Update Offer

**PATCH** `/:id`
If published, only `name`, `description`, and `isActive` can be updated.

#### 5.2.4 Verify Offer (Admin Only)

**PATCH** `/:id/verify`
Body: `{ "status": "APPROVED", "remarks": "..." }`

### 5.3 Content

**Base Path:** `/content`

- **Create**: `POST /`
- **Publish**: `POST /:id/publish`
- **Update**: `PATCH /:id`
- **Delete**: `DELETE /:id`
- **Get**: `GET /:id`
- **List**: `POST /list`
- **Verify**: `PATCH /:id/verify` (Admin Only)

---

## 6. Activity

**Base URL:** `/api/activity`

### 6.1 Enquiry

- **Create**: `POST /enquiry`
  - Body:
    ```json
    {
      "lineItems": [
        {
          "itemId": "uuid",
          "quantity": 10,
          "unitType": "Piece",
          "remarks": "...",
          "flexibleWithBrands": true
        }
      ],
      "details": {
        "expectedDate": "2024-12-30T00:00:00.000Z",
        "remarks": "...",
        "address": "...",
        "pincodeDirectoryId": "uuid"
      }
    }
    ```
- **Get Details**: `GET /enquiry/:id`
- **Delete**: `DELETE /enquiry/:id`
- **List**: `POST /enquiry/list`
  - Body: `{ "createdById": "UUID?", "itemId": "UUID?", "search": "String?" }`

### 6.2 Appointment

- **Create**: `POST /appointment`
  - Body:
    ```json
    {
      "lineItems": [{ "itemId": "uuid", "remarks": "..." }],
      "details": {
        "remarks": "...",
        "address": "...",
        "pincodeDirectoryId": "uuid"
      },
      "slots": [
        { "remarks": "...", "fromDateTime": "...", "toDateTime": "..." }
      ]
    }
    ```
- **Get Details**: `GET /appointment/:id`
- **Delete**: `DELETE /appointment/:id`
- **List**: `POST /appointment/list`

### 6.3 Quotation

- **Create**: `POST /quotation`
  - Body:
    ```json
    {
      "enquiryId": "uuid",
      "lineItems": [
        {
          "itemId": "uuid",
          "rate": 100.0,
          "amount": 1000.0,
          "isNegotiable": true
        }
      ],
      "details": {
        "expectedDate": "...",
        "remarks": "...",
        "attachmentIds": ["uuid"]
      }
    }
    ```
- **Get Details**: `GET /quotation/:id`
- **Delete**: `DELETE /quotation/:id`
- **List**: `POST /quotation/list`

### 6.4 Activity Assignment

- **Create**: `POST /activity-assignment`
  - Body: `{ "type": "ENQUIRY_ASSIGNMENT", "enquiryId": "uuid", "toEntityId": "uuid" }`
- **Get Details**: `GET /activity-assignment/:id`
- **List**: `POST /activity-assignment/list`

### 6.5 Visit

- **Create**: `POST /visit`
  - Body: `{ "appointmentId": "uuid", "visitSlotId": "uuid" }`
- **Get Details**: `GET /visit/:id`
- **Delete**: `DELETE /visit/:id`
- **List**: `POST /visit/list`

---

## 7. Wallet

**Base URL:** `/api/wallet`

### 7.1 Wallet Management

- **Get Wallet**: `GET /:entityId` (Balance & Transactions)
- **List Wallets**: `GET /list` (Admin Only)
- **Manual Adjustment**: `POST /adjust` (Admin Only)
- **Transactions**: `POST /transaction`
  - Body:
    ```json
    {
      "walletId": "uuid",
      "cost": 100.0,
      "reason": "QUOTATION_SUMBIT", // or VISIT_SUBMIT, OFFER_PUBLISH, etc.
      "type": "DEBIT", // or CREDIT
      "refType": "QUOTATION",
      "refId": "uuid"
    }
    ```
  - **Side Effects**: Debiting for `QUOTATION` or `VISIT` automatically sets `isActive = true` on the reference.

### 7.2 Packages & Pricing

- **Get Packages**: `GET /packages`
- **Create Package**: `POST /packages` (Admin Only)
- **Get Pricing**: `GET /pricing`
- **Get Lead Cost**: `GET /pricing/cost/:leadType`
- **Set Lead Pricing**: `POST /pricing` (Admin Only)

---

## 8. Notification

**Base URL:** `/api/notification`

### 8.1 Notification Management

- **Create**: `POST /`
  - Body: `{ "channel": "EMAIL", "type": "ENQUIRY_SUMBIT", "metadata": { "subject": "..." } }`
- **Get Details**: `GET /:id`
- **List**: `POST /list`
- **Update**: `PATCH /:id` (e.g., mark as processed)
- **Delete**: `DELETE /:id`

### 8.2 Channel Management

**Base URL:** `/api/notification-channel`

- **Create**: `POST /`
- **List**: `GET /` (Own channels)
- **Verification**:
  - `POST /:id/request-verification`
  - `POST /:id/verify` (Body: `{ "otp": "..." }`)

---

## 9. Attachments

**Base URL:** `/api/attachment`

### 9.1 Media Routes (`/media`)

- **Upload**: `POST /upload/single` | `POST /upload/multiple`
- **Get URL**: `GET /url/:id`

### 9.2 Document Routes (`/document`)

- **Upload**: `POST /upload/single` | `POST /upload/multiple`
- **Get URL**: `GET /url/:id`
- **Supported Types**: PDF, Doc, Docx, txt, md

---

## 10. Miscellaneous

**Base URL:** `/api/pincode-directory`

### 10.1 Pincode Directory

- **Search:** `POST /list`
- **Body:** `{ "state": "...", "district": "...", "pincode": "..." }`
- **Note:** All fields are optional. Partial matches are supported for `state` and `district` (case-insensitive).

---

## 11. Forum (Discussion)

**Base URL:** `/api/forum`

- **Get Context**: `GET /context?eventId=...` (Event, Offer, Item, or Content)
- **Post Message**: `POST /:discussionId/post`
- **Flag Post**: `PATCH /post/:postId/flag`
- **Moderate**: `PATCH /post/:postId/hide` (Admin Only)
