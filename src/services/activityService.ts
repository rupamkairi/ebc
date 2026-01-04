import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import {
  Appointment,
  AppointmentListParams,
  CreateAppointmentRequest,
  CreateEnquiryRequest,
  Enquiry,
  EnquiryListParams,
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
};
