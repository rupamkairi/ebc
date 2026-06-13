import { AdminUser } from "@/types/auth";

const normalize = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

export function filterAdminUsers(
  users: AdminUser[],
  search: string,
  filters: {
    verificationStatus?: string;
    phoneVerified?: string;
  } = {},
) {
  const searchTerm = normalize(search);

  return users.filter((user) => {
    const entity = user.createdEntities?.[0] || user.staffAt;

    if (
      filters.verificationStatus &&
      filters.verificationStatus !== "ALL" &&
      entity?.verificationStatus !== filters.verificationStatus
    ) {
      return false;
    }

    if (filters.phoneVerified && filters.phoneVerified !== "ALL") {
      const expected = filters.phoneVerified === "VERIFIED";
      if (Boolean(user.phoneVerified) !== expected) return false;
    }

    if (!searchTerm) return true;

    const pincode = user.pincode || user.pincode_directory;
    const haystack = [
      user.name,
      user.email,
      user.phone,
      user.username,
      entity?.name,
      entity?.verificationStatus,
      pincode?.pincode,
      pincode?.district,
      pincode?.state,
    ]
      .map(normalize)
      .join(" ");

    return haystack.includes(searchTerm);
  });
}
