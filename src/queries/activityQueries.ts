import { activityService } from "@/services/activityService";
import { catalogService } from "@/services/catalogService";
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
import { useAuthStore } from "@/store/authStore";
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
  visits: (params: VisitListParams) =>
    [...activityKeys.all, "visits", params] as const,
  visit: (id: string) => [...activityKeys.all, "visit", id] as const,
};

// Enquiry Hooks
export function useEnquiriesQuery(params: EnquiryListParams = {}) {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: activityKeys.enquiries(params),
    queryFn: () => activityService.getEnquiries(params),
    placeholderData: keepPreviousData,
    enabled: !!token,
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
    mutationFn: async (data: CreateEnquiryRequest) => {
      const enquiry = await activityService.createEnquiry(data);

      try {
        // --- SMART ASSIGNMENT LOGIC ---
        const firstItem = data.lineItems[0];
        if (firstItem) {
          console.log(`[SmartAssign] Processing enquiry ${enquiry.id} for item ${firstItem.itemId}`);
          
          // 1. Get Category ID for the item
          const itemDetails = await catalogService.getItem(firstItem.itemId);
          const categoryId = itemDetails.categoryId;

          if (categoryId) {
            // 2. Try to find entities with this category in the target pincode
            // we use categoryId array as per types/catalog.ts
            console.log(`[SmartAssign] Searching local providers in pincode ${data.details.pincodeDirectoryId} for category ${categoryId}`);
            let listings = await catalogService.getItemListings({
              categoryId: [categoryId],
              pincodeId: data.details.pincodeDirectoryId,
            } as any);

            // 3. FALLBACK: If no results in pincode, find by category globally
            if (!listings || listings.length === 0) {
              console.log("[SmartAssign] No local providers found. Falling back to global sub-category assignment.");
              listings = await catalogService.getItemListings({ 
                categoryId: [categoryId] 
              } as any);
            }

            // 4. Assign to found entities
            if (listings && listings.length > 0) {
              // Extract unique entity IDs
              const entityIds = Array.from(new Set(listings.map((l: any) => l.entityId)));
              console.log(`[SmartAssign] Found ${entityIds.length} unique providers for assignment.`);
              
              // Assign to all identified providers (Broadcast)
              await Promise.allSettled(
                entityIds.map(entityId => 
                  activityService.createAssignment({
                    type: "ENQUIRY_ASSIGNMENT",
                    enquiryId: enquiry.id,
                    toEntityId: entityId
                  })
                )
              );
              console.log("[SmartAssign] Assignment process complete.");
            } else {
              console.log("[SmartAssign] No providers found even in global fallback.");
            }
          }
        }
      } catch (error) {
        console.error("[SmartAssign] Auto-assignment failed:", error);
      }

      return enquiry;
    },
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
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: activityKeys.appointments(params),
    queryFn: () => activityService.getAppointments(params),
    placeholderData: keepPreviousData,
    enabled: !!token,
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
    mutationFn: async (data: CreateAppointmentRequest) => {
      const appointment = await activityService.createAppointment(data);

      try {
        // --- SMART ASSIGNMENT LOGIC ---
        const firstItem = data.lineItems[0];
        if (firstItem) {
          console.log(`[SmartAssign] Processing appointment ${appointment.id} for item ${firstItem.itemId}`);
          
          // 1. Get Category ID for the item
          const itemDetails = await catalogService.getItem(firstItem.itemId);
          const categoryId = itemDetails.categoryId;

          if (categoryId) {
            // 2. Try to find entities with this category in the target pincode
            console.log(`[SmartAssign] Searching local providers in pincode ${data.details.pincodeDirectoryId} for category ${categoryId}`);
            let listings = await catalogService.getItemListings({
              categoryId: [categoryId],
              pincodeId: data.details.pincodeDirectoryId,
            } as any);

            // 3. FALLBACK: If no results in pincode, find by category globally
            if (!listings || listings.length === 0) {
              console.log("[SmartAssign] No local providers found. Falling back to global sub-category assignment.");
              listings = await catalogService.getItemListings({ 
                categoryId: [categoryId] 
              } as any);
            }

            // 4. Assign to found entities
            if (listings && listings.length > 0) {
              // Extract unique entity IDs
              const entityIds = Array.from(new Set(listings.map((l: any) => l.entityId)));
              console.log(`[SmartAssign] Found ${entityIds.length} unique providers for assignment.`);
              
              // Assign to all identified providers (Broadcast)
              await Promise.allSettled(
                entityIds.map(entityId => 
                  activityService.createAssignment({
                    type: "APPOINTMENT_ASSIGNMENT",
                    appointmentId: appointment.id,
                    toEntityId: entityId
                  })
                )
              );
              console.log("[SmartAssign] Assignment process complete.");
            } else {
              console.log("[SmartAssign] No providers found even in global fallback.");
            }
          }
        }
      } catch (error) {
        console.error("[SmartAssign] Auto-assignment failed:", error);
      }

      return appointment;
    },
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



// Assignment Hooks
export function useAssignmentsQuery(params: AssignmentListParams = {}) {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: activityKeys.assignments(params),
    queryFn: () => activityService.getAssignments(params),
    enabled: !!token,
  });
}

// Quotation Hooks
export function useQuotationsQuery(params: QuotationListParams = {}) {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: activityKeys.quotations(params),
    queryFn: () => activityService.getQuotations(params),
    enabled: !!token,
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

export function useRequestRevisionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activityService.requestRevision(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
  });
}

// Visit Hooks
export function useVisitsQuery(params: VisitListParams = {}) {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: activityKeys.visits(params),
    queryFn: () => activityService.getVisits(params),
    placeholderData: keepPreviousData,
    enabled: !!token,
  });
}

export function useVisitQuery(id: string) {
  return useQuery({
    queryKey: activityKeys.visit(id),
    queryFn: () => activityService.getVisit(id),
    enabled: !!id,
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

export function useCompleteVisitMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activityService.completeVisit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
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
