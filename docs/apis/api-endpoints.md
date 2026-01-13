# EBC API Documentation

This document provides a consolidated view of all API endpoints available in the EBC Server.

## Table of Contents

1. [Authentication](#1-authentication)
2. [Business Entity](#2-business-entity)
3. [Catalog](#3-catalog)
4. [Activity (Enquiry, Appointment, etc.)](#4-activity)
5. [Wallet](#5-wallet)
6. [Notification](#6-notification)
7. [Attachments](#7-attachments)
8. [Miscellaneous (Pincode Directory)](#8-miscellaneous)

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

### 3.5 Item Listing (Composite)

- **Create:** `POST /item-listing`
- **Update:** `PATCH /item-listing/:id`
- **Delete:** `DELETE /item-listing/:id`
- **List:** `POST /item-listing/list`

### 3.6 Item Rate & Region (Granular)

- **Rate Create/Update/Delete/List:** Under `/item-rate`
- **Region Create/Update/Delete/List:** Under `/item-region`

### 3.7 Bulk Upload

- **POST** `/upload`
- Accepts an array of objects to create categories, brands, specifications, and items in bulk.

---

## 4. Activity

**Base URL:** `/api/activity`

### 4.1 Enquiry

- **Create:** `POST /enquiry`
- **Get Details:** `GET /enquiry/:id`
- **Delete:** `DELETE /enquiry/:id`
- **List:** `POST /enquiry/list`

### 4.2 Appointment

- **Create:** `POST /appointment`
- **Get Details:** `GET /appointment/:id`
- **Delete:** `DELETE /appointment/:id`
- **List:** `POST /appointment/list`

### 4.3 Quotation

- **Create:** `POST /quotation`
- **Get Details:** `GET /quotation/:id`
- **Delete:** `DELETE /quotation/:id`
- **List:** `POST /quotation/list`

### 4.4 Activity Assignment

- **Create:** `POST /activity-assignment`
- **Get Details:** `GET /activity-assignment/:id`
- **List:** `POST /activity-assignment/list`

### 4.5 Visit

- **Create:** `POST /visit`
- **Get Details:** `GET /visit/:id`
- **Delete:** `DELETE /visit/:id`
- **List:** `POST /visit/list`

---

## 5. Wallet

**Base URL:** `/api/wallet`

### 5.1 Get Wallet

**GET** `/:entityId`

- Returns balance and recent transactions.

### 5.2 Process Transaction

**POST** `/transaction`

- **Reasons:** `QUOTATION_SUMBIT`, `VISIT_SUBMIT`
- **Types:** `CREDIT`, `DEBIT`
- **Ref Types:** `QUOTATION`, `VISIT`

---

## 6. Notification

**Base URL:** `/api/notification`

### 6.1 Management

- **Create:** `POST /`
- **Get Details:** `GET /:id`
- **List:** `POST /list`
- **Update:** `PATCH /:id`
- **Delete:** `DELETE /:id`

---

## 7. Attachments

**Base URL:** `/api/attachment`

### 7.1 Media Routes (`/media`)

- **Single Upload:** `POST /upload/single`
- **Multiple Upload:** `POST /upload/multiple`
- **Get URL:** `GET /url/:id`

### 7.2 Document Routes (`/document`)

- **Single Upload:** `POST /upload/single`
- **Multiple Upload:** `POST /upload/multiple`
- **Get URL:** `GET /url/:id`
- **Supported Types:** PDF, Doc, Docx, txt, md

---

## 8. Miscellaneous

**Base URL:** `/api/pincode-directory`

### 8.1 Pincode Directory

- **Search:** `POST /list`
- **Body:**
  ```json
  {
    "state": "maharashtra",
    "district": "mumbai",
    "pincode": "400001"
  }
  ```
