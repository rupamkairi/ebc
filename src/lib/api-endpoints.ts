export const API_ENDPOINTS = {
  AUTH: {
    ADMIN: {
      LOGIN: "/auth/admin/login",
      CREATE_ADMIN: "/auth/admin/create-admin",
      CREATE_MANAGER: "/auth/admin/create-admin-manager",
      CREATE_ACCOUNTANT: "/auth/admin/create-admin-accountant",
      CREATE_EXECUTIVE: "/auth/admin/create-admin-executive",
      SET_ROLE: "/auth/admin/set-role",
      UPDATE_PROFILE: "/auth/admin/update",
      LIST_USERS: "/auth/admin/list-users",
    },
    USER: {
      SEND_OTP: "/auth/user/send-otp",
      VERIFY_OTP: "/auth/user/verify-otp",
      CREATE_SELLER_STAFF: "/auth/user/create-user-seller-staff",
      CREATE_SERVICE_STAFF: "/auth/user/create-user-service-staff",
      UPDATE_PROFILE: "/auth/user/update",
    },
    SESSION: "/auth/session",
  },
  CATALOG: {
    CATEGORY: {
      CREATE: "/catalog/category",
      UPDATE: "/catalog/category",
      DELETE: "/catalog/category",
      LIST: "/catalog/category/list",
    },
    BRAND: {
      CREATE: "/catalog/brand",
      UPDATE: "/catalog/brand",
      DELETE: "/catalog/brand",
      LIST: "/catalog/brand/list",
    },
    SPECIFICATION: {
      CREATE: "/catalog/specification",
      UPDATE: "/catalog/specification",
      DELETE: "/catalog/specification",
      LIST: "/catalog/specification/list",
    },
    ITEM: {
      CREATE: "/catalog/item",
      UPDATE: "/catalog/item",
      DELETE: "/catalog/item",
      LIST: "/catalog/item/list",
    },
    ITEM_RATE: {
      CREATE: "/catalog/itemrate",
      UPDATE: "/catalog/itemrate",
      DELETE: "/catalog/itemrate",
      LIST: "/catalog/itemrate/list",
    },
    UPLOAD: "/catalog/upload",
  },
  PINCODE_DIRECTORY: {
    LIST: "/pincode-directory/list",
  },
} as const;
