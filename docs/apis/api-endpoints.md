# Authentication API Endpoints

Base URL: `/api/auth`

## Admin Routes

All Admin creation and update routes require `Authorization: Bearer <token>` header (except `login` and `create-admin` if no admin exists).

### 1. Admin Login

**POST** `/admin/login`

**Request Body:**

```json
{
  "email": "root@example.com",
  "password": "password"
}
```

**Response:**

```json
{
  "id": "session-uuid",
  "token": "jwt-token-string",
  "userId": "user-uuid",
  "expiresAt": "2024-12-25T00:00:00.000Z"
}
```

### 2. Create Root Admin

**POST** `/admin/create-admin`
_Note: Publicly accessible only if no Admins exist in the system._

**Request Body:**

```json
{
  "email": "root@example.com",
  "name": "Root Admin",
  "password": "password"
}
```

### 3. Create Admin Subordinates

Only accessible by specific roles (defined in `permissions.json`).

**Endpoints:**

- **POST** `/admin/create-admin-manager` (Requires ADMIN)
- **POST** `/admin/create-admin-accountant` (Requires ADMIN)
- **POST** `/admin/create-admin-executive` (Requires ADMIN_MANAGER)

**Request Body:**

```json
{
  "email": "manager@example.com",
  "name": "Admin Manager",
  "password": "password"
}
```

### 4. Admin Role Management

**PUT** `/admin/set-role`
_Requires ADMIN role._

**Request Body:**

```json
{
  "userId": "target-user-uuid",
  "role": "ADMIN_EXECUTIVE"
}
```

_Note: Valid roles: `ADMIN_MANAGER`, `ADMIN_ACCOUNTANT`, `ADMIN_EXECUTIVE`, `UNASSIGNED`._

### 5. Update Profile (Self)

**PUT** `/admin/update`

**Request Body:**

```json
{
  "name": "Updated Name",
  "password": "newpassword" // Optional
}
```

### 6. Get Current Session

**GET** `/session`

**Response:**

```json
{
  "session": { ... },
  "user": { ... }
}
```

### 7. List Users

**POST** `/admin/list-users`
_Requires ADMIN, ADMIN_MANAGER, or ADMIN_EXECUTIVE role._

**Request Body:**

```json
{
  "role": "USER_SELLER_ADMIN", // Optional
  "phoneVerified": true, // Optional
  "search": "john" // Optional search text
}
```

---

## User Routes

User login uses Phone/OTP.

### 1. Send OTP

**POST** `/user/send-otp`

**Request Body:**

```json
{
  "phone": "+919876543210"
}
```

**Response:**

```json
{
  "message": "OTP sent"
}
```

_Check server console logs for the OTP._

### 2. Verify OTP

**POST** `/user/verify-otp`

**Request Body:**

```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Response:** (_Same as Admin Login - Session Object_)

### 3. Create User Staff

Only accessible by specific roles.

**Endpoints:**

- **POST** `/user/create-user-seller-staff` (Requires USER_SELLER_ADMIN)
- **POST** `/user/create-user-service-staff` (Requires USER_SERVICE_ADMIN)

**Request Body:**

```json
{
  "name": "Staff Name",
  "phone": "+919876543210"
}
```

_Note: Newly created users must use "Send OTP" to login._

### 4. Update Profile (Self)

**PUT** `/user/update`

**Request Body:**

```json
{
  "name": "Updated Name"
}
```

# Entity API Endpoints

Base URL: `/api/entity`

All routes require `Authorization: Bearer <token>` header.

## Business Entity Management

### 1. Create Entity

**POST** `/`

**Roles:** `USER_SELLER_ADMIN`, `USER_SERVICE_ADMIN`.
**Constraint:** Limit 1 entity per user.

**Request Body:**

```json
{
  "name": "My Business",
  "legalName": "My Business Pvt Ltd",
  "description": "A description of the business."
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "My Business",
  ...
}
```

### 2. Get Entities

**GET** `/`

**Roles:** `USER_SELLER_ADMIN`, `USER_SERVICE_ADMIN` (Fetch own), `ADMIN_MANAGER`, `ADMIN_EXECUTIVE` (Fetch all).

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "My Business",
    "createdById": "user-uuid",
    ...
  }
]
```

