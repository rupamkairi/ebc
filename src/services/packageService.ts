import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { CoinPackage } from "@/types/wallet";

export const packageService = {
  listPackages: async (): Promise<CoinPackage[]> => {
    return fetchClient<CoinPackage[]>(API_ENDPOINTS.WALLET.PACKAGES);
  },

  createUpdatePackage: async (
    data: Partial<CoinPackage>,
  ): Promise<CoinPackage> => {
    return fetchClient<CoinPackage>(API_ENDPOINTS.WALLET.PACKAGES, {
      method: "POST",
      body: data,
    });
  },
};
