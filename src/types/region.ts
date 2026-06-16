export type RegionScopeType = "PAN_INDIA" | "STATE" | "DISTRICT" | "PINCODE";

export interface RegionScopeInput {
  scopeType: RegionScopeType;
  state?: string | null;
  district?: string | null;
  pincodeId?: string | null;
  /** The actual pincode code string (e.g. "110001") — display only, not persisted */
  pincode?: string | null;
}

export interface EntityRegion {
  id: string;
  entityId: string;
  scopeType: RegionScopeType;
  state?: string | null;
  district?: string | null;
  pincodeId?: string | null;
  isActive: boolean;
  pincode?: PincodeRecord;
}

export interface TargetRegion {
  id?: string;
  scopeType?: RegionScopeType;
  state?: string | null;
  district?: string | null;
  pincodeId?: string | null;
  pincode?: PincodeRecord;
}

export interface PincodeRecord {
  id: string;
  pincode?: string | null;
  district: string;
  state: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PincodeListParams {
  state?: string;
  district?: string;
  pincode?: string;
  search?: string;
  page?: number;
  perPage?: number;
  isSpecial?: boolean;
}
