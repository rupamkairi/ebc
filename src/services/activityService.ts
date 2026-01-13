import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import {
  Appointment,
  AppointmentListParams,
  CreateAppointmentRequest,
  CreateEnquiryRequest,
  Enquiry,
  EnquiryListParams,
  ActivityAssignment,
  AssignmentListParams,
  Quotation,
  QuotationListParams,
  CreateQuotationRequest,
} from "@/types/activity";

export const activityService = {
  // Enquiry
  async createEnquiry(data: CreateEnquiryRequest) {
    return fetchClient<Enquiry>(API_ENDPOINTS.ACTIVITY.ENQUIRY.CREATE, {
      method: "POST",
      body: data,
    });
  },

  async getEnquiry(id: string) {
    return fetchClient<Enquiry>(`${API_ENDPOINTS.ACTIVITY.ENQUIRY.GET}/${id}`, {
      method: "GET",
    });
  },

  async deleteEnquiry(id: string) {
    return fetchClient(`${API_ENDPOINTS.ACTIVITY.ENQUIRY.DELETE}/${id}`, {
      method: "DELETE",
    });
  },

  async getEnquiries(params: EnquiryListParams = {}) {
    return fetchClient<Enquiry[]>(API_ENDPOINTS.ACTIVITY.ENQUIRY.LIST, {
      method: "POST",
      body: params as Record<string, string | number | boolean>,
    });
  },

  // Appointment
  async createAppointment(data: CreateAppointmentRequest) {
    return fetchClient<Appointment>(API_ENDPOINTS.ACTIVITY.APPOINTMENT.CREATE, {
      method: "POST",
      body: data,
    });
  },

  async getAppointment(id: string) {
    return fetchClient<Appointment>(
      `${API_ENDPOINTS.ACTIVITY.APPOINTMENT.GET}/${id}`,
      {
        method: "GET",
      }
    );
  },

  async deleteAppointment(id: string) {
    return fetchClient(`${API_ENDPOINTS.ACTIVITY.APPOINTMENT.DELETE}/${id}`, {
      method: "DELETE",
    });
  },

  async getAppointments(params: AppointmentListParams = {}) {
    return fetchClient<Appointment[]>(API_ENDPOINTS.ACTIVITY.APPOINTMENT.LIST, {
      method: "POST",
      body: params as Record<string, string | number | boolean>,
    });
  },

  async getAssignments(params: AssignmentListParams = {}) {
    return fetchClient<ActivityAssignment[]>(
      API_ENDPOINTS.ACTIVITY.ASSIGNMENT.LIST,
      {
        method: "POST",
        body: params as Record<string, string | number | boolean>,
      }
    );
  },

  // Quotation
  async createQuotation(data: CreateQuotationRequest) {
    return fetchClient<Quotation>(API_ENDPOINTS.ACTIVITY.QUOTATION.CREATE, {
      method: "POST",
      body: data,
    });
  },

  async getQuotation(id: string) {
    return fetchClient<Quotation>(
      `${API_ENDPOINTS.ACTIVITY.QUOTATION.GET}/${id}`,
      {
        method: "GET",
      }
    );
  },

  async deleteQuotation(id: string) {
    return fetchClient(`${API_ENDPOINTS.ACTIVITY.QUOTATION.DELETE}/${id}`, {
      method: "DELETE",
    });
  },

  async getQuotations(params: QuotationListParams = {}) {
    return fetchClient<Quotation[]>(API_ENDPOINTS.ACTIVITY.QUOTATION.LIST, {
      method: "POST",
      body: params as Record<string, string | number | boolean>,
    });
  },
};
