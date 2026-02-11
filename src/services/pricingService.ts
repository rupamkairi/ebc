import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { LeadPricing, LeadPricingRequest } from "@/types/wallet";

export const pricingService = {
  getPricingCost: async (leadType: string): Promise<{ cost: number }> => {
    return fetchClient<{ cost: number }>(
      `${API_ENDPOINTS.PRICING.BASE}/cost/${leadType}`,
    );
  },

  listPricing: async (): Promise<LeadPricing[]> => {
    return fetchClient<LeadPricing[]>(API_ENDPOINTS.PRICING.BASE);
  },

  updateLeadPricing: async (
    data: LeadPricingRequest,
  ): Promise<{ success: boolean }> => {
    return fetchClient<{ success: boolean }>(API_ENDPOINTS.PRICING.BASE, {
      method: "POST",
      body: data,
    });
  },
};
