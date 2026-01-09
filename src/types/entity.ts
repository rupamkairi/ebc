export interface Entity {
  id: string;
  name: string;
  legalName?: string;
  description?: string;
  primaryContactNumber?: string | null;
  secondaryContactNumber?: string | null;
  contactEmail?: string | null;
  supportEmail?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  pincodeId?: string | null;
  createdById: string;
  deletedById?: string | null;
  type?: string | null;
  op_type: "PRODUCT" | "SERVICE";
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  verificaitonRemark?: string | null;
  verifiedById?: string | null;
  createdAt: string;
  updatedAt: string;
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
  primaryContactNumber?: string;
  secondaryContactNumber?: string;
  contactEmail?: string;
  supportEmail?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  pincodeId?: string;
}

export interface VerifyEntityRequest {
  status: "APPROVED" | "REJECTED";
  remark?: string;
}
