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
} as const;