### 3. Update Entity Details

**PATCH** `/:id`

**Roles:** `USER_SELLER_ADMIN`, `USER_SERVICE_ADMIN`.
Updates the entity with the specified ID. Must be owned by the user.

**Request Body:**

```json
{
  "name": "Updated Name",
  "legalName": "Updated Legal Name",
  "description": "Updated description"
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Updated Name",
  ...
}
```

### 4. Verify Entity

**PATCH** `/:id/verify`

**Roles:** `ADMIN_MANAGER`, `ADMIN_EXECUTIVE`.

**Request Body:**

```json
{
  "status": "APPROVED",
  "remark": "All documents are valid."
}
```

_Note: `status` must be either "APPROVED" or "REJECTED"._

**Response:**

```json
{
  "id": "uuid",
  "verificationStatus": "APPROVED",
  ...
}
```

# Catalog API Endpoints

Base URL: `/api/catalog`

## Category

- **Create**: `POST /category`
  - Body:
  ```json
  {
    "name": "Cement & Binders",
    "type": "PRODUCT",
    "categoryIconId": "UUID?"
  }
  ```
  And for Sub-Category
  ```json
  {
    "name": "Cement",
    "type": "PRODUCT",
    "parentCategoryId": "f224e3b3-82e0-43ab-a374-cd6ce81f457f",
    "categoryIconId": "UUID?"
  }
  ```
- **Update**: `PATCH /category`
  - Body:
  ```json
  {
    "id": "UUID",
    "name": "String",
    ...
  }
  ```
- **Delete**: `DELETE /category`
  - Body: `{ "id": "UUID" }`
- **List**: `POST /category/list`
  - Body:
    ```json
    {
      "type": "PRODUCT",
      "isSubCategory": true,
      "parentCategoryId": "UUID",
      "search": "String"
    }
    ```

## Brand

- **Create**: `POST /brand`
  - Body: `{ "name": "String", "brandLogoId": "UUID?" }`
- **Update**: `PATCH /brand`
  - Body: `{ "id": "UUID", "name": "String" }`
- **Delete**: `DELETE /brand`
  - Body: `{ "id": "UUID" }`
- **List**: `POST /brand/list`
  - Body:
    ```json
    {
      "search": "String"
    }
    ```

## Specification

- **Create**: `POST /specification`
  - Body: `{ "name": "String", "description": "String?" }`
- **Update**: `PATCH /specification`
  - Body: `{ "id": "UUID", "name": "String", ... }`
- **Delete**: `DELETE /specification`
  - Body: `{ "id": "UUID" }`
- **List**: `POST /specification/list`
  - Body:
    ```json
    {
      "search": "String"
    }
    ```

## Item

- **Create**: `POST /item`
  - Body:
  ```json
  {
    "name": "ACC 10kg Cement - Corrosion Resistant",
    "description": "ACC 10kg Cement - Corrosion Resistant. Pack: 5 Meter. HSN: 2524. GST: 5%. Supplier: Manufacturer located in Telangana.",
    "type": "PRODUCT",
    "HSNCode": "2524",
    "GSTPercentage": 5,
    "categoryId": "c49c663b-6fac-4952-9a24-22a1f0d270d9",
    "brandId": "c4968c03-f892-44fa-9f2e-50b473ac4e3a",
    "specificationId": "5a9d9825-1c40-4a30-9aee-f9cb18ec6a9e"
  }
  ```
- **Update**: `PATCH /item`
  - Body:
  ```json
  {
    "id": "UUID",
    ...
  }
  ```
- **Delete**: `DELETE /item`
  - Body: `{ "id": "UUID" }`
- **List**: `POST /item/list`
  - Body:
    ```json
    {
      "search": "String",
      "categoryId": "UUID",
      "brandId": "UUID",
      "specificationId": "UUID",
      "type": "PRODUCT"
    }
    ```

## Item Listing

- **Composite Create**: `POST /item-listing`
  - Body:
  ```json
  {
    "item_listing": {
      "itemId": "b9cacaae-b2e5-472c-9410-92738972a2fb",
      "entityId": "8e789b10-6224-4d27-b328-e3497476d7bb",
      "item_rate": {
        "minQuantity": 50,
        "unitType": "Kilogram",
        "rate": 400,
        "isNegotiable": false
      },
      "item_region": [
        {
          "state": "Delhi",
          "wholeState": true,
          "pincodeId": "550e8400-e29b-41d4-a716-446655440000"
        }
      ]
    }
  }
  ```
