export interface Entity {
  id: string;
  name: string;
  legalName?: string;
  description?: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  remark?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  op_type?: "PRODUCT" | "SERVICE";
}

export interface CreateEntityRequest {
  name: string;
  legalName?: string;
  description?: string;
  primaryContactNumber?: string;
  secondaryContactNumber?: string;
  contactEmail?: string;
  supportEmail?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  pincodeId?: string;
  type: "MANUFACTURER" | "WHOLESALER" | "RETAILER" | "SERVICE_PROVIDER";
  op_type: "PRODUCT" | "SERVICE";
}

export interface UpdateEntityRequest {
  name?: string;
  legalName?: string;
  description?: string;
}

export interface VerifyEntityRequest {
  status: "VERIFIED" | "REJECTED";
  remark?: string;
}
