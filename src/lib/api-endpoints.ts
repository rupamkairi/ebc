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
      GET: "/catalog/item", // :id attached in service
    },
    ITEM_LISTING: {
      CREATE: "/catalog/item-listing",
      UPDATE: "/catalog/item-listing",
      DELETE: "/catalog/item-listing",
      LIST: "/catalog/item-listing/list",
    },
    ITEM_RATE: {
      CREATE: "/catalog/item-rate",
      UPDATE: "/catalog/item-rate",
      DELETE: "/catalog/item-rate",
      LIST: "/catalog/item-rate/list",
    },
    ITEM_REGION: {
      CREATE: "/catalog/item-region",
      UPDATE: "/catalog/item-region",
      DELETE: "/catalog/item-region",
      LIST: "/catalog/item-region/list",
    },
    UPLOAD: "/catalog/upload",
  },
  ACTIVITY: {
    ENQUIRY: {
      CREATE: "/activity/enquiry",
      GET: "/activity/enquiry", // :id
      DELETE: "/activity/enquiry", // :id
      LIST: "/activity/enquiry/list",
    },
    APPOINTMENT: {
      CREATE: "/activity/appointment",
      GET: "/activity/appointment", // :id
      DELETE: "/activity/appointment", // :id
      LIST: "/activity/appointment/list",
    },
    ASSIGNMENT: {
      CREATE: "/activity/activity-assignment",
      GET: "/activity/activity-assignment", // :id
      LIST: "/activity/activity-assignment/list",
    },
    QUOTATION: {
      CREATE: "/activity/quotation",
      GET: "/activity/quotation", // :id
      UPDATE: "/activity/quotation", // :id
      DELETE: "/activity/quotation", // :id
      LIST: "/activity/quotation/list",
    },
  },
  PINCODE_DIRECTORY: {
    LIST: "/pincode-directory/list",
  },
  ENTITY: {
    CREATE: "/entity",
    GET_ALL: "/entity",
    UPDATE: "/entity", // :id attached in service
    VERIFY: "/entity", // :id/verify attached in service
  },
  ATTACHMENT: {
    MEDIA: {
      UPLOAD_SINGLE: "/attachment/media/upload/single",
      UPLOAD_MULTIPLE: "/attachment/media/upload/multiple",
      GET_URL: "/attachment/media/url", // :id
    },
    DOCUMENT: {
      UPLOAD_SINGLE: "/attachment/document/upload/single",
      UPLOAD_MULTIPLE: "/attachment/document/upload/multiple",
      GET_URL: "/attachment/document/url", // :id
    },
  },
  WALLET: {
    PACKAGES: "/wallet/packages",
    DETAILS: "/wallet/", // :entityId
    PRICING: "/wallet/pricing/cost/", // :leadType
    RECHARGE: "/wallet/recharge",
    TRANSACTION: "/wallet/transaction",
    VERIFY_PAYMENT: "/wallet/verify-payment",
  },
} as const;
