export interface TargetRegion {
  id: string;
  pincodeId: string;
  pincode?: PincodeRecord;
}

export interface PincodeRecord {
  id: string;
  pincode: string;
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
  isSpecial?: boolean; // Added for fetching whole state/district entries
}