- **Update**: `PATCH /item-listing/:id`
  - Body: `{ "isActive": boolean }`
- **Delete**: `DELETE /item-listing/:id`
- **List**: `POST /item-listing/list`
  - Body:
    ```json
    {
      "itemId": "UUID",
      "entityId": "UUID",
      "search": "String"
    }
    ```

## Item Rate (Granular)

- **Create**: `POST /item-rate`
  - Body:
  ```json
  {
    "itemListingId": "UUID",
    "minQuantity": 50,
    "unitType": "Kilogram",
    "rate": 400,
    "isNegotiable": true
  }
  ```
- **Update**: `PATCH /item-rate/:id`
  - Body: `{ "rate": 450, ... }`
- **Delete**: `DELETE /item-rate/:id`
- **List**: `POST /item-rate/list`
  - Body: `{ "itemListingId": "UUID" }`

## Item Region (Granular)

- **Create**: `POST /item-region`
  - Body:
  ```json
  {
    "itemListingId": "UUID",
    "regions": [
      {
        "state": "Maharashtra",
        "wholeState": true
      },
      {
        "state": "Karnataka",
        "district": "Bangalore",
        "wholeDistrict": true
      }
    ]
  }
  ```
- **Update**: `PATCH /item-region/:id`
  - Body: `{ "isAvailable": false, ... }`
- **Delete**: `DELETE /item-region/:id`
- **List**: `POST /item-region/list`
  - Body: `{ "itemListingId": "UUID" }`

## Bulk Upload

- **Upload**: `POST /upload`
  - Body: Array of Objects
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
- This does not account for finding (category, brand & specification) & link or create & link.

# Miscellaneous API Endpoints

Base URL: `/api/pincode-directory`

## Pincode Directory

- **Search**: `POST /list`
  - Fetch pincode records based on state, district, or pincode.
  - Body:
    ```json
    {
      "state": "maharashtra",
      "district": "mumbai",
      "pincode": "400001"
    }
    ```
  - Response (Success):
    ```json
    [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "state": "Maharashtra",
        "district": "Mumbai",
        "pincode": "400001"
      }
    ]
    ```
  - Note: All fields are optional. Partial matches are supported for `state` and `district` (case-insensitive). `id` is a UUID.

# Activity API Endpoints

Base URL: `/api/activity`

## Enquiry

- **Create**: `POST /enquiry`
  - Body:
  ```json
  {
    "lineItems": [
      {
        "itemId": "b9cacaae-b2e5-472c-9410-92738972a2fb",
        "quantity": 10,
        "unitType": "Piece",
        "remarks": "Urgent requirement",
        "flexibleWithBrands": true
      }
    ],
    "details": {
      "expectedDate": "2024-12-30T00:00:00.000Z",
      "remarks": "Delivery at site A",
      "address": "123 Street Name",
      "pincodeDirectoryId": "uuid-of-pincode"
    }
  }
  ```
- **Get Details**: `GET /enquiry/:id`
- **Delete**: `DELETE /enquiry/:id`
- **List**: `POST /enquiry/list`
  - Body:
  ```json
  {
    "createdById": "UUID?",
    "itemId": "UUID?",
    "search": "String?"
  }
  ```

---

## Appointment

- **Create**: `POST /appointment`
  - Body:
  ```json
  {
    "lineItems": [
      {
        "itemId": "b9cacaae-b2e5-472c-9410-92738972a2fb",
        "remarks": "Sample inspection"
      }
    ],
    "details": {
      "remarks": "Meeting at main office"
    },
    "slots": [
      {
        "remarks": "Prefers morning"
      }
    ]
  }
  ```
- **Get Details**: `GET /appointment/:id`
- **Delete**: `DELETE /appointment/:id`
- **List**: `POST /appointment/list`
  - Body:
  ```json
  {
    "createdById": "UUID?",
    "itemId": "UUID?",
    "search": "String?"
  }
  ```
