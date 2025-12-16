# Authentication API Endpoints

Base URL: `/api/auth`

## Admin Routes

All Admin creation and update routes require `Authorization: Bearer <token>` header (except `login` and `create-admin` if no admin exists).

### 1. Admin Login

**POST** `/admin/login`

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "securepassword"
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
  "password": "securepassword"
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
  "password": "securepassword"
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
