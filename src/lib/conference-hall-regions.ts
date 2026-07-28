import { RegionScopeInput, TargetRegion } from "@/types/region";

const normalize = (value?: string | null) => value?.trim().toLowerCase() || null;

export function serializeConferenceHallRegions(
  regions: TargetRegion[],
): RegionScopeInput[] {
  return regions.map((region) => {
    const record = region.pincode;
    if (record && !record.pincode) {
      if (record.district) {
        return {
          scopeType: "DISTRICT",
          state: normalize(record.state),
          district: normalize(record.district),
          pincodeId: null,
        };
      }
      return {
        scopeType: "STATE",
        state: normalize(record.state),
        district: null,
        pincodeId: null,
      };
    }

    return {
      scopeType: region.scopeType || "PINCODE",
      state: normalize(region.state),
      district: normalize(region.district),
      pincodeId: region.pincodeId || null,
    };
  });
}
