import { Entity } from "./entity";
import { AdminUser } from "./auth";

export interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  priceInInr: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  reason: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  refType?: string;
  refId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  entityId: string;
  balance: number;
  entity?: Entity;
  owner?: AdminUser;
  createdAt: string;
  updatedAt: string;
  transactions?: WalletTransaction[];
}

export interface WalletDetails {
  balance: number;
  transactions: WalletTransaction[];
}

export interface WalletAdjustmentRequest {
  walletId: string;
  cost: number;
  type: "CREDIT" | "DEBIT";
  reason: string;
}

export interface LeadPricingRequest {
  leadType: string;
  costInCoins: number;
}

export interface RechargeResponse {
  id?: string;
  orderId: string;
  amount: number;
  currency: string;
  key?: string; // Razorpay Key ID
}
export interface LeadPricing {
  leadType: string;
  costInCoins: number;
}
