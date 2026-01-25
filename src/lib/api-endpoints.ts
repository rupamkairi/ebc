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
      UPDATE: "/catalog/category", // PATCH
      DELETE: "/catalog/category",
      LIST: "/catalog/category/list",
    },
    BRAND: {
      CREATE: "/catalog/brand",
      UPDATE: "/catalog/brand", // PATCH
      DELETE: "/catalog/brand",
      LIST: "/catalog/brand/list",
    },
    SPECIFICATION: {
      CREATE: "/catalog/specification",
      UPDATE: "/catalog/specification", // PATCH
      DELETE: "/catalog/specification",
      LIST: "/catalog/specification/list",
    },
    ITEM: {
      CREATE: "/catalog/item",
      UPDATE: "/catalog/item", // PATCH
      DELETE: "/catalog/item",
      LIST: "/catalog/item/list",
      GET: "/catalog/item", // :id attached in service
    },
    UPLOAD: "/catalog/upload",
  },
  ITEM_LISTING: {
    LISTING: {
      CREATE: "/item-listing/listing",
      UPDATE: "/item-listing/listing", // :id
      DELETE: "/item-listing/listing", // :id
      LIST: "/item-listing/listing/list",
    },
    RATE: {
      CREATE: "/item-listing/rate",
      UPDATE: "/item-listing/rate", // :id
      DELETE: "/item-listing/rate", // :id
      LIST: "/item-listing/rate/list",
    },
    REGION: {
      CREATE: "/item-listing/region",
      UPDATE: "/item-listing/region", // :id
      DELETE: "/item-listing/region", // :id
      LIST: "/item-listing/region/list",
    },
    OFFER: {
      CREATE: "/item-listing/offer",
      UPDATE: "/item-listing/offer", // :id
      GET: "/item-listing/offer", // :id
      DELETE: "/item-listing/offer", // :id
      LIST: "/item-listing/offer/list",
    },
  },
  CONFERENCE_HALL: {
    EVENT: {
      CREATE: "/conference-hall/event",
      UPDATE: "/conference-hall/event", // :id
      GET: "/conference-hall/event", // :id
      DELETE: "/conference-hall/event", // :id
      LIST: "/conference-hall/event/list",
    },
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
      ACCEPT: "/activity/quotation/accept", // :id
    },
    VISIT: {
      CREATE: "/activity/visit",
      GET: "/activity/visit", // :id
      DELETE: "/activity/visit", // :id
      LIST: "/activity/visit/list",
      ACCEPT: "/activity/visit/accept", // :id
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
  WALLET: {
    PACKAGES: "/wallet/packages",
    DETAILS: "/wallet/", // :entityId
    PRICING: "/wallet/pricing/cost/", // :leadType
    RECHARGE: "/wallet/recharge",
    TRANSACTION: "/wallet/transaction",
    VERIFY_PAYMENT: "/wallet/verify-payment",
  },
  NOTIFICATION: {
    CREATE: "/notification",
    GET: "/notification", // :id
    LIST: "/notification/list",
    UPDATE: "/notification", // :id
    DELETE: "/notification", // :id
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
} as const;
