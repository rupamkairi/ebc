import { activityService } from "@/services/activityService";
import { walletKeys } from "./walletQueries";
import {
  AppointmentListParams,
  CreateAppointmentRequest,
  CreateEnquiryRequest,
  EnquiryListParams,
  AssignmentListParams,
  QuotationListParams,
  CreateQuotationRequest,
  VisitListParams,
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
  assignments: (params: AssignmentListParams) =>
    [...activityKeys.all, "assignments", params] as const,
  quotations: (params: QuotationListParams) =>
    [...activityKeys.all, "quotations", params] as const,
  quotation: (id: string) => [...activityKeys.all, "quotation", id] as const,
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

export function useCompleteEnquiryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activityService.completeEnquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

export function useCompleteAppointmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activityService.completeAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

export function useRejectAppointmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activityService.rejectAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

// Assignment Hooks
export function useAssignmentsQuery(params: AssignmentListParams = {}) {
  return useQuery({
    queryKey: activityKeys.assignments(params),
    queryFn: () => activityService.getAssignments(params),
    placeholderData: keepPreviousData,
  });
}

// Quotation Hooks
export function useQuotationsQuery(params: QuotationListParams = {}) {
  return useQuery({
    queryKey: activityKeys.quotations(params),
    queryFn: () => activityService.getQuotations(params),
    placeholderData: keepPreviousData,
  });
}

export function useQuotationQuery(id: string) {
  return useQuery({
    queryKey: activityKeys.quotation(id),
    queryFn: () => activityService.getQuotation(id),
    enabled: !!id,
  });
}

export function useCreateQuotationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateQuotationRequest) =>
      activityService.createQuotation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
  });
}

export function useUpdateQuotationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateQuotationRequest>;
    }) => activityService.updateQuotation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

export function useDeleteQuotationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activityService.deleteQuotation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

export function useAcceptQuotationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activityService.acceptQuotation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
  });
}

// Visit Hooks
export function useVisitsQuery(params: VisitListParams = {}) {
  return useQuery({
    queryKey: [...activityKeys.all, "visits", params],
    queryFn: () => activityService.getVisits(params),
    placeholderData: keepPreviousData,
  });
}

export function useAcceptVisitMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activityService.acceptVisit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
  });
}

export function useCreateVisitMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { appointmentId: string; visitSlotId: string }) =>
      activityService.createVisit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
  });
}
