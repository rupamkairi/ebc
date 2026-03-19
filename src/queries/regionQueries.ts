import { useQuery, UseQueryOptions, keepPreviousData } from "@tanstack/react-query";
import { locationService } from "@/services/locationService";
import { PincodeListParams, PincodeRecord } from "@/types/region";

export const regionKeys = {
  all: ["region"] as const,
  pincodes: (params: PincodeListParams) =>
    [...regionKeys.all, "pincodes", params] as const,
};

export function usePincodeRecordsQuery(
  params: PincodeListParams = {},
  options?: Partial<UseQueryOptions<PincodeRecord[], Error, PincodeRecord[]>>,
) {
  return useQuery({
    queryKey: regionKeys.pincodes(params),
    queryFn: () => locationService.getPincodeRecords(params),
    placeholderData: keepPreviousData,
    ...options,
  });
}
