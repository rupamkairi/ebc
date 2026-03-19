import { REF_TYPE, ACTIVITY_TYPE, ENQUIRY_STATUS, QUOTATION_STATUS } from "@/constants/enums";
import { UnitType } from "@/constants/quantities";
import { Item, ItemListing } from "./catalog";

// Shared definitions
export { REF_TYPE };

export interface LineItem {
  id?: string;
  itemId: string;
  itemListingId?: string | null;
  remarks?: string | null;
  item?: Item;
  itemListing?: ItemListing;
}

// Shared User Interface for Activity Creators
export interface ActivityUser {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role: string;
  staffAtEntityId?: string;
  staffAt?: {
    id: string;
    name: string;
  } | null;
  createdEntities?: {
    id: string;
    name: string;
  }[];
}

// Enquiry Specifics
export interface EnquiryLineItem extends LineItem {
  quantity: number;
  unitType: UnitType;
  flexibleWithBrands?: boolean;
}

export interface EnquiryDetails {
  expectedDate?: string;
  remarks?: string;
  address?: string;
  pincodeDirectoryId?: string;
}

export interface CreateEnquiryRequest {
  lineItems: Omit<EnquiryLineItem, "id" | "item">[];
  details: EnquiryDetails;
}

export interface Enquiry {
  id: string;
  enquiryLineItems: EnquiryLineItem[];
  enquiryDetails: EnquiryDetails[];
  status: ENQUIRY_STATUS;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy?: ActivityUser;
}

export interface EnquiryListParams {
  createdById?: string;
  itemId?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

// Appointment Specifics
export interface AppointmentLineItem extends LineItem {
  remarks?: string | null;
}

export interface AppointmentDetails {
  remarks?: string;
  address?: string;
  pincodeDirectoryId?: string;
  pincode?: {
    id: string;
    pincode: string;
    district: string;
    state: string;
  } | null;
}

export interface AppointmentSlot {
  id?: string;
  remarks?: string;
  appointmentId?: string;
  fromDateTime: string | Date;
  toDateTime: string | Date;
}

export interface CreateAppointmentRequest {
  lineItems: Omit<AppointmentLineItem, "id" | "item">[];
  details: AppointmentDetails;
  slots: AppointmentSlot[];
}

export interface Appointment {
  id: string;
  appointmentLineItems: AppointmentLineItem[];
  appointmentDetails: AppointmentDetails[];
  appointmentSlots: AppointmentSlot[];
  status: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy?: ActivityUser;
}

export interface AppointmentListParams {
  createdById?: string;
  itemId?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

// Assignment Specifics
export interface ActivityAssignment {
  id: string;
  type: ACTIVITY_TYPE;
  enquiryId?: string;
  appointmentId?: string;
  toEntityId: string;
  createdAt: string;
  updatedAt: string;
  enquiry?: Enquiry;
  appointment?: Appointment;
}

export interface AssignmentListParams {
  type?: ACTIVITY_TYPE;
  toEntityId?: string;
  enquiryId?: string;
  appointmentId?: string;
  page?: number;
  perPage?: number;
}

// Quotation Specifics
export interface QuotationLineItem extends LineItem {
  rate: number;
  amount: number;
  isNegotiable: boolean;
}

export interface QuotationDetails {
  expectedDate?: string;
  remarks?: string;
  attachmentIds?: string[];
  requestedRevision?: boolean;
  hasBeenRevised?: boolean;
  revisionRemarks?: string | null;
}

export interface CreateQuotationRequest {
  enquiryId: string;
  lineItems: Omit<QuotationLineItem, "id" | "item">[];
  details: QuotationDetails;
  hasBeenRevised?: boolean;
  priceChangeType?: "INCREASED" | "DECREASED" | "MAINTAINED";
}

export interface UpdateQuotationRequest {
  id?: string;
  lineItems?: Omit<QuotationLineItem, "id" | "item">[];
  details?: QuotationDetails;
  hasBeenRevised?: boolean;
  priceChangeType?: "INCREASED" | "DECREASED" | "MAINTAINED";
  isActive?: boolean;
}

export interface Quotation {
  id: string;
  enquiryId: string;
  isActive: boolean;
  priceChangeType?: "INCREASED" | "DECREASED" | "MAINTAINED";
  quotationLineItems: QuotationLineItem[];
  quotationDetails: QuotationDetails[];
  status: QUOTATION_STATUS;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy?: ActivityUser;
  enquiry?: Enquiry;
  requestedRevision?: boolean;
  hasBeenRevised?: boolean;
}

export interface QuotationListParams {
  enquiryId?: string;
  createdById?: string;
  page?: number;
  perPage?: number;
}

// Visit Specifics
export interface Visit {
  id: string;
  appointmentId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  isActive?: boolean;
  isAccepted?: boolean;
  isCompleted?: boolean;
  visitSlot?: {
    id: string;
    fromDateTime: string;
    toDateTime: string;
  };
  createdBy?: ActivityUser;
  appointment?: Appointment;
}

export interface VisitListParams {
  appointmentId?: string;
  createdById?: string;
  page?: number;
  perPage?: number;
}
