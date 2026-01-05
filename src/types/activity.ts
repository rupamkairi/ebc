import { Item } from "./catalog";

// Shared definitions
export interface LineItem {
  id?: string;
  itemId: string;
  remarks?: string | null;
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
  enquiryLineItems: EnquiryLineItem[];
  enquiryDetails: EnquiryDetails[];
  status: string; // "PENDING", "APPROVED", "REJECTED" etc.
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy?: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    role: string;
  };
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
}

export interface AppointmentSlot {
  id?: string;
  remarks?: string;
  appointmentId?: string;
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
  createdBy?: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    role: string;
  };
}

export interface AppointmentListParams {
  createdById?: string;
  itemId?: string;
  search?: string;
  page?: number;
  perPage?: number;
}
