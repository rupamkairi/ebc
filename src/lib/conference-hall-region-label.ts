import { TargetRegion } from "@/types/region";

const titleCase = (value?: string | null) =>
  value
    ?.trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "";

export function formatConferenceHallRegion(region: TargetRegion) {
  const pincode = region.pincode || region.pincodeDirectory;
  const scope =
    region.scopeType ||
    (pincode && !pincode.pincode
      ? pincode.district
        ? "DISTRICT"
        : "STATE"
      : "PINCODE");
  const state = region.state || pincode?.state;
  const district = region.district || pincode?.district;

  if (scope === "PAN_INDIA") return "PAN India";
  if (scope === "STATE") {
    return `State: ${titleCase(state) || "N/A"}`;
  }
  if (scope === "DISTRICT") {
    const location = [titleCase(district), titleCase(state)]
      .filter(Boolean)
      .join(", ");
    return `District: ${location || "N/A"}`;
  }

  return `Pincode: ${pincode?.pincode || region.pincodeId || "N/A"}`;
}
