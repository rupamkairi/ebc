import { Item } from "./catalog";

// Shared definitions
export interface LineItem {
  id?: string;
  itemId: string;
  remarks?: string;
  item?: Item;
}

// Enquiry Specifics
export interface EnquiryLineItem extends LineItem {
  quantity: number;
  unitType: string;
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
  lineItems: EnquiryLineItem[];
  details: EnquiryDetails;
  status: string; // "PENDING", "APPROVED", "REJECTED" etc.
  createdAt: string;
  updatedAt: string;
  createdById: string;
  // Add other fields as per response if known
}

export interface EnquiryListParams {
  createdById?: string;
  itemId?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

// Appointment Specifics
export interface AppointmentLineItem extends LineItem {}

export interface AppointmentDetails {
  remarks?: string;
}

export interface AppointmentSlot {
  remarks?: string;
  // Add date/time if defined in future, currently just remarks in docs example
}

export interface CreateAppointmentRequest {
  lineItems: Omit<AppointmentLineItem, "id" | "item">[];
  details: AppointmentDetails;
  slots: AppointmentSlot[];
}

export interface Appointment {
  id: string;
  lineItems: AppointmentLineItem[];
  details: AppointmentDetails;
  slots: AppointmentSlot[];
  status: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;
}

export interface AppointmentListParams {
  createdById?: string;
  itemId?: string;
  search?: string;
  page?: number;
  perPage?: number;
}
