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
}
