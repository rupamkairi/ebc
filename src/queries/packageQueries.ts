import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { packageService } from "@/services/packageService";
import { CoinPackage } from "@/types/wallet";

export const packageKeys = {
  all: ["packages"] as const,
  lists: () => [...packageKeys.all, "list"] as const,
};

export const useCoinPackagesList = () => {
  return useQuery({
    queryKey: packageKeys.lists(),
    queryFn: () => packageService.listPackages(),
  });
};

export const useCreateUpdateCoinPackageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CoinPackage>) =>
      packageService.createUpdatePackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
    },
  });
};

export const useDeleteCoinPackageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => packageService.deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: packageKeys.lists() });
    },
  });
};
