import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import {
  CoinPackage,
  WalletDetails,
  RechargeResponse,
  WalletTransaction,
  Wallet,
  WalletAdjustmentRequest,
  LeadPricingRequest,
  LeadPricing,
} from "@/types/wallet";

export const walletService = {
  getPackages: async (): Promise<CoinPackage[]> => {
    return fetchClient<CoinPackage[]>(API_ENDPOINTS.WALLET.PACKAGES);
  },

  getWalletDetails: async (entityId: string): Promise<WalletDetails> => {
    return fetchClient<WalletDetails>(
      `${API_ENDPOINTS.WALLET.DETAILS}${entityId}`,
    );
  },

  createRechargeOrder: async (
    packageId: string,
    entityId: string,
  ): Promise<RechargeResponse> => {
    return fetchClient<RechargeResponse>(API_ENDPOINTS.WALLET.RECHARGE, {
      method: "POST",
      body: { packageId, entityId },
    });
  },

  createTransaction: async (data: {
    walletId: string;
    cost: number;
    reason: string;
    type: "DEBIT";
    refType: string;
    refId: string;
  }): Promise<WalletTransaction> => {
    return fetchClient<WalletTransaction>(API_ENDPOINTS.TRANSACTION.BASE, {
      method: "POST",
      body: data,
    });
  },

  verifyPayment: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{ success: boolean }> => {
    return fetchClient<{ success: boolean }>(
      API_ENDPOINTS.WALLET.VERIFY_PAYMENT,
      {
        method: "POST",
        body: data,
      },
    );
  },

  // Admin Methods
  listWallets: async (): Promise<Wallet[]> => {
    return fetchClient<Wallet[]>(API_ENDPOINTS.WALLET.LIST);
  },

  adjustWallet: async (
    data: WalletAdjustmentRequest,
  ): Promise<WalletTransaction> => {
    return fetchClient<WalletTransaction>(API_ENDPOINTS.WALLET.ADJUST, {
      method: "POST",
      body: data,
    });
  },
};
