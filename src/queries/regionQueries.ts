import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/services/locationService";
import { PincodeListParams } from "@/types/region";
import { keepPreviousData } from "@tanstack/react-query";

export const regionKeys = {
  all: ["region"] as const,
  pincodes: (params: PincodeListParams) =>
    [...regionKeys.all, "pincodes", params] as const,
};

export function usePincodeRecordsQuery(params: PincodeListParams = {}) {
  return useQuery({
    queryKey: regionKeys.pincodes(params),
    queryFn: () => locationService.getPincodeRecords(params),
    placeholderData: keepPreviousData,
  });
}
