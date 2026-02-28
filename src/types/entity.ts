import { ENTITY_TYPE, VERIFICATION_STATUS, ITEM_TYPE } from "@/constants/enums";

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
  type?: ENTITY_TYPE | null;
  op_type: ITEM_TYPE;
  verificationStatus: VERIFICATION_STATUS;
  verificaitonRemark?: string | null;
  verifiedById?: string | null;
  documents?: string[] | null;
  entityAttachments?:
    | {
        id: string;
        documentId: string;
        document: {
          id: string;
          key: string;
          url: string;
          mimeType: string;
          sizeBytes: string;
          name?: string;
        };
      }[]
    | null;
  pincode?: {
    id: string;
    pincode: string;
    district: string;
    state: string;
  } | null;
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
  type: ENTITY_TYPE;
  op_type: ITEM_TYPE;
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
  documents?: string[];
}

export interface VerifyEntityRequest {
  status: VERIFICATION_STATUS;
  remark?: string;
}
