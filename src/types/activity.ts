import { REF_TYPE, ACTIVITY_TYPE } from "@/constants/enums";
import { UnitType } from "@/constants/quantities";
import { Item } from "./catalog";

// Shared definitions
export { REF_TYPE };

export interface LineItem {
  id?: string;
  itemId: string;
  remarks?: string | null;
  item?: Item;
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
  status: string; // "PENDING", "APPROVED", "REJECTED" etc.
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
}

export interface CreateQuotationRequest {
  enquiryId: string;
  lineItems: Omit<QuotationLineItem, "id" | "item">[];
  details: QuotationDetails;
  hasBeenRevised?: boolean;
  priceChangeType?: "INCREASED" | "DECREASED" | "MAINTAINED";
}

export interface Quotation {
  id: string;
  enquiryId: string;
  isActive: boolean;
  requestedRevision: boolean;
  hasBeenRevised: boolean;
  priceChangeType?: "INCREASED" | "DECREASED" | "MAINTAINED";
  revisionRemarks?: string | null;
  quotationLineItems: QuotationLineItem[];
  quotationDetails: QuotationDetails[];
  status: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy?: ActivityUser;
  enquiry?: Enquiry;
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
