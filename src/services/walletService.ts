import fetchClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

export interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  priceInInr: number;
}

export interface Transaction {
  id: string;
  reason: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  createdAt: string;
  refType?: string;
  refId?: string;
  status: string;
}

export interface WalletDetails {
  balance: number;
  transactions: Transaction[];
}

export interface RechargeResponse {
  id?: string;
  orderId: string;
  amount: number;
  currency: string;
  key?: string; // Razorpay Key ID
}

export const walletService = {
  getPackages: async (): Promise<CoinPackage[]> => {
    return fetchClient<CoinPackage[]>(API_ENDPOINTS.WALLET.PACKAGES);
  },

  getWalletDetails: async (entityId: string): Promise<WalletDetails> => {
    return fetchClient<WalletDetails>(`${API_ENDPOINTS.WALLET.DETAILS}${entityId}`);
  },

  getPricingCost: async (leadType: string): Promise<{ cost: number }> => {
    return fetchClient<{ cost: number }>(`${API_ENDPOINTS.WALLET.PRICING}${leadType}`);
  },

  createRechargeOrder: async (packageId: string, entityId: string): Promise<RechargeResponse> => {
    return fetchClient<RechargeResponse>(API_ENDPOINTS.WALLET.RECHARGE, {
      method: "POST",
      body: { packageId, entityId },
    });
  },

  createTransaction: async (data: {
    walletId: string;
    cost: number;
    reason: string;
    type: 'DEBIT';
    refType: string;
    refId: string;
  }): Promise<Transaction> => {
    return fetchClient<Transaction>(API_ENDPOINTS.WALLET.TRANSACTION, {
      method: "POST",
      body: data,
    });
  },

  verifyPayment: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{ success: boolean }> => {
    return fetchClient<{ success: boolean }>(API_ENDPOINTS.WALLET.VERIFY_PAYMENT, {
      method: "POST",
      body: data,
    });
  },
};
