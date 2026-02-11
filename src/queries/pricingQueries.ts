import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pricingService } from "@/services/pricingService";
import { LeadPricingRequest } from "@/types/wallet";

export const pricingKeys = {
  all: ["pricing"] as const,
  details: (leadType: string) =>
    [...pricingKeys.all, "details", leadType] as const,
  list: () => [...pricingKeys.all, "list"] as const,
};

export const useLeadPricing = (leadType: string | undefined) => {
  return useQuery({
    queryKey: pricingKeys.details(leadType || ""),
    queryFn: () => pricingService.getPricingCost(leadType!),
    enabled: !!leadType,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useLeadPricingList = () => {
  return useQuery({
    queryKey: pricingKeys.list(),
    queryFn: () => pricingService.listPricing(),
  });
};

export const useUpdateLeadPricingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LeadPricingRequest) =>
      pricingService.updateLeadPricing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingKeys.all });
    },
  });
};
