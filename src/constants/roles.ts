import {
  USER_ROLE,
  USER_ROLE_LABELS,
  ENTITY_TYPE,
  ENTITY_TYPE_LABELS,
} from "./enums";

export { USER_ROLE, USER_ROLE_LABELS, ENTITY_TYPE, ENTITY_TYPE_LABELS };

export const ADMIN_ROLES = [
  USER_ROLE.ADMIN,
  USER_ROLE.ADMIN_MANAGER,
  USER_ROLE.ADMIN_ACCOUNTANT,
  USER_ROLE.ADMIN_EXECUTIVE,
];

export const SELLER_ROLES = [
  USER_ROLE.USER_PRODUCT_SELLER_ADMIN,
  USER_ROLE.USER_PRODUCT_SELLER_STAFF,
  USER_ROLE.USER_SERVICE_PROVIDER_ADMIN,
  USER_ROLE.USER_SERVICE_PROVIDER_STAFF,
];

export const BUYER_ROLES = [USER_ROLE.USER_BUYER_ADMIN];

/**
 * Returns the correct dashboard path for a given role.
 * Used when redirecting users who visit the wrong dashboard.
 */
export function getDashboardPathForRole(role: string): string {
  const r = role.toUpperCase();
  if (ADMIN_ROLES.includes(r as USER_ROLE)) return "/admin-dashboard";
  if (SELLER_ROLES.includes(r as USER_ROLE)) return "/seller-dashboard";
  if (BUYER_ROLES.includes(r as USER_ROLE)) return "/buyer-dashboard";
  return "/"; // fallback for UNASSIGNED or unknown
}

/**
 * Helper to determine if a user role represents a service business
 */
export function isServiceBusiness(role?: string | null): boolean {
  return (
    role === USER_ROLE.USER_SERVICE_PROVIDER_ADMIN ||
    role === USER_ROLE.USER_SERVICE_PROVIDER_STAFF
  );
}

/**
 * Helper to determine if a user role represents a product business
 */
export function isProductBusiness(role?: string | null): boolean {
  return (
    role === USER_ROLE.USER_PRODUCT_SELLER_ADMIN ||
    role === USER_ROLE.USER_PRODUCT_SELLER_STAFF
  );
}
