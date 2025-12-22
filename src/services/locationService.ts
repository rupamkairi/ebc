import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { PincodeRecord, PincodeListParams } from "@/types/region";

export const locationService = {
  async getPincodeRecords(params: PincodeListParams = {}) {
    return fetchClient<PincodeRecord[]>(API_ENDPOINTS.PINCODE_DIRECTORY.LIST, {
      method: "POST",
      body: params as Record<string, string | number | boolean>,
    });
  },
};
