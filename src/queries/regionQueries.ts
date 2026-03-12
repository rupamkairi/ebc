import { useQuery, UseQueryOptions, keepPreviousData } from "@tanstack/react-query";
import { locationService } from "@/services/locationService";
import { PincodeListParams } from "@/types/region";

export const regionKeys = {
  all: ["region"] as const,
  pincodes: (params: PincodeListParams) =>
    [...regionKeys.all, "pincodes", params] as const,
};

export function usePincodeRecordsQuery(
  params: PincodeListParams = {},
  options?: Partial<UseQueryOptions<any, any, any, any>>,
) {
  return useQuery({
    queryKey: regionKeys.pincodes(params),
    queryFn: () => locationService.getPincodeRecords(params),
    placeholderData: keepPreviousData,
    ...options,
  } as any);
}
