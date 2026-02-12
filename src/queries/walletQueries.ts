import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService } from "@/services/walletService";
import { WalletAdjustmentRequest } from "@/types/wallet";

export const walletKeys = {
  all: ["wallet"] as const,
  details: (entityId: string) =>
    [...walletKeys.all, "details", entityId] as const,
  packages: () => [...walletKeys.all, "packages"] as const,
  list: () => [...walletKeys.all, "list"] as const,
};

export const useWalletDetails = (entityId: string | undefined) => {
  return useQuery({
    queryKey: walletKeys.details(entityId || ""),
    queryFn: () => walletService.getWalletDetails(entityId!),
    enabled: !!entityId,
  });
};

export const useWalletPackages = () => {
  return useQuery({
    queryKey: walletKeys.packages(),
    queryFn: () => walletService.getPackages(),
  });
};

export const useWalletsQuery = () => {
  return useQuery({
    queryKey: walletKeys.list(),
    queryFn: () => walletService.listWallets(),
  });
};

export const useCreateRechargeOrder = () => {
  return useMutation({
    mutationFn: ({
      packageId,
      entityId,
    }: {
      packageId: string;
      entityId: string;
    }) => walletService.createRechargeOrder(packageId, entityId),
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => walletService.verifyPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
  });
};

export const useDebitWallet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      walletId: string;
      cost: number;
      reason: string;
      type: "DEBIT";
      refType: string;
      refId: string;
    }) => walletService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
  });
};

export const useAdjustWalletMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WalletAdjustmentRequest) =>
      walletService.adjustWallet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
  });
};
