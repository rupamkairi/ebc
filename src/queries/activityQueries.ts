import { activityService } from "@/services/activityService";
import {
  AppointmentListParams,
  CreateAppointmentRequest,
  CreateEnquiryRequest,
  EnquiryListParams,
} from "@/types/activity";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const activityKeys = {
  all: ["activity"] as const,
  enquiries: (params: EnquiryListParams) =>
    [...activityKeys.all, "enquiries", params] as const,
  enquiry: (id: string) => [...activityKeys.all, "enquiry", id] as const,
  appointments: (params: AppointmentListParams) =>
    [...activityKeys.all, "appointments", params] as const,
  appointment: (id: string) =>
    [...activityKeys.all, "appointment", id] as const,
};

// Enquiry Hooks
export function useEnquiriesQuery(params: EnquiryListParams = {}) {
  return useQuery({
    queryKey: activityKeys.enquiries(params),
    queryFn: () => activityService.getEnquiries(params),
    placeholderData: keepPreviousData,
  });
}

export function useEnquiryQuery(id: string) {
  return useQuery({
    queryKey: activityKeys.enquiry(id),
    queryFn: () => activityService.getEnquiry(id),
    enabled: !!id,
  });
}

export function useCreateEnquiryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEnquiryRequest) =>
      activityService.createEnquiry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

export function useDeleteEnquiryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activityService.deleteEnquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

// Appointment Hooks
export function useAppointmentsQuery(params: AppointmentListParams = {}) {
  return useQuery({
    queryKey: activityKeys.appointments(params),
    queryFn: () => activityService.getAppointments(params),
    placeholderData: keepPreviousData,
  });
}

export function useAppointmentQuery(id: string) {
  return useQuery({
    queryKey: activityKeys.appointment(id),
    queryFn: () => activityService.getAppointment(id),
    enabled: !!id,
  });
}

export function useCreateAppointmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) =>
      activityService.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

export function useDeleteAppointmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activityService.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}
